.PHONY:keygen
keygen:
	ssh-keygen -t rsa -b 4096 -C "xbeast7@gmail.com" -f ./key/id_rsa -N "" -m PEM

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

############ ssh, scp test ############

.PHONY:ssh-pwconnect
ssh-pwconnect:
	docker compose exec client bash -c "sshpass -p admin ssh -o StrictHostKeyChecking=no admin@server"

.PHONY:ssh-dockerps
ssh-dockerps:
	docker compose exec client bash -c "ssh -i ~/key/id_rsa admin@server docker ps -a"

.PHONY:scp-hello
scp-hello:
	docker compose exec client bash -c "touch hello.txt"
	docker compose exec client bash -c "scp -i ~/key/id_rsa hello.txt admin@server:/home/admin"
