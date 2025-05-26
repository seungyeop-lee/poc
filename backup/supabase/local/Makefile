.PHONY:init
init:
	supabase init

.PHONY:up
up:
	supabase start

.PHONY:down
down:
	supabase stop

FROM_URL=postgresql://postgres.your-tenant-id:your-super-secret-and-long-postgres-password@localhost:5432/postgres

.PHONY:db-schema-dump
db-schema-dump:
	supabase stop
	mkdir -p supabase/schemas
	supabase db dump --db-url ${FROM_URL} -f supabase/schemas/prod.sql
	sed -i '' 's/OWNER TO "supabase_admin"/OWNER TO "postgres"/g' supabase/schemas/prod.sql #supabase dashboard에서 만든 테이블의 소유자를 postgres로 변경
	supabase db diff -f prod

.PHONY:db-data-dump
db-data-dump:
	supabase db dump --db-url ${FROM_URL} --data-only -f supabase/seed.sql

.PHONY:db-reset
db-reset:
	supabase db reset --db-url ${FROM_URL}
