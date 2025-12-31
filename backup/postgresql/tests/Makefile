# Makefile for PostgreSQL Backup & Restore Tests

.PHONY: help test test-unit test-e2e test-all db-up db-wait db-down db-logs

BATS := bats

# ============================================
# Help
# ============================================
help:
	@echo "PostgreSQL Backup & Restore - Test Suite"
	@echo ""
	@echo "Usage: make <command>"
	@echo ""
	@echo "Test Commands:"
	@echo "  test          Run all tests (starts DB, waits, runs tests)"
	@echo "  test-unit     Run backup/restore unit tests"
	@echo "  test-e2e      Run end-to-end scenario tests"
	@echo "  test-all      Run all test files"
	@echo ""
	@echo "Database Commands:"
	@echo "  db-up         Start test databases (docker compose)"
	@echo "  db-wait       Wait for databases to be ready"
	@echo "  db-down       Stop test databases"
	@echo "  db-logs       Show database logs"
	@echo ""
	@echo "Full Test Flow:"
	@echo "  1. make db-up    - Start databases"
	@echo "  2. make db-wait   - Wait for ready"
	@echo "  3. make test      - Run tests"
	@echo "  4. make db-down   - Cleanup"

# ============================================
# Test Commands (with DB setup)
# ============================================
test: db-up db-wait run-tests
	@echo ""
	@echo "✅ All tests passed!"

test-unit: db-up db-wait
	@echo "Running unit tests..."
	@$(BATS) backup_test.bats
	@$(BATS) restore_test.bats

test-e2e: db-up db-wait
	@echo "Running E2E tests..."
	@$(BATS) e2e_test.bats

test-all: db-up db-wait
	@echo "Running all test files..."
	@$(BATS) *.bats

run-tests:
	@$(BATS) backup_test.bats
	@$(BATS) restore_test.bats
	@$(BATS) e2e_test.bats

# ============================================
# Database Commands
# ============================================
db-up:
	@echo "Starting test databases..."
	docker compose -f compose.yml up -d

db-wait:
	@echo "Waiting for databases to be ready..."
	@./wait-for-db.sh

db-down:
	@echo "Stopping test databases..."
	docker compose -f compose.yml down -v

db-logs:
	docker compose -f compose.yml logs -f
