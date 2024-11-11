PROJECT_NAME := mosquitto-standalone
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

.PHONY:pub-run
pub-run:
	docker run -it --rm --network=${NETWORK_NAME} eclipse-mosquitto:2.0.20 mosquitto_pub -h mosquitto -t 'test/topic' -m "Hello, World!"

.PHONY:sub-run
sub-run:
	docker run -it --rm --network ${NETWORK_NAME} eclipse-mosquitto:2.0.20 mosquitto_sub -h mosquitto -t 'test/topic'
