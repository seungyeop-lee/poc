# Mariabackup PoC (Live Backup Stability)

라이브 서비스를 가정했을 때, Mariabackup과 Restic을 이용한 증분 백업 및 백업 데이터 Point-In-Time 복구 구현 PoC

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

## 특정 시점 복구 시나리오 (PiTR)

make로 이뤄진 행위 후 DB의 테이블을 확인하는 것으로 그 당시의 상태를 확인 가능하다.

### 준비

```bash
# 도커 네트워크 생성
make network-create
```

### 라이브 서비스 가정

```bash
# 데이터 베이스 기동
make up

# (별도 터미널) 테스트용 서버 기동
make server-start

# (별도 터미널) 테스트용 로드 발생
make load-start
```

### 백업

```bash
# 백업 저장소 초기화
make restic-init

# 백업
make backup
```

### 사고 발생

```bash
# (별도 터미널) 테스트용 로드 발생 종료 => ctrl + c
# (별도 터미널) 테스트용 서버 종료 => ctrl + c

# 데이터 베이스 중지
make down

# 데이터 베이스 데이터 삭제
make clean-data
```

### 복구

```bash
# 백업 본으로 복구
make restore

# 백업 본의 트랜젝션 중이었던 부분들 롤백
make recovery

# 데이터 베이스 기동
make up

# 백업본, 현재 binlog 정보 확인
make print-backup-binlog-info

# 사고 직전까지 상태로 복구 
# make print-backup-binlog-info에서 확인한 정보를 기준으로 START_POSITION, LOG_FILES를 설정하여 실행
#
# ex) 
# [make print-backup-binlog-info 결과]
# /var/log/mysql/binary-log.000002        1561114
# binary-log.000001  binary-log.000002  binary-log.000003  binary-log.000004  binary-log.index
# 
# [command]
# START_POSITION=1561114 LOG_FILES='binary-log.000002  binary-log.000003  binary-log.000004' make apply-binlog
START_POSITION=[START_POSITION] LOG_FILES=[LOG_FILES] make apply-binlog
```

### 정리

```bash
make clean-all
make network-delete
```

## ref.

- https://mariadb.com/kb/en/mariabackup/
- https://stackoverflow.com/questions/70233283/mysqlbinlog-unknown-variable-default-character-set-utf8mb4
- https://mariadb.com/kb/en/replication-and-binary-log-system-variables/#expire_logs_days
- https://youtu.be/b-KFj8GfvzE?si=N2X2-STp2mhSPYD4
- https://jira.mariadb.org/browse/MDEV-18963
