.PHONY:up
up:
	docker compose up -d --build

.PHONY:down
down:
	docker compose down -t 1

.PHONY:bash
bash:
	docker compose exec ffmpeg-gocv bash

FFMPEG_VERSION=7.1
GOCV_VERSION=0.39.0
.PHONY:build-push
build-push:
	docker build \
		-t game1987/ffmpeg-gocv:${FFMPEG_VERSION}-${GOCV_VERSION}-arm64 \
		--build-arg BASE_IMAGE=ubuntu:24.04 \
		--build-arg FFMPEG_VERSION=${FFMPEG_VERSION} \
		--build-arg GOCV_VERSION=${GOCV_VERSION} \
		--build-arg GOCV_MAKE_TARGET=install \
		.
	docker push game1987/ffmpeg-gocv:${FFMPEG_VERSION}-${GOCV_VERSION}-arm64
