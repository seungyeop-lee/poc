# PostgreSQL Backup & Restore

Docker 기반 PostgreSQL 데이터베이스 백업/복구 스크립트 모음입니다.

## 1. 개요

- **백업**: `pg_dump`를 사용하여 데이터베이스/스키마/테이블 단위 백업
- **복구**: `pg_restore`를 사용하여 원하는 DB로 복구
- **테스트**: Bats 기반 통합 테스트 제공 (28개 테스트 케이스)

## 2. 사전 준비

### 필수 요구사항

- Docker
- Docker Compose
- Make
- psql (PostgreSQL 클라이언트)

### 데이터베이스

백업/복구 대상 PostgreSQL 데이터베이스가 실행 중이어야 합니다.

테스트용 DB는 `tests/` 폴더의 Docker Compose로 자동 기동됩니다.

## 3. 백업 및 복구 사전 준비

### 환경변수 설정 (direnv 사용 권장)

**direnv**를 사용하면 프로젝트 진입 시 환경변수가 자동으로 로드됩니다.

```bash
# 1. direnv 설치 (macOS)
brew install direnv

# 2. shell에 direnv hook 추가 (zsh 예시)
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
source ~/.zshrc

# 3. .envrc 파일 생성
cp .envrc.example .envrc

# 4. .envrc 파일 편집 (비밀번호 등 입력)
vim .envrc

# 5. direnv 허용
direnv allow
```

**수동 설정 시** (direnv 미사용):

```bash
export PGPASSWORD=your_password
export BACKUP_DIR=./backups
```

### 백업 디렉토리 생성

```bash
mkdir -p ./backups
```

## 4. 백업 및 복구 방법

### 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `make help` | 도움말 출력 |
| `make info-source` | 소스 DB 정보 |
| `make info-target` | 타겟 DB 정보 |
| `make test-connection` | DB 연결 테스트 |

### 백업 명령어

| 명령어 | 설명 |
|--------|------|
| `make backup` | public 스키마 백업 |
| `make backup-public` | public 스키마 백업 (위와 동일) |
| `make backup-all` | 전체 DB 백업 |
| `make backup-table TABLE=public.users` | 특정 테이블 백업 |

### 복구 명령어

| 명령어 | 설명 |
|--------|------|
| `make restore FILE=xxx.dump` | 백업 파일 복구 |
| `make restore-public FILE=xxx.dump` | public 스키마 복구 |
| `make restore-all FILE=xxx.dump` | 전체 DB 복구 |
| `make restore-table FILE=xxx.dump TABLE=users` | 테이블 데이터만 복구 (트랜잭션으로 실행, 실패 시 롤백) |
| `make restore-table-full FILE=xxx.dump TABLE=users` | 테이블 전체 복구 (트랜잭션으로 실행, 실패 시 롤백) |

### 유틸리티

| 명령어 | 설명 |
|--------|------|
| `make list` | 백업 파일 목록 |
| `make list-contents FILE=xxx.dump` | 백업 내용 확인 |
| `make clean` | 7일 이상 된 백업 삭제 |

### 사용 시나리오

> **참고**: 아래 예시는 `direnv`로 환경변수가 설정되어 있다고 가정합니다.

#### 시나리오 1: A → A (동일 DB 백업/복구)

```bash
# 백업
make backup

# 복구 (동일 DB)
DB_TARGET=source yes | make restore FILE=backup_xxx.dump
```

#### 시나리오 2: A → B (복사본 생성)

```bash
# 소스 DB 백업
make backup

# 타겟 DB로 복구 (다른 서버/DB로 복사본 생성)
DB_TARGET=target yes | make restore FILE=backup_xxx.dump
```

#### 시나리오 3: 특정 테이블만 복구

```bash
# 데이터만 복구 (DELETE 후 데이터 삽입)
DB_TARGET=target yes | make restore-table FILE=backup_xxx.dump TABLE=users

# 테이블 전체 복구 (DROP 후 재생성)
DB_TARGET=target yes | make restore-table-full FILE=backup_xxx.dump TABLE=users
```

## 5. 테스트 방법

### 전체 테스트 실행

```bash
cd tests
make test
```

### 개별 테스트 실행

```bash
# 백업 테스트
bats backup_test.bats

# 복구 테스트
bats restore_test.bats

# E2E 테스트
bats e2e_test.bats
```

### DB 수동 제어

```bash
cd tests

# DB 시작
make db-up

# DB 대기
make db-wait

# DB 중지
make db-down

# DB 로그 확인
make db-logs
```

## 6. 폴더 구조

```
postgresql/
├── Makefile              # 백업/복구 메인 명령어
├── scripts/              # 스크립트 폴더
│   ├── backup.sh         # 백업 스크립트
│   ├── restore.sh        # 복구 스크립트
│   ├── utils.sh          # 유틸리티 스크립트
│   └── common.sh         # 공통 함수
├── tests/                # 테스트 폴더
│   ├── Makefile          # 테스트 실행 명령어
│   ├── compose.yml       # 테스트용 Docker Compose
│   ├── wait-for-db.sh    # DB 대기 스크립트
│   ├── helpers.bash      # 테스트 헬퍼 함수
│   ├── backup_test.bats  # 백업 테스트 (11개)
│   ├── restore_test.bats # 복구 테스트 (9개)
│   └── e2e_test.bats     # E2E 테스트 (8개)
└── README.md             # 이 문서
```

## 주의사항

- `PGPASSWORD` 환경변수가 설정되어 있어야 합니다 (direnv 사용 권장)
- 복구 명령어 실행 시 확인 프롬프트가 나타납니다 (`yes |` 파이프로 자동 응답 가능)
- `restore-table-full`은 트랜잭션으로 실행되며, 실패 시 자동 롤백되어 기존 데이터가 보존됩니다
- 백업 파일은 `BACKUP_DIR` (기본: `./backups`)에 저장됩니다
- `.envrc` 파일에 민감 정보가 포함되므로 `.gitignore`에 등록되어 있습니다
