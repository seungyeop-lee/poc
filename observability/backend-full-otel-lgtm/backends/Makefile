DOCKER_COMPOSE_PROJECT_NAME=otel-poc-backend

.PHONY:up
up:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) up -d --build

.PHONY:down
down:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) down

.PHONY:clean
clean:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) down -v

.PHONY:log
log:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) logs -f
