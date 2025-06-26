TARGET_TABLES=member,member_detail
POSTGRES_VERSION=15
BACKUP_FILE=backup.sql

POSTGRES_DOCKER=docker run --add-host host.docker.internal:host-gateway --rm -it -v $(PWD):/backup postgres:${POSTGRES_VERSION}
CONNECTION_STR=postgresql://postgres.your-tenant-id:your-super-secret-and-long-postgres-password@host.docker.internal:5432/postgres

comma:=,

# TABLE_FLAGS는 TARGET_TABLES를 공백으로 분리하고 각 테이블에 대해 -t 플래그 생성 (ex: member,member_detail > -t member -t member_detail)
TABLE_FLAGS=$(foreach table,$(subst $(comma), ,$(TARGET_TABLES)),-t $(table))

# TABLE_W_PUBLIC는 TARGET_TABLES를 콤마로 분리하고, 각 테이블의 앞에 'public.'을 붙여 재조립 (ex: member,member_detail > public.member,public.member_detail)
TABLE_W_PUBLIC=$(subst $(comma),$(comma)public.,public.$(TARGET_TABLES))

### connect ###

.PHONY:connect
connect:
	${POSTGRES_DOCKER} psql '${CONNECTION_STR}'

### help ###

.PHONY:backup-help
backup-help:
	${POSTGRES_DOCKER} pg_dump --help

.PHONY:restore-help
restore-help:
	${POSTGRES_DOCKER} pg_restore --help

### clean backup & restore ###

.PHONY:backup-clean
backup-clean:
	${POSTGRES_DOCKER} pg_dump \
	--dbname='${CONNECTION_STR}' \
	--format=p \
	--if-exists \
	--clean \
	$(TABLE_FLAGS) \
	--file=/backup/${BACKUP_FILE}

.PHONY:restore-clean
restore-clean:
	${POSTGRES_DOCKER} psql '${CONNECTION_STR}' --file=/backup/${BACKUP_FILE}

### dataonly backup & restore ###

.PHONY:backup-dataonly
backup-dataonly:
	${POSTGRES_DOCKER} pg_dump \
	--dbname='${CONNECTION_STR}' \
	--format=p \
	--data-only \
	$(TABLE_FLAGS) \
	--file=/backup/${BACKUP_FILE}

.PHONY:restore-dataonly
restore-dataonly:
	@echo "------ 아래의 명령어를 순서대로 입력하세요. ------"
	@echo "BEGIN;"
	@echo "TRUNCATE TABLE ${TABLE_W_PUBLIC} CASCADE;"
	@echo "\i /backup/${BACKUP_FILE}"
	@echo "COMMIT;"
	@echo "------------"
	${POSTGRES_DOCKER} psql '${CONNECTION_STR}'
