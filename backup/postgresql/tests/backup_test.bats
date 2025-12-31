# ============================================
# Backup Command Tests
# ============================================

load helpers

# setup/teardown are inherited from helpers.bash

# ============================================
# Backup Public Schema
# ============================================

@test "backup: backup public schema creates dump file" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-public"

  assert_success
  assert_output_contains "Backup completed"
  assert_backup_exists
}

@test "backup: backup creates file in backup directory" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"

  assert_success

  local backup_file
  backup_file=$(get_latest_backup)
  assert_file_exists "$backup_file"
}

@test "backup: backup file contains public schema" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"

  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make list-contents FILE=$backup_file"
  assert_success
  assert_output_contains "users"
  assert_output_contains "posts"
}

# ============================================
# Backup All Schemas
# ============================================

@test "backup-all: backup entire database" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-all"

  assert_success
  assert_output_contains "Backup completed"
  assert_backup_exists
}

@test "backup-all: backup file has correct naming" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-all"

  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  [[ "$backup_file" =~ backup_all_.*\.dump ]]
}

# ============================================
# Backup Table
# ============================================

@test "backup-table: backup specific table" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-table TABLE=users"

  assert_success
  assert_output_contains "Backup completed"
  assert_backup_exists
}

@test "backup-table: backup table file contains only that table" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-table TABLE=users"

  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make list-contents FILE=$backup_file"
  assert_success
  assert_output_contains "users"
}

@test "backup-table: fails without TABLE parameter" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup-table"

  assert_failure
  assert_output_contains "TABLE is required"
}

# ============================================
# Backup Multiple Schemas
# ============================================

@test "backup: backup multiple schemas with SCHEMAS parameter" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup SCHEMAS=\"public\""

  assert_success
  assert_output_contains "Backup completed"
}

# ============================================
# Backup File Properties
# ============================================

@test "backup: backup file is not empty" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"

  assert_success

  local backup_file
  backup_file=$(get_latest_backup)

  local file_size
  file_size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null)

  [[ "$file_size" -gt 0 ]]
}

@test "backup: multiple backups create different files" {
  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  sleep 1

  run bash -c "BACKUP_DIR=$TEST_BACKUP_DIR make backup"
  assert_success

  local backups
  backups=$(ls -1 "$TEST_BACKUP_DIR"/*.dump 2>/dev/null | wc -l)

  [[ "$backups" -ge 2 ]]
}
