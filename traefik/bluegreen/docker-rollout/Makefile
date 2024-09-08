.PHONY:up
up:
	docker network create proxy
	docker compose -f compose.yml -f compose.blue.yml up -d

.PHONY:to-green
to-green:
	docker rollout -f compose.green.yml -w 1 target

.PHONY:to-blue
to-blue:
	docker rollout -f compose.blue.yml -w 1 target

.PHONY:test
test:
	make to-green
	sleep 5
	make to-blue

.PHONY:down
down:
	docker compose -p docker-rollout down
	docker network rm proxy

.PHONY:log
log:
	docker compose logs -f
