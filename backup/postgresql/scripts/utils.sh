#!/bin/bash
# ============================================
# PostgreSQL Utilities Script
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

Utility Commands:
  list                               List available backups
  list-contents <file>               Show backup contents
  info                               Show database info (uses DB_TARGET)
  info-source                        Show source database info
  info-target                        Show target database info
  test-connection                    Test connection to database
  clean                              Remove old backups (7+ days)

Environment Variables:
  DB_TARGET=source|target            Which database to query (default: source)
  PGPASSWORD                         PostgreSQL password (required for info/test)

Examples:
  $0 list                    # List backups
  $0 list-contents backup.dump
  $0 info                    # Show DB info
  $0 info-source             # Show source DB info
  $0 info-target             # Show target DB info
  $0 clean                   # Remove old backups
EOF
}

cmd_info() {
    print_db_info
    echo ""

    check_env

    local pg_ver pg_major
    pg_ver=$(PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SHOW server_version;" | xargs)
    pg_major=$(echo "$pg_ver" | cut -d. -f1)
    echo "✅ Connection successful"
    echo "   PG Version:    $pg_ver"
    echo "   Docker Image:  postgres:${pg_major}-alpine"
}

cmd_info_source() {
    SOURCE_DB_HOST="$SOURCE_DB_HOST" \
    SOURCE_DB_PORT="$SOURCE_DB_PORT" \
    SOURCE_DB_USER="$SOURCE_DB_USER" \
    SOURCE_DB_NAME="$SOURCE_DB_NAME" \
    DB_HOST="$SOURCE_DB_HOST" \
    DB_PORT="$SOURCE_DB_PORT" \
    DB_USER="$SOURCE_DB_USER" \
    DB_NAME="$SOURCE_DB_NAME" \
    DB_TARGET="source" \
    print_source_info
    echo ""

    if [[ -z "${PGPASSWORD:-}" ]]; then
        echo "⚠️  Set PGPASSWORD to test connection"
        return 0
    fi

    local pg_ver
    if ! pg_ver=$(PGPASSWORD="$PGPASSWORD" psql -h "$SOURCE_DB_HOST" -p "$SOURCE_DB_PORT" -U "$SOURCE_DB_USER" -d "$SOURCE_DB_NAME" -t -c "SHOW server_version;" 2>&1); then
        echo "❌ Cannot connect to source database"
        echo "   $pg_ver"
        return 1
    fi

    pg_ver=$(echo "$pg_ver" | xargs)
    local pg_major
    pg_major=$(echo "$pg_ver" | cut -d. -f1)
    echo "✅ Connection successful"
    echo "   PG Version:    $pg_ver"
}

cmd_info_target() {
    print_target_info
    echo ""

    if [[ -z "${PGPASSWORD:-}" ]]; then
        echo "⚠️  Set PGPASSWORD to test connection"
        return 0
    fi

    local pg_ver
    if ! pg_ver=$(PGPASSWORD="$PGPASSWORD" psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U "$TARGET_DB_USER" -d "$TARGET_DB_NAME" -t -c "SHOW server_version;" 2>&1); then
        echo "❌ Cannot connect to target database"
        echo "   $pg_ver"
        return 1
    fi

    pg_ver=$(echo "$pg_ver" | xargs)
    local pg_major
    pg_major=$(echo "$pg_ver" | cut -d. -f1)
    echo "✅ Connection successful"
    echo "   PG Version:    $pg_ver"
}

cmd_test_connection() {
    echo "🔍 Testing database connections..."
    echo ""

    local all_ok=true

    # Test source
    echo "Source Database ($SOURCE_DB_HOST:$SOURCE_DB_PORT):"
    if [[ -n "${PGPASSWORD:-}" ]]; then
        if pg_ver=$(PGPASSWORD="$PGPASSWORD" psql -h "$SOURCE_DB_HOST" -p "$SOURCE_DB_PORT" -U "$SOURCE_DB_USER" -d "$SOURCE_DB_NAME" -t -c "SELECT 'OK';" 2>&1); then
            echo "   ✅ Connected"
        else
            echo "   ❌ Failed: $pg_ver"
            all_ok=false
        fi
    else
        echo "   ⚠️  Set PGPASSWORD to test"
        all_ok=false
    fi

    echo ""

    # Test target
    echo "Target Database ($TARGET_DB_HOST:$TARGET_DB_PORT):"
    if [[ -n "${PGPASSWORD:-}" ]]; then
        if pg_ver=$(PGPASSWORD="$PGPASSWORD" psql -h "$TARGET_DB_HOST" -p "$TARGET_DB_PORT" -U "$TARGET_DB_USER" -d "$TARGET_DB_NAME" -t -c "SELECT 'OK';" 2>&1); then
            echo "   ✅ Connected"
        else
            echo "   ❌ Failed: $pg_ver"
            all_ok=false
        fi
    else
        echo "   ⚠️  Set PGPASSWORD to test"
        all_ok=false
    fi

    echo ""
    if [[ "$all_ok" == "true" ]]; then
        echo "✅ All connections successful"
    else
        echo "⚠️  Some connections failed"
    fi
}

cmd_list() {
    echo "📁 Available backups:"
    if [[ -d "$BACKUP_DIR" ]]; then
        ls -lh "$BACKUP_DIR"/*.dump 2>/dev/null | awk '{print $9, "(size:", $5")"}' || echo "No backups found"
    else
        echo "No backups found"
    fi
}

cmd_list_contents() {
    local file="${1:-}"
    if [[ -z "$file" ]]; then
        echo "❌ Error: FILE is required. Usage: $0 list-contents <file>"
        exit 1
    fi

    check_env
    local filename
    filename=$(basename "$file")
    echo "📋 Contents of $file:"
    docker_run pg_restore -l "/backups/$filename"
}

cmd_clean() {
    echo "🧹 Removing backups older than 7 days..."
    find "$BACKUP_DIR" -name "*.dump" -mtime +7 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name ".fk_*.sql" -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name ".txn_*.sql" -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name ".data_*.sql" -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name ".restore_*.sql" -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name ".restore_list_*.txt" -delete 2>/dev/null || true
    rm -f "$PG_MAJOR_FILE" 2>/dev/null || true
    echo "✅ Cleanup completed"
}

# ============================================
# Main
# ============================================

main() {
    local cmd="${1:-help}"
    shift || true

    case "$cmd" in
        help)              cmd_help ;;
        list)              cmd_list ;;
        list-contents)     cmd_list_contents "$@" ;;
        info)              cmd_info ;;
        info-source)       cmd_info_source ;;
        info-target)       cmd_info_target ;;
        test-connection)   cmd_test_connection ;;
        clean)             cmd_clean ;;
        *)
            echo "❌ Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
