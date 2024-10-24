.PHONY:up
up:
	docker compose up -d

.PHONY:down
down:
	docker compose down

.PHONY:log
log:
	docker compose logs -f

.PHONY:clean
clean:
	docker compose down -v

.PHONY:dump
dump:
	docker compose exec source \
		/bin/sh -c \
		"mysqldump -uroot -prootPw --databases dev prod --result-file=/dump/dump.sql"

.PHONY:restore
restore:
	docker compose exec target \
		/bin/sh -c \
		"mysql -uroot -prootPw < /dump/dump.sql"
