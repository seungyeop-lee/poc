.PHONY:up
up:
	docker network create proxy
	docker-compose -p traefik -f docker-compose.reverse-proxy.yml up -d
	docker-compose -p sshd -f docker-compose.sshd.yml up -d --build

.PHONY:down
down:
	docker-compose -p traefik down
	docker-compose -p sshd down
	docker network rm proxy

.PHONY:log
log:
	docker-compose -p traefik logs -f \
	& docker-compose -p sshd logs -f

.PHONY:ssh
ssh:
	ssh admin@localhost -p 8022 #password: admin
