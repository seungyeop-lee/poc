.PHONY: up down build logs test fail-test clean

# Docker Compose 서비스 시작 (백그라운드)
up:
	docker compose up -d

# Docker Compose 서비스 중지
down:
	docker compose down

# Docker 이미지 빌드
build:
	docker compose build

# 로그 확인 (실시간)
logs:
	docker compose logs -f

# mTLS 테스트 (Hono 서버의 /mtls-test 엔드포인트 호출)
test:
	curl http://localhost:3000/mtls-test

# mTLS 실패 시나리오 테스트 (Hono 서버의 /mtls-fail-test 엔드포인트 호출)
fail-test:
	curl http://localhost:3000/mtls-fail-test

# 컨테이너 및 이미지 정리
clean:
	docker compose down --volumes --remove-orphans
	docker compose rm -f
	docker system prune -f
