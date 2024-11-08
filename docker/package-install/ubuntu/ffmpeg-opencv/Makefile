.PHONY:up
up:
	docker compose up -d --build

.PHONY:down
down:
	docker compose down -t 1

.PHONY:bash
bash:
	docker compose exec ffmpeg-opencv bash

FFMPEG_VERSION=7.1
OPENCV_VERSION=4.10.0.84
.PHONY:build-push
build-push:
	docker build \
		-t game1987/ffmpeg-opencv:${FFMPEG_VERSION}-${OPENCV_VERSION}-arm64 \
		--build-arg BASE_IMAGE=ubuntu:24.04 \
		--build-arg FFMPEG_VERSION=${FFMPEG_VERSION} \
		--build-arg OPENCV_VERSION=${OPENCV_VERSION} \
		.
	docker push game1987/ffmpeg-opencv:${FFMPEG_VERSION}-${OPENCV_VERSION}-arm64
