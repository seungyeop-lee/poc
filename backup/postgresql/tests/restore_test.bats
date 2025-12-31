# ============================================
# Restore Command Tests
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
# Restore Public Schema
# ============================================

@test "restore: restore public schema to target database" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"

  assert_success
  assert_output_contains "Restore completed"

  run table_exists "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users"
  [[ "$output" == "t" ]]
}

@test "restore: restore fails without FILE parameter" {
  run make restore

  assert_failure
  assert_output_contains "FILE is required"
}

# ============================================
# Restore All
# ============================================

@test "restore-all: restore entire database to target" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-all"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore-all FILE=$backup_file"

  assert_success
  assert_output_contains "Restore completed"
}

# ============================================
# Data Integrity After Restore
# ============================================

@test "restore: data integrity maintained after restore" {
  local source_count
  source_count=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  [[ "$source_count" -gt 0 ]]

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success

  run check_data_integrity \
    "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" \
    "$TARGET_DB_HOST" "$TARGET_DB_PORT" \
    "users"

  assert_success
}

@test "restore: all rows restored correctly" {
  local source_users
  source_users=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  local source_posts
  source_posts=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "posts")

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success

  local target_users
  target_users=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  local target_posts
  target_posts=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "posts")

  [[ "$source_users" == "$target_users" ]]
  [[ "$source_posts" == "$target_posts" ]]
}

# ============================================
# Restore to Source (Same DB)
# ============================================

@test "restore: restore to source database (A -> A)" {
  local original_count
  original_count=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  psql -h "$SOURCE_DB_HOST" -p "$SOURCE_DB_PORT" -U postgres -d postgres \
    -c "DELETE FROM users WHERE username = 'alice';" 1>/dev/null 2>/dev/null || true

  local after_delete_count
  after_delete_count=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  [[ "$after_delete_count" -lt "$original_count" ]]

  run bash -c "yes | DB_TARGET=source BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"

  assert_success

  local after_restore_count
  after_restore_count=$(count_rows "$SOURCE_DB_HOST" "$SOURCE_DB_PORT" "users")

  [[ "$after_restore_count" == "$original_count" ]]
}

# ============================================
# Restore Table
# ============================================

@test "restore-table: restore specific table data" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success

  local original_count
  original_count=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres \
    -c "DELETE FROM users WHERE username = 'alice';" 1>/dev/null 2>/dev/null || true

  local after_delete_count
  after_delete_count=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  [[ "$after_delete_count" -lt "$original_count" ]]

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore-table FILE=$backup_file TABLE=users"

  assert_success
  assert_output_contains "restored"

  local after_restore_count
  after_restore_count=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")

  [[ "$after_restore_count" == "$original_count" ]]
}

@test "restore-table: fails without TABLE parameter" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore-table FILE=$backup_file"

  assert_failure
  assert_output_contains "TABLE is required"
}

# ============================================
# Restore Table Full
# ============================================

@test "restore-table-full: restore table with structure" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore FILE=$backup_file"
  assert_success

  psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres \
    -c "ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;"

  psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres \
    -c "DROP TABLE IF EXISTS users;"

  run table_exists "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users"
  [[ "$output" == "f" ]]

  run bash -c "yes | DB_TARGET=target BACKUP_DIR=$TEST_BACKUP_DIR make restore-table-full FILE=$backup_file TABLE=users"

  assert_success

  run table_exists "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users"
  [[ "$output" == "t" ]]

  local final_count
  final_count=$(count_rows "$TARGET_DB_HOST" "$TARGET_DB_PORT" "users")
  [[ "$final_count" -gt 0 ]]
}
