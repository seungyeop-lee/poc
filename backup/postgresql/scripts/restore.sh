#!/bin/bash
# ============================================
# PostgreSQL Restore Script
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

Restore Commands:
  restore <file> [schema...]         Restore to TARGET database (default: public)
  restore-public <file>              Restore public schema to TARGET
  restore-all <file>                 Restore entire database to TARGET
  restore-table <file> <table>       Restore table data only
  restore-table-full <file> <table>  Restore table with structure (DROP + CREATE)

Environment Variables:
  DB_TARGET=source|target            Which database to restore (default: target)
  TARGET_DB_HOST, TARGET_DB_PORT     Target database config
  BACKUP_DIR                         Backup directory (default: ./backups)
  PGPASSWORD                         PostgreSQL password (required)

Scenarios:
  1. Same DB restore (A → A):
     export DB_TARGET=source
     make restore FILE=backup.dump

  2. Cross DB restore (A → B):
     export DB_TARGET=target   # default
     make restore FILE=backup.dump

Examples:
  $0 restore backup_public.dump          # Restore to target DB
  $0 restore backup.dump public auth     # Restore specific schemas
  $0 restore-all backup_all.dump         # Restore entire database
  $0 restore-table backup.dump users     # Restore table data only
EOF
}

cmd_restore() {
    local file="${1:-}"
    shift || true
    local schemas=("$@")

    if [[ -z "$file" ]]; then
        echo "❌ Error: FILE is required. Usage: $0 restore <file> [schema...]"
        exit 1
    fi

    if [[ ${#schemas[@]} -eq 0 ]]; then
        schemas=("public")
    fi

    print_db_info
    echo ""
    echo "⚠️  WARNING: This will overwrite schemas: ${schemas[*]}"
    confirm || exit 0

    check_env
    local filename
    filename=$(basename "$file")

    local schema_args=()
    for schema in "${schemas[@]}"; do
        schema_args+=("-n" "$schema")
    done

    echo "🔄 Restoring schemas: ${schemas[*]} from $file..."
    local restore_exit_code=0
    docker_run pg_restore -h "$DOCKER_DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        "${schema_args[@]}" \
        --clean \
        --if-exists \
        --no-owner \
        --no-acl \
        -v \
        "/backups/$filename" || restore_exit_code=$?

    if [[ $restore_exit_code -eq 0 ]]; then
        echo "✅ Restore completed successfully"
    elif [[ $restore_exit_code -eq 1 ]]; then
        echo "⚠️  Restore completed with warnings (exit code 1)"
        echo "   Some objects may have been skipped. Check output above."
    else
        echo "❌ Restore failed with errors (exit code $restore_exit_code)"
        exit $restore_exit_code
    fi
}

cmd_restore_public() {
    local file="${1:-}"
    if [[ -z "$file" ]]; then
        echo "❌ Error: FILE is required. Usage: $0 restore-public <file>"
        exit 1
    fi
    cmd_restore "$file" "public"
}

cmd_restore_all() {
    local file="${1:-}"
    if [[ -z "$file" ]]; then
        echo "❌ Error: FILE is required. Usage: $0 restore-all <file>"
        exit 1
    fi

    print_db_info
    echo ""
    echo "⚠️  WARNING: This will attempt to restore ENTIRE database!"
    echo "   System schemas may have permission errors."
    confirm || exit 0

    check_env
    local filename
    filename=$(basename "$file")
    echo "🔄 Restoring entire database from $file..."
    docker_run pg_restore -h "$DOCKER_DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --clean \
        --if-exists \
        -v \
        "/backups/$filename" || {
        echo "⚠️  Some errors occurred (expected for system schemas)"
        echo "   Check above for details. Public schema data should be restored."
    }
    echo "✅ Restore completed (with possible warnings)"
}

_prepare_table_data_restore_script() {
    local table="$1"
    local filename="$2"
    local pg_major
    pg_major=$(get_pg_major)

    # Extract data-only SQL from backup
    docker run --rm $DOCKER_HOST_FLAG \
        -v "$BACKUP_DIR:/backups" \
        "postgres:${pg_major}-alpine" \
        pg_restore -t "$table" --data-only -f "/backups/.data_${table}.sql" "/backups/$filename" 2>/dev/null || true

    # Build transaction script with FK trigger bypass
    {
        echo "BEGIN;"
        echo "SET session_replication_role = 'replica';"
        echo "DELETE FROM $table;"
        cat "$BACKUP_DIR/.data_${table}.sql" 2>/dev/null || true
        echo "SET session_replication_role = 'origin';"
        echo "COMMIT;"
    } > "$BACKUP_DIR/.txn_data_${table}.sql"
}

_prepare_table_restore_scripts() {
    local table="$1"
    local filename="$2"

    # Generate FK drop SQL
    docker_psql_quiet -t -A \
        -c "SELECT 'ALTER TABLE ' || nsp.nspname || '.' || quote_ident(rel.relname) ||
            ' DROP CONSTRAINT ' || con.conname || ';'
            FROM pg_constraint con
            JOIN pg_class rel ON rel.oid = con.conrelid
            JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
            JOIN pg_class ref ON ref.oid = con.confrelid
            WHERE con.contype = 'f' AND ref.relname = '$table';" > "$BACKUP_DIR/.fk_drop_${table}.sql"

    # Generate FK add SQL
    docker_psql_quiet -t -A \
        -c "SELECT 'ALTER TABLE ' || nsp.nspname || '.' || quote_ident(rel.relname) ||
            ' ADD CONSTRAINT ' || con.conname || ' FOREIGN KEY (' ||
            (SELECT string_agg(a.attname, ', ' ORDER BY c.ord)
                FROM pg_attribute a
                JOIN unnest(con.conkey) WITH ORDINALITY AS c(num, ord) ON a.attnum = c.num
                WHERE a.attrelid = con.conrelid) ||
            ') REFERENCES ' || ref_nsp.nspname || '.' || quote_ident(ref.relname) || '(' ||
            (SELECT string_agg(a.attname, ', ' ORDER BY c.ord)
                FROM pg_attribute a
                JOIN unnest(con.confkey) WITH ORDINALITY AS c(num, ord) ON a.attnum = c.num
                WHERE a.attrelid = con.confrelid) || ');'
            FROM pg_constraint con
            JOIN pg_class rel ON rel.oid = con.conrelid
            JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
            JOIN pg_class ref ON ref.oid = con.confrelid
            JOIN pg_namespace ref_nsp ON ref_nsp.oid = ref.relnamespace
            WHERE con.contype = 'f' AND ref.relname = '$table';" > "$BACKUP_DIR/.fk_add_${table}.sql"

    # Generate restore SQL from backup
    docker_pg_restore_to_file ".restore_${table}.sql" "/backups/$filename" "$table"

    # Build transaction script
    {
        echo "BEGIN;"
        cat "$BACKUP_DIR/.fk_drop_${table}.sql" 2>/dev/null || true
        echo "DROP TABLE IF EXISTS $table;"
        cat "$BACKUP_DIR/.restore_${table}.sql" 2>/dev/null || true
        cat "$BACKUP_DIR/.fk_add_${table}.sql" 2>/dev/null || true
        echo "COMMIT;"
    } > "$BACKUP_DIR/.txn_${table}.sql"
}

_cleanup_table_restore_scripts() {
    local table="$1"
    rm -f "$BACKUP_DIR/.fk_drop_${table}.sql" \
          "$BACKUP_DIR/.fk_add_${table}.sql" \
          "$BACKUP_DIR/.restore_${table}.sql" \
          "$BACKUP_DIR/.restore_list_${table}.txt" \
          "$BACKUP_DIR/.txn_${table}.sql" \
          "$BACKUP_DIR/.data_${table}.sql" \
          "$BACKUP_DIR/.txn_data_${table}.sql"
}

cmd_restore_table() {
    local file="${1:-}"
    local table="${2:-}"

    if [[ -z "$file" ]]; then
        echo "❌ Error: FILE is required. Usage: $0 restore-table <file> <table>"
        exit 1
    fi
    if [[ -z "$table" ]]; then
        echo "❌ Error: TABLE is required. Usage: $0 restore-table <file> <table>"
        exit 1
    fi

    print_db_info
    echo ""
    echo "⚠️  WARNING: This will DELETE and restore data in $table!"
    echo "   All changes run in a transaction (rollback on failure)."
    confirm || exit 0

    check_env
    local filename
    filename=$(basename "$file")

    echo "🔄 Preparing data restore script..."
    _prepare_table_data_restore_script "$table" "$filename"

    if [[ ! -s "$BACKUP_DIR/.data_${table}.sql" ]]; then
        echo "❌ Error: No data found for table '$table' in backup"
        _cleanup_table_restore_scripts "$table"
        exit 1
    fi

    echo "🔄 Executing restore in transaction..."
    if ! docker_psql_quiet -v ON_ERROR_STOP=1 -f "/backups/.txn_data_${table}.sql"; then
        echo "❌ Error: Restore failed - transaction rolled back, no data lost"
        _cleanup_table_restore_scripts "$table"
        exit 1
    fi

    _cleanup_table_restore_scripts "$table"
    echo "✅ Table $table data restored"
}

_cleanup_orphaned_sequences() {
    local table="$1"

    # Find and drop orphaned sequences that match the table's pattern
    # When a table is dropped without CASCADE, sequences may remain
    local sequences
    sequences=$(docker_psql_quiet -t -A \
        -c "SELECT sequence_name FROM information_schema.sequences
            WHERE sequence_name LIKE '${table}_%_seq';" 2>/dev/null || true)

    if [[ -n "$sequences" ]]; then
        for seq in $sequences; do
            docker_psql_quiet -c "DROP SEQUENCE IF EXISTS $seq CASCADE;" 1>/dev/null 2>&1 || true
        done
    fi
}

cmd_restore_table_full() {
    local file="${1:-}"
    local table="${2:-}"

    if [[ -z "$file" ]]; then
        echo "❌ Error: FILE is required. Usage: $0 restore-table-full <file> <table>"
        exit 1
    fi
    if [[ -z "$table" ]]; then
        echo "❌ Error: TABLE is required. Usage: $0 restore-table-full <file> <table>"
        exit 1
    fi

    print_db_info
    echo ""
    echo "⚠️  WARNING: This will DROP and recreate $table!"
    echo "   All changes run in a transaction (rollback on failure)."
    confirm || exit 0

    check_env
    local filename
    filename=$(basename "$file")

    echo "🔄 Preparing restore scripts..."
    _prepare_table_restore_scripts "$table" "$filename"

    # Clean up orphaned sequences before the transaction
    _cleanup_orphaned_sequences "$table"

    echo "🔄 Executing restore in transaction..."
    docker_psql_quiet -v ON_ERROR_STOP=1 -f "/backups/.txn_${table}.sql"

    _cleanup_table_restore_scripts "$table"
    echo "✅ Table $table fully restored"
}

# ============================================
# Main
# ============================================

main() {
    local cmd="${1:-help}"
    shift || true

    case "$cmd" in
        help)              cmd_help ;;
        restore)           cmd_restore "$@" ;;
        restore-public)    cmd_restore_public "$@" ;;
        restore-all)       cmd_restore_all "$@" ;;
        restore-table)     cmd_restore_table "$@" ;;
        restore-table-full) cmd_restore_table_full "$@" ;;
        *)
            echo "❌ Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
