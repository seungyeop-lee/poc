.PHONY:up
up:
	docker-compose -p sshd -f docker-compose.sshd.yml up -d

.PHONY:down
down:
	docker-compose -p sshd down

.PHONY:log
log:
	docker-compose -p sshd logs -f
