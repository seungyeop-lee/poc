.PHONY:keygen
keygen:
	ssh-keygen -t rsa -b 4096 -C "xbeast7@gmail.com" -f ./key/id_rsa -N ""

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
	ssh -i key/id_rsa -p 8022 admin@localhost
