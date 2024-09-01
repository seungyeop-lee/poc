PROJECT_NAME := traefik-ssh-forwarding

.PHONY:up-alpine
up-alpine:
	docker compose -p ${PROJECT_NAME} -f compose.yml -f compose.alpine.yml up -d --build

.PHONY:up-ubuntu
up-ubuntu:
	docker compose -p ${PROJECT_NAME} -f compose.yml -f compose.ubuntu.yml up -d --build

.PHONY:down
down:
	docker compose -p ${PROJECT_NAME} down

.PHONY:log
log:
	docker compose -p ${PROJECT_NAME} logs -f

.PHONY:ssh
ssh:
	ssh admin@localhost -p 8022 #password: admin
