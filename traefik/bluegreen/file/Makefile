.PHONY:up
up:
	docker network create proxy
	docker compose -p traefik -f compose.yml -f compose.bluegreen.yml up -d reverse-proxy blue

.PHONY:to-green
to-green:
	docker compose -p traefik -f compose.bluegreen.yml up -d green
	sleep 1
	# linux: sed -i 's|- url: "http://blue"|- url: "http://green"|g' config/dynamic.yml
	sed -i '' 's|- url: "http://blue"|- url: "http://green"|g' config/dynamic.yml
	docker compose -p traefik down -t 10 blue

.PHONY:to-blue
to-blue:
	docker compose -p traefik -f compose.bluegreen.yml up -d blue
	sleep 1
	# linux: sed -i 's|- url: "http://green"|- url: "http://blue"|g' config/dynamic.yml
	sed -i '' 's|- url: "http://green"|- url: "http://blue"|g' config/dynamic.yml
	docker compose -p traefik down -t 10 green

.PHONY:test
test:
	make to-green
	sleep 5
	make to-blue

.PHONY:down
down:
	docker compose -p traefik down
	docker network rm proxy

.PHONY:log
log:
	docker compose -p traefik logs -f
