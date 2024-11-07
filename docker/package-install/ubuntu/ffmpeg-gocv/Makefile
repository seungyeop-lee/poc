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
GOCV_VERSION=0.39
.PHONY:build-push
build-push:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t game1987/ffmpeg-gocv:${FFMPEG_VERSION}-${GOCV_VERSION} \
		--build-arg BASE_IMAGE=ubuntu:24.04 \
		--build-arg FFMPEG_VERSION=${FFMPEG_VERSION} \
		--build-arg GOCV_VERSION=${GOCV_VERSION} \
		--build-arg GOCV_MAKE_TARGET=install \
		--push \
		.
	docker push game1987/ffmpeg-gocv:${FFMPEG_VERSION}-${GOCV_VERSION}

.PHONY:cuda-build-push
cuda-build-push:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t game1987/ffmpeg-gocv:${FFMPEG_VERSION}-${GOCV_VERSION}-cuda \
		--build-arg BASE_IMAGE=nvidia/cuda:12.6.2-cudnn-runtime-ubuntu24.04 \
		--build-arg FFMPEG_VERSION=${FFMPEG_VERSION} \
		--build-arg GOCV_VERSION=${GOCV_VERSION} \
		--build-arg GOCV_MAKE_TARGET=install_cuda \
		--push \
		.
	docker push game1987/ffmpeg-gocv:${FFMPEG_VERSION}-${GOCV_VERSION}
