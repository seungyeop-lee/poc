.PHONY:init
init:
	docker compose pull

.PHONY:up
up:
	docker compose -p supabase up -d

.PHONY:down
down:
	docker compose -p supabase down

.PHONY:reset
reset:
	./reset.sh
