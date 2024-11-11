PROJECT_NAME := rabbitmq-simple-demo

.PHONY:up
up:
	docker compose -p ${PROJECT_NAME} up -d

.PHONY:down
down:
	docker compose -p ${PROJECT_NAME} down

.PHONY:clean
clean:
	docker compose -p ${PROJECT_NAME} down -v

.PHONY:log
log:
	docker compose -p ${PROJECT_NAME} logs -f
