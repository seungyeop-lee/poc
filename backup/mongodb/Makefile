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
		mongodump \
		--authenticationDatabase=admin \
		--username=root \
		--password=rootPw \
		--out=/dump

.PHONY:restore
restore:
	docker compose exec target \
		mongorestore \
		--authenticationDatabase=admin \
		--username=root \
		--password=rootPw \
		/dump
