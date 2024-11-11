PROJECT_NAME := rabbitmq-standalone

.PHONY:up
up:
	docker compose -p ${PROJECT_NAME} up -d

.PHONY:down
down:
	docker compose -p ${PROJECT_NAME} down

.PHONY:log
log:
	docker compose -p ${PROJECT_NAME} logs -f
