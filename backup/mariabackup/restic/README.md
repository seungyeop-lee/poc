# Mariabackup PoC

Mariabackup과 Restic을 이용해 증분 백업 및 복구, Point-In-Time 복구 구현을 PoC

## requirements

- MacOS or Linux
- Makefile
- Docker
- JDK 21 이상

## DB 서버 접속 정보

- url: localhost:3307
- database: mariadb_backup
- user: user
- password: userPw

## PoC 시나리오

make로 이뤄진 행위 후 DB의 테이블을 확인하는 것으로 그 당시의 상태를 확인 가능하다.

### 공통

시나리오 시작전에 아래의 명령어 실행 필요. (시나리오 시작 전 1번 만)

```bash
make network-create
```

### 백업본 복구 시나리오 (Simple)

```bash
# 사고(DB 전체 삭제)가 나기 전 상태까지 - 백업까지 완료
make simple-before-accident

# 사고(DB 전체가 삭제) 발생
make simple-accident

# 백업 본으로 복구
make simple-restore
```

### 특정 시점 복구 시나리오 (PiTR)

```bash
# 사고(잘못된 쿼리 실행)가 나기 전 상태까지 - 중간 백업까지 완료
make pitr-before-accident

# 사고(잘못된 쿼리 실행) 발생
make pitr-accident

# 중간 백업본으로 복구
make pitr-restore

# 사고 시간 확인 및 백업본, 현재 binlog 정보 확인
make print-backup-binlog-info

# 사고 직전까지 상태로 복구 
# make print-backup-binlog-info에서 확인한 정보를 기준으로 START_POSITION, STOP_DATETIME, LOG_FILES를 설정하여 실행
#
# ex) 
# [make print-backup-binlog-info 결과]
# 2024-04-03T12:15:58.663+09:00  INFO 34908 --- [server] [           main] p.b.m.server.ServerApplication           : action: truncate
# /var/log/mysql/binary-log.000002        634
# binary-log.000001  binary-log.000002  binary-log.000003  binary-log.index
# 
# [command]
# START_POSITION=634 STOP_DATETIME='2024-04-03 12:15:58' LOG_FILES='binary-log.000002 binary-log.000003' make pitr-binlog
START_POSITION=[START_POSITION] STOP_DATETIME=[STOP_DATETIME] LOG_FILES=[LOG_FILES] make pitr-binlog
```

## 정리

```bash
make clean-all
make network-delete
```

## ref.

- https://mariadb.com/kb/en/mariabackup/
- https://stackoverflow.com/questions/70233283/mysqlbinlog-unknown-variable-default-character-set-utf8mb4
- https://mariadb.com/kb/en/replication-and-binary-log-system-variables/#expire_logs_days
- https://youtu.be/b-KFj8GfvzE?si=N2X2-STp2mhSPYD4
