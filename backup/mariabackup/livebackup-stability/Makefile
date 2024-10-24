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

.PHONY:server-start
server-start:
	(cd test-server && ./gradlew bootRun)

.PHONY:load-start
load-start:
	k6 run loader/load.js

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

.PHONY:recovery
recovery:
	docker compose up recovery
	docker compose rm -f recovery

.PHONY:print-backup-binlog-info
print-backup-binlog-info:
	@docker compose exec db \
		cat /var/lib/mysql/xtrabackup_binlog_pos_innodb
	@docker compose exec db \
		ls /var/log/mysql

.PHONY:apply-binlog
apply-binlog:
	docker compose exec -w /var/log/mysql db \
		bash -c \
		"mariadb-binlog --no-defaults --disable-log-bin \
		--start-position=$(START_POSITION) \
		$(LOG_FILES) \
		| mysql --user=root --password=rootPw"

.PHONY:debug-up
debug-up:
	docker compose up debug -d

.PHONY:debug-down
debug-down:
	docker compose down debug
