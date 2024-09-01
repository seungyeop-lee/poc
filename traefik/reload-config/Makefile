.PHONY:up
up:
	docker network create proxy
	docker compose -p traefik -f compose.yml up -d

.PHONY:restart
restart:
	docker compose -p traefik restart reverse-proxy

.PHONY:down
down:
	docker compose -p traefik down
	docker network rm proxy

.PHONY:log
log:
	docker compose -p traefik logs -f
