# network
.PHONY:network-create
network-create:
	docker network create mariabackup

.PHONY:network-delete
network-delete:
	docker network rm mariabackup

# db
.PHONY:up
up:
	docker compose up db -d --build

.PHONY:down
down:
	docker compose down db

.PHONY:log
log:
	docker compose logs -f

# volumes
.PHONY:clean-data
clean-data:
	docker volume rm mariabackup_db-data

.PHONY:clean-log
clean-log:
	docker volume rm mariabackup_db-log

.PHONY:clean-backup
clean-backup:
	docker volume rm mariabackup_db-backup

.PHONY:clean-all
clean-all:
	docker compose down -v

# restic-init, backup, restore, debug
.PHONY:restic-init
restic-init:
	docker compose exec db \
    		bash -c \
    		"echo '123456' | cat > /backup/password.txt" && \
    docker compose exec db \
			bash -c \
			"restic init -r /backup -p /backup/password.txt"

# backup은 서버가 기동 중에만 가능하다
.PHONY:backup
backup:
	docker compose exec db \
		bash -c \
		"mariabackup --defaults-file=/etc/mysql/conf.d/my.cnf \
		--user=mariabackup --password=mypassword \
		--datadir=/var/lib/mysql \
		--backup \
		--no-lock \
		--stream=xbstream 2>/backup-log/mariadb-backup.log | \
		restic backup --repo /backup -p /backup/password.txt --stdin --stdin-filename mariadb.xb --tag MariaDB"

.PHONY:restore
restore:
	docker compose up restore
	docker compose rm -f restore

.PHONY:debug-up
debug-up:
	docker compose up debug -d

.PHONY:debug-down
debug-down:
	docker compose down debug

# test data
.PHONY:insert1
insert1:
	(cd ../server && ./gradlew bootRun --args='insert 1')

.PHONY:insert2
insert2:
	(cd ../server && ./gradlew bootRun --args='insert 2')

.PHONY:truncate
truncate:
	(cd ../server && ./gradlew bootRun --args='truncate')

# usecase - simple
.PHONY:simple-before-accident
simple-before-accident:
	make clean-all
	make up
	sleep 10
	make insert1
	make insert2
	make restic-init
	make backup

.PHONY:simple-accident
simple-accident:
	make down
	make clean-data clean-log
	make up

.PHONY:simple-restore
simple-restore:
	make down
	make clean-data clean-log
	make restore
	make up

# usecase - Point-In-Time Recovery
.PHONY:pitr-before-accident
pitr-before-accident:
	make clean-all
	make up
	sleep 10
	make insert1
	make restic-init
	make backup
	make insert2

.PHONY:pitr-accident
pitr-accident:
	make truncate | grep "action: truncate" > truncate-log.txt

.PHONY:pitr-restore
pitr-restore:
	make down
	make clean-data
	make restore
	make up

.PHONY:print-backup-binlog-info
print-backup-binlog-info:
	@cat truncate-log.txt
	@docker compose exec db \
		cat /var/lib/mysql/xtrabackup_binlog_pos_innodb
	@docker compose exec db \
		ls /var/log/mysql

.PHONY:pitr-binlog
pitr-binlog:
	docker compose exec -w /var/log/mysql db \
		bash -c \
		"mariadb-binlog --no-defaults --disable-log-bin \
		--start-position=$(START_POSITION) \
		--stop-datetime='$(STOP_DATETIME)' \
		$(LOG_FILES) \
		| mysql --user=root --password=rootPw"
