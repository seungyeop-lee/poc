DOCKER_COMPOSE_PROJECT_NAME=twophase-login-db

.PHONY:up
up:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) up -d --build

.PHONY:down
down:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) down

.PHONY:log
log:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) logs -f

.PHONY:clean
clean:
	docker compose -p $(DOCKER_COMPOSE_PROJECT_NAME) down -v
