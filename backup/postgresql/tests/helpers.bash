# ============================================
# Test Helpers for PostgreSQL Backup/Restore
# ============================================

# Test directories
TEST_ROOT_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
TEST_PROJECT_DIR="$(dirname "$TEST_ROOT_DIR")"
TEST_BACKUP_DIR="$TEST_PROJECT_DIR/tests/tmp/backups"
TEST_LOG_DIR="$TEST_PROJECT_DIR/tests/tmp/logs"

# Database credentials
export PGPASSWORD=postgres
export SOURCE_DB_HOST=127.0.0.1
export SOURCE_DB_PORT=5432
export SOURCE_DB_USER=postgres
export SOURCE_DB_NAME=postgres
export TARGET_DB_HOST=127.0.0.1
export TARGET_DB_PORT=5433
export TARGET_DB_USER=postgres
export TARGET_DB_NAME=postgres
export BACKUP_DIR="$TEST_BACKUP_DIR"

# Change to project directory for all tests
cd "$TEST_PROJECT_DIR"

# ============================================
# Setup/Teardown
# ============================================

global_setup() {
  # Create temp directories
  mkdir -p "$TEST_BACKUP_DIR"
  mkdir -p "$TEST_LOG_DIR"

  # Databases are started by Makefile before tests run
}

global_teardown() {
  # Clean up temp files (keep on failure for debugging)
  if [[ "$BATS_TEST_COMPLETED" == "1" ]]; then
    rm -rf "$TEST_PROJECT_DIR/tests/tmp"
  else
    echo "Test failed. Artifacts preserved in: $TEST_PROJECT_DIR/tests/tmp"
  fi
}

# Default setup/teardown (can be overridden in test files)
setup() {
  global_setup
}

teardown() {
  global_teardown
}

# ============================================
# Helper Functions
# ============================================

run_backup() {
  local schemas="${1:-public}"
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup SCHEMAS='$schemas'"
}

run_restore() {
  local file=$1
  local target="${2:-target}"
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR DB_TARGET=$target make restore FILE=$file"
}

get_latest_backup() {
  ls -t "$TEST_BACKUP_DIR"/*.dump 2>/dev/null | head -1
}

count_rows() {
  local db_host=$1
  local db_port=$2
  local table=$3
  psql -h "$db_host" -p "$db_port" -U postgres -d postgres -tAc "SELECT COUNT(*) FROM $table" 2>/dev/null || echo "0"
}

table_exists() {
  local db_host=$1
  local db_port=$2
  local table=$3
  psql -h "$db_host" -p "$db_port" -U postgres -d postgres -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table')" 2>/dev/null
}

check_data_integrity() {
  local source_host=$1
  local source_port=$2
  local target_host=$3
  local target_port=$4
  local table=$5

  local source_count
  local target_count

  source_count=$(count_rows "$source_host" "$source_port" "$table")
  target_count=$(count_rows "$target_host" "$target_port" "$table")

  if [[ "$source_count" == "$target_count" ]]; then
    echo "✓ Data integrity check passed for $table: $source_count rows"
    return 0
  else
    echo "✗ Data integrity check failed for $table: source=$source_count, target=$target_count"
    return 1
  fi
}

# ============================================
# Assertions
# ============================================

assert_success() {
  [[ "$status" -eq 0 ]]
}

assert_failure() {
  [[ "$status" -ne 0 ]]
}

assert_output_contains() {
  [[ "$output" == *"$1"* ]]
}

assert_backup_exists() {
  run ls "$TEST_BACKUP_DIR"/*.dump 2>/dev/null
  [[ "$status" -eq 0 ]]
}

assert_file_exists() {
  [[ -f "$1" ]]
}

# ============================================
# Database Test Helpers
# ============================================

init_test_data() {
  psql -h "$SOURCE_DB_HOST" -p "$SOURCE_DB_PORT" -U postgres -d postgres -c "
    INSERT INTO users (username, email) VALUES
      ('test1', 'test1@example.com'),
      ('test2', 'test2@example.com')
    ON CONFLICT (username) DO NOTHING;
  " 1>/dev/null 2>/dev/null || true
}

clear_target_db() {
  psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U postgres -d postgres -c "
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  " 1>/dev/null 2>/dev/null || true
}
