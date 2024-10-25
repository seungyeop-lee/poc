IP = $(shell ipconfig getifaddr en0)

# network
.PHONY:network-create
network-create:
	docker network create mediamtx

.PHONY:network-delete
network-delete:
	docker network rm mediamtx

MEDIAMTX_NAME = mediamtx
MEDIAMTX_COMPOSE = mediamtx/compose.yml
.PHONY:mediamtx-up
mediamtx-up:
	IP=${IP} docker compose -p ${MEDIAMTX_NAME} -f ${MEDIAMTX_COMPOSE} up -d

.PHONY:mediamtx-down
mediamtx-down:
	docker compose -p ${MEDIAMTX_NAME} down

.PHONY:mediamtx-log
mediamtx-log:
	docker compose -p ${MEDIAMTX_NAME} logs -f

.PHONY:cam-to-rtsp-run
cam-to-rtsp-run:
	(cd cam-to-rtsp && go run main.go)

.PHONY:rtsp-img-rtsp-run
rtsp-img-rtsp-run:
	(cd rtsp-img-rtsp && go run main.go)
