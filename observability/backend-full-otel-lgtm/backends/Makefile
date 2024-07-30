DOCKER_COMPOSE_PROJECT_NAME=otel-poc-backend

.PHONY:network-create
network-create:
	docker network create otel-poc

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

.PHONY:test
test:
	http -v api.localhost/term/auto term=apple
