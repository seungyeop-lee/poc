.PHONY:fetch-docker
fetch-docker:
	-git clone --depth 1 -b 1.25.04 https://github.com/supabase/supabase repo
	mkdir -p docker
	cp -rf repo/docker/* docker
	cp -f repo/docker/.env.example docker/.env
	cp -f repo/docker/.env.example docker/.env.example

.PHONY:init
init:
	(cd docker && docker compose pull)

.PHONY:up
up:
	(cd docker && docker compose -p supabase up -d)

.PHONY:down
down:
	(cd docker && docker compose -p supabase down)

.PHONY:reset
reset:
	(cd docker && ./reset.sh)
