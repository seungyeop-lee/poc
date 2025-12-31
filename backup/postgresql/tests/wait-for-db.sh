#!/bin/bash
# Wait for test databases to be ready

set -euo pipefail

wait_for_db() {
  local container=$1
  local name=$2
  local max_attempts=30
  local attempt=0

  echo "🔍 Waiting for $name database ($container)..."
  while [[ $attempt -lt $max_attempts ]]; do
    if docker exec "$container" pg_isready -U postgres &>/dev/null; then
      echo "✅ $name database is ready (attempt $((attempt+1))/$max_attempts)"
      return 0
    fi
    ((attempt++))
    if [[ $((attempt % 5)) -eq 0 ]]; then
      echo "⏳ Still waiting for $name... ($attempt/$max_attempts)"
    fi
    sleep 1
  done

  echo "❌ $name database failed to start after $max_attempts attempts"
  return 1
}

# Wait for both source and target databases
wait_for_db "tests-source-1" "source"
wait_for_db "tests-target-1" "target"

echo "✅ All databases are ready!"
