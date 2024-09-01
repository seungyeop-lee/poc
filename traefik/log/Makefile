.PHONY:up
up:
	docker network create proxy
	docker compose -p traefik -f compose.reverse-proxy.yml up -d
	docker compose -p whoami -f compose.whoami.yml up -d

.PHONY:down
down:
	docker compose -p traefik down
	docker compose -p whoami down
	docker network rm proxy

.PHONY:log
log:
	docker compose -p traefik logs -f \
	& docker compose -p whoami logs -f
