# Makefile for PostgreSQL Backup & Restore

# ============================================
# Configuration
# ============================================
export SOURCE_DB_HOST := 127.0.0.1
export SOURCE_DB_PORT := 5432
export SOURCE_DB_USER := postgres
export SOURCE_DB_NAME := postgres

export TARGET_DB_HOST := 127.0.0.1
export TARGET_DB_PORT := 5433
export TARGET_DB_USER := postgres
export TARGET_DB_NAME := postgres

# Use BACKUP_DIR from environment if set, otherwise default to ./backups
BACKUP_DIR ?= ./backups
export BACKUP_DIR

SCRIPTS_DIR := ./scripts

# ============================================
# Commands
# ============================================
.PHONY: help
.PHONY: info info-source info-target test-connection
.PHONY: backup backup-public backup-all backup-table
.PHONY: restore restore-public restore-all restore-table restore-table-full
.PHONY: list list-contents clean

help:
	@echo "PostgreSQL Backup & Restore"
	@echo ""
	@echo "Usage: make <command> [OPTIONS]"
	@echo ""
	@echo "Database Info:"
	@echo "  info              Show database info (uses DB_TARGET or source)"
	@echo "  info-source       Show source database info"
	@echo "  info-target       Show target database info"
	@echo "  test-connection   Test connections to both databases"
	@echo ""
	@echo "Backup (from SOURCE by default):"
	@echo "  backup                    Backup public schema from source"
	@echo "  backup-public             Backup public schema from source"
	@echo "  backup-all                Backup entire database from source"
	@echo "  backup-table TABLE=xxx    Backup specific table from source"
	@echo ""
	@echo "Restore (to TARGET by default):"
	@echo "  restore FILE=xxx.dump              Restore to target DB"
	@echo "  restore-public FILE=xxx.dump       Restore public to target"
	@echo "  restore-all FILE=xxx.dump          Restore all to target"
	@echo "  restore-table FILE=xxx.dump TABLE=xxx    Restore table data"
	@echo "  restore-table-full FILE=xxx.dump TABLE=xxx Restore table + schema"
	@echo ""
	@echo "Utilities:"
	@echo "  list              List available backups"
	@echo "  list-contents FILE=xxx.dump    Show backup contents"
	@echo "  clean             Remove old backups (7+ days)"
	@echo ""
	@echo "Testing (run from tests/ directory):"
	@echo "  cd tests && make test    Run all tests"
	@echo ""
	@echo "Options:"
	@echo "  DB_TARGET=source|target   Which database to operate on"
	@echo "  PGPASSWORD=xxx            PostgreSQL password (required)"
	@echo ""
	@echo "Scenarios:"
	@echo "  1. A 백업 → A 복구:"
	@echo "     make backup && PGPASSWORD=xxx DB_TARGET=source make restore FILE=xxx.dump"
	@echo ""
	@echo "  2. A 백업 → B 복구 (복사본 생성):"
	@echo "     make backup && PGPASSWORD=xxx DB_TARGET=target make restore FILE=xxx.dump"

# ============================================
# Database Info
# ============================================
info:
	@$(SCRIPTS_DIR)/utils.sh info

info-source:
	@$(SCRIPTS_DIR)/utils.sh info-source

info-target:
	@$(SCRIPTS_DIR)/utils.sh info-target

test-connection:
	@$(SCRIPTS_DIR)/utils.sh test-connection

# ============================================
# Backup Commands (from SOURCE)
# ============================================
backup:
	@$(SCRIPTS_DIR)/backup.sh backup $(SCHEMAS)

backup-public:
	@$(SCRIPTS_DIR)/backup.sh backup-public

backup-all:
	@$(SCRIPTS_DIR)/backup.sh backup-all

backup-table:
ifndef TABLE
	$(error TABLE is required. Usage: make backup-table TABLE=public.users)
endif
	@$(SCRIPTS_DIR)/backup.sh backup-table $(TABLE)

# ============================================
# Restore Commands (to TARGET by default)
# ============================================
restore:
ifndef FILE
	$(error FILE is required. Usage: make restore FILE=backup.dump [SCHEMAS="public"])
endif
	@$(SCRIPTS_DIR)/restore.sh restore $(FILE) $(SCHEMAS)

restore-public:
ifndef FILE
	$(error FILE is required. Usage: make restore-public FILE=backup.dump)
endif
	@$(SCRIPTS_DIR)/restore.sh restore-public $(FILE)

restore-all:
ifndef FILE
	$(error FILE is required. Usage: make restore-all FILE=backup.dump)
endif
	@$(SCRIPTS_DIR)/restore.sh restore-all $(FILE)

restore-table:
ifndef FILE
	$(error FILE is required. Usage: make restore-table FILE=backup.dump TABLE=users)
endif
ifndef TABLE
	$(error TABLE is required. Usage: make restore-table FILE=backup.dump TABLE=users)
endif
	@$(SCRIPTS_DIR)/restore.sh restore-table $(FILE) $(TABLE)

restore-table-full:
ifndef FILE
	$(error FILE is required. Usage: make restore-table-full FILE=backup.dump TABLE=users)
endif
ifndef TABLE
	$(error TABLE is required. Usage: make restore-table-full FILE=backup.dump TABLE=users)
endif
	@$(SCRIPTS_DIR)/restore.sh restore-table-full $(FILE) $(TABLE)

# ============================================
# Utility Commands
# ============================================
list:
	@$(SCRIPTS_DIR)/utils.sh list

list-contents:
ifndef FILE
	$(error FILE is required. Usage: make list-contents FILE=backup.dump)
endif
	@$(SCRIPTS_DIR)/utils.sh list-contents $(FILE)

clean:
	@$(SCRIPTS_DIR)/utils.sh clean

