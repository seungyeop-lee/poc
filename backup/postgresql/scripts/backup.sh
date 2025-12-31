#!/bin/bash
# ============================================
# PostgreSQL Backup Script
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

# ============================================
# Commands
# ============================================

cmd_help() {
    cat <<EOF
Usage: $0 <command> [options]

Backup Commands (from SOURCE database):
  backup [schema...]                 Backup specified schemas (default: public)
  backup-public                      Backup public schema only
  backup-all                         Backup entire database (all schemas)
  backup-table <table>               Backup specific table

Environment Variables:
  DB_TARGET=source|target            Which database to backup (default: source)
  SOURCE_DB_HOST, SOURCE_DB_PORT     Source database config
  BACKUP_DIR                         Backup directory (default: ./backups)
  PGPASSWORD                         PostgreSQL password (required)

Examples:
  $0 backup                    # Backup public schema from source
  $0 backup public auth        # Backup public and auth schemas
  $0 backup-all                # Backup entire database
  $0 backup-table users        # Backup specific table
EOF
}

cmd_backup() {
    local schemas=("$@")
    if [[ ${#schemas[@]} -eq 0 ]]; then
        schemas=("public")
    fi

    print_db_info
    echo ""

    check_env

    local schema_args=()
    local schema_names=""
    for schema in "${schemas[@]}"; do
        schema_args+=("-n" "$schema")
        schema_names="${schema_names}_${schema}"
    done
    schema_names="${schema_names#_}"

    echo "🔄 Backing up schemas: ${schemas[*]}..."
    docker_run pg_dump -h "$DOCKER_DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        "${schema_args[@]}" \
        -F c \
        -v \
        -f "/backups/backup_${schema_names}_${TIMESTAMP}.dump"
    echo "✅ Backup completed: backup_${schema_names}_${TIMESTAMP}.dump"
}

cmd_backup_public() {
    cmd_backup "public"
}

cmd_backup_all() {
    print_db_info
    echo ""

    check_env
    echo "🔄 Starting full database backup (all schemas)..."
    docker_run pg_dump -h "$DOCKER_DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -F c \
        -v \
        -f "/backups/backup_all_${TIMESTAMP}.dump"
    echo "✅ Backup completed: backup_all_${TIMESTAMP}.dump"
}

cmd_backup_table() {
    local table="${1:-}"
    if [[ -z "$table" ]]; then
        echo "❌ Error: TABLE is required. Usage: $0 backup-table <table>"
        exit 1
    fi

    print_db_info
    echo ""

    check_env
    local safe_table="${table//./_}"
    echo "🔄 Backing up table: $table..."
    docker_run pg_dump -h "$DOCKER_DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -t "$table" \
        -F c \
        -v \
        -f "/backups/backup_${safe_table}_${TIMESTAMP}.dump"
    echo "✅ Backup completed: backup_${safe_table}_${TIMESTAMP}.dump"
}

# ============================================
# Main
# ============================================

main() {
    local cmd="${1:-help}"
    shift || true

    case "$cmd" in
        help)              cmd_help ;;
        backup)            cmd_backup "$@" ;;
        backup-public)     cmd_backup_public ;;
        backup-all)        cmd_backup_all ;;
        backup-table)      cmd_backup_table "$@" ;;
        *)
            echo "❌ Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
