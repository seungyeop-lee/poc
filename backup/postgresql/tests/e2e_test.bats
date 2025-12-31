# ============================================
# End-to-End Scenario Tests
# ============================================

load helpers

setup() {
  global_setup
  clear_target_db
}

teardown() {
  global_teardown
}

# ============================================
# Scenario 1: A 백업 → A 복구 (Same DB)
# ============================================

@test "e2e: scenario 1 - backup source and restore to source (A -> A)" {
  local initial_users
  initial_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")
  local initial_posts
  initial_posts=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "posts")

  echo "Initial: users=$initial_users, posts=$initial_posts"

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success
  assert_output_contains "Backup completed"

  local backup_file
  backup_file=$(get_latest_backup)
  echo "Backup created: $backup_file"

  local timestamp
  timestamp=$(date +%s)
  psql -h "$SOURCE_DB_HOST" -p "$SOURCE_DB_PORT" -U postgres -d postgres \
    -c "INSERT INTO users (username, email) VALUES ('temp_user_$timestamp', 'temp_$timestamp@example.com');"

  local modified_users
  modified_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")
  echo "Modified: users=$modified_users"

  [[ "$modified_users" -gt "$initial_users" ]]

  run bash -c "yes | DB_TARGET=source BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success
  assert_output_contains "Restore completed"

  local final_users
  final_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")
  local final_posts
  final_posts=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "posts")

  echo "Final: users=$final_users, posts=$final_posts"

  [[ "$final_users" == "$initial_users" ]]
  [[ "$final_posts" == "$initial_posts" ]]
}

# ============================================
# Scenario 2: A 백업 → B 복구 (Copy to Target)
# ============================================

@test "e2e: scenario 2 - backup source and restore to target (A -> B)" {
  local source_users
  source_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")
  local source_posts
  source_posts=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "posts")

  echo "Source: users=$source_users, posts=$source_posts"

  local target_users_before
  target_users_before=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users" 2>/dev/null || echo "0")
  echo "Target before: users=$target_users_before"

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)
  echo "Backup created: $backup_file"

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success
  assert_output_contains "Restore completed"

  local target_users_after
  target_users_after=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")
  local target_posts_after
  target_posts_after=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "posts")

  echo "Target after: users=$target_users_after, posts=$target_posts_after"

  [[ "$target_users_after" == "$source_users" ]]
  [[ "$target_posts_after" == "$source_posts" ]]

  local source_users_after
  source_users_after=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  [[ "$source_users_after" == "$source_users" ]]
}

# ============================================
# Scenario 3: Full Database Clone
# ============================================

@test "e2e: scenario 3 - full database clone from source to target" {
  local source_users
  source_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")
  local source_posts
  source_posts=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "posts")

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-all"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore-all FILE=$backup_file"
  assert_success

  local target_users
  target_users=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")
  local target_posts
  target_posts=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "posts")

  [[ "$target_users" == "$source_users" ]]
  [[ "$target_posts" == "$source_posts" ]]

  run table_exists "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users"
  [[ "$output" == "t" ]]

  run table_exists "$TARGET_DB_HOST" "$TARGET_DB_PORT" "posts"
  [[ "$output" == "t" ]]
}

# ============================================
# Scenario 4: Incremental Backup Simulation
# ============================================

@test "e2e: scenario 4 - multiple backup and restore cycles" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup1
  backup1=$(get_latest_backup)

  # Use unique username to avoid conflicts
  local timestamp
  timestamp=$(date +%s)
  psql -h "$SOURCE_DB_HOST" -p "$SOURCE_DB_PORT" -U postgres -d postgres \
    -c "INSERT INTO users (username, email) VALUES ('user2_$timestamp', 'user2_$timestamp@example.com');"

  local count_after_insert
  count_after_insert=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  sleep 1

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup2
  backup2=$(get_latest_backup)

  [[ "$backup1" != "$backup2" ]]

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup1"
  assert_success

  local target_count_backup1
  target_count_backup1=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup2"
  assert_success

  local target_count_backup2
  target_count_backup2=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  [[ "$target_count_backup2" == "$count_after_insert" ]]
}

# ============================================
# Scenario 5: Table-Level Clone
# ============================================

@test "e2e: scenario 5 - clone specific table from source to target" {
  local source_users
  source_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-table TABLE=users"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  # Drop FK and table in target first
  psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres \
    -c "ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;" 1>/dev/null 2>/dev/null || true
  psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres \
    -c "DROP TABLE IF EXISTS users;" 1>/dev/null 2>/dev/null || true

  # Restore the sequence first
  run bash -c "PGPASSWORD=postgres pg_restore -h $TARGET_DB_HOST -p $TARGET_DB_PORT -U postgres -d postgres -t users_id_seq $backup_file"

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore-table-full FILE=$backup_file TABLE=users"
  assert_success

  local target_users
  target_users=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  [[ "$target_users" == "$source_users" ]]

  run table_exists "$TARGET_DB_HOST" "$TARGET_DB_PORT" "posts"
  [[ "$output" == "f" ]]
}

# ============================================
# Scenario 6: Connection Test
# ============================================

@test "e2e: scenario 6 - test connections to both databases" {
  run make test-connection

  assert_success
  assert_output_contains "Source Database"
  assert_output_contains "Target Database"
  assert_output_contains "Connected"
}

# ============================================
# Scenario 7: List and Info Commands
# ============================================

@test "e2e: scenario 7 - list and info commands work correctly" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  run make list
  assert_success
  assert_output_contains ".dump"

  local backup_file
  backup_file=$(get_latest_backup)
  local backup_name
  backup_name=$(basename "$backup_file")

  run make list-contents FILE="$backup_name"
  assert_success
  assert_output_contains "users"
}

# ============================================
# Scenario 8: Foreign Key Relationships
# ============================================

@test "e2e: scenario 8 - foreign key relationships preserved after restore" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success

  local fk_count
  fk_count=$(psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres -tAc "
    SELECT COUNT(*) FROM pg_constraint
    WHERE contype = 'f'
    AND conrelid::regclass::text IN ('users', 'posts');
    " 2>/dev/null || echo "0")

  [[ "$fk_count" -gt 0 ]]

  run psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres -c "
    INSERT INTO posts (user_id, title, content) VALUES (99999, 'Invalid', 'Should fail');
  "

  [[ "$status" -ne 0 ]]
}
