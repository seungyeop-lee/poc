#!/bin/bash
# ============================================
# Common Functions & Configuration
# ============================================

set -euo pipefail

# ============================================
# Configuration (can be overridden by environment)
# ============================================
# BACKUP_DIR must be set (no default - forces explicit configuration)
: "${BACKUP_DIR:?BACKUP_DIR environment variable must be set}"
SOURCE_DB_HOST="${SOURCE_DB_HOST:-127.0.0.1}"
SOURCE_DB_PORT="${SOURCE_DB_PORT:-5432}"
SOURCE_DB_USER="${SOURCE_DB_USER:-postgres}"
SOURCE_DB_NAME="${SOURCE_DB_NAME:-postgres}"

TARGET_DB_HOST="${TARGET_DB_HOST:-127.0.0.1}"
TARGET_DB_PORT="${TARGET_DB_PORT:-5433}"
TARGET_DB_USER="${TARGET_DB_USER:-postgres}"
TARGET_DB_NAME="${TARGET_DB_NAME:-postgres}"

# Select database: source or target
DB_TARGET="${DB_TARGET:-source}"

# Apply selected database config
if [[ "$DB_TARGET" == "target" ]]; then
    DB_HOST="$TARGET_DB_HOST"
    DB_PORT="$TARGET_DB_PORT"
    DB_USER="$TARGET_DB_USER"
    DB_NAME="$TARGET_DB_NAME"
else
    DB_HOST="$SOURCE_DB_HOST"
    DB_PORT="$SOURCE_DB_PORT"
    DB_USER="$SOURCE_DB_USER"
    DB_NAME="$SOURCE_DB_NAME"
fi

# ============================================
# Derived Configuration
# ============================================
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PG_MAJOR_FILE="$BACKUP_DIR/.pg_major"
DOCKER_HOST_FLAG="--add-host=host.docker.internal:host-gateway"

# Docker host resolution
if [[ "$DB_HOST" == "127.0.0.1" || "$DB_HOST" == "localhost" ]]; then
    DOCKER_DB_HOST="host.docker.internal"
else
    DOCKER_DB_HOST="$DB_HOST"
fi

# ============================================
# Helper Functions
# ============================================

check_env() {
    if [[ -z "${PGPASSWORD:-}" ]]; then
        echo "❌ Error: PGPASSWORD is not set"
        exit 1
    fi

    local pg_ver
    if ! pg_ver=$(PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SHOW server_version;" 2>&1); then
        echo "❌ Error: Cannot connect to database"
        echo "   Host: $DB_HOST:$DB_PORT"
        echo "   $pg_ver"
        exit 1
    fi

    local pg_major
    pg_major=$(echo "$pg_ver" | xargs | cut -d. -f1)
    mkdir -p "$BACKUP_DIR"
    echo "$pg_major" > "$PG_MAJOR_FILE"
}

get_pg_major() {
    cat "$PG_MAJOR_FILE"
}

docker_run() {
    local pg_major
    pg_major=$(get_pg_major)
    docker run --rm $DOCKER_HOST_FLAG \
        -v "$BACKUP_DIR:/backups" \
        -e PGPASSWORD="$PGPASSWORD" \
        "postgres:${pg_major}-alpine" \
        "$@"
}

docker_psql() {
    docker_run psql -h "$DOCKER_DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" "$@"
}

docker_psql_quiet() {
    local pg_major
    pg_major=$(get_pg_major)
    docker run --rm $DOCKER_HOST_FLAG \
        -v "$BACKUP_DIR:/backups" \
        -e PGPASSWORD="$PGPASSWORD" \
        "postgres:${pg_major}-alpine" \
        psql -h "$DOCKER_DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" "$@"
}

docker_pg_restore_to_file() {
    local pg_major output_file backup_file table
    pg_major=$(get_pg_major)
    output_file="$1"
    backup_file="$2"
    table="$3"

    # Generate list of items related to the table
    # Match: TABLE/CONSTRAINT/... with exact table name, or SEQUENCE with table_name_seq pattern
    docker run --rm $DOCKER_HOST_FLAG \
        -v "$BACKUP_DIR:/backups" \
        "postgres:${pg_major}-alpine" \
        pg_restore -l "$backup_file" 2>/dev/null | \
        grep -E "(TABLE|CONSTRAINT|INDEX|TRIGGER|DEFAULT|SEQUENCE SET|SEQUENCE OWNED).*[[:space:]]${table}([[:space:]]|$)|SEQUENCE.*[[:space:]]${table}.*_seq[[:space:]]" \
        > "$BACKUP_DIR/.restore_list_${table}.txt" || true

    # Restore using the filtered list
    if [[ -s "$BACKUP_DIR/.restore_list_${table}.txt" ]]; then
        docker run --rm $DOCKER_HOST_FLAG \
            -v "$BACKUP_DIR:/backups" \
            "postgres:${pg_major}-alpine" \
            pg_restore -L "/backups/.restore_list_${table}.txt" -f "/backups/$output_file" "$backup_file" 2>/dev/null || true
    else
        docker run --rm $DOCKER_HOST_FLAG \
            -v "$BACKUP_DIR:/backups" \
            "postgres:${pg_major}-alpine" \
            pg_restore -t "$table" -f "/backups/$output_file" "$backup_file" 2>/dev/null || true
    fi
}

confirm() {
    read -p "Are you sure? [y/N] " response
    [[ "$response" == "y" ]]
}

print_db_info() {
    echo "📊 Database Configuration:"
    echo "   Target:      $DB_TARGET"
    echo "   Host:        $DB_HOST"
    echo "   Docker Host: $DOCKER_DB_HOST"
    echo "   Port:        $DB_PORT"
    echo "   User:        $DB_USER"
    echo "   Database:    $DB_NAME"
}

print_source_info() {
    echo "📊 Source Database:"
    echo "   Host: $SOURCE_DB_HOST:$SOURCE_DB_PORT"
    echo "   User: $SOURCE_DB_USER"
    echo "   DB:   $SOURCE_DB_NAME"
}

print_target_info() {
    echo "📊 Target Database:"
    echo "   Host: $TARGET_DB_HOST:$TARGET_DB_PORT"
    echo "   User: $TARGET_DB_USER"
    echo "   DB:   $TARGET_DB_NAME"
}
