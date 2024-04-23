.PHONY:up
up:
	docker compose up -d --build

.PHONY:down
down:
	docker compose down

.PHONY:clean
clean:
	docker compose down -v

.PHONY:log
log:
	docker compose logs -f

.PHONY:ssh
ssh:
	ssh admin@localhost -p 8022 #password: admin
