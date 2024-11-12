PROJECT_NAME := mosquitto-simple-demo
NETWORK_NAME := mosquitto

.PHONY:up
up:
	-docker network create ${NETWORK_NAME}
	docker compose -p ${PROJECT_NAME} up -d

.PHONY:down
down:
	docker compose -p ${PROJECT_NAME} down
	-docker network rm ${NETWORK_NAME}

.PHONY:clean
clean:
	docker compose -p ${PROJECT_NAME} down -v
	-docker network rm ${NETWORK_NAME}

.PHONY:log
log:
	docker compose -p ${PROJECT_NAME} logs -f
