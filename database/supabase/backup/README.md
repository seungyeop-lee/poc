# Supabase 로컬 개발 환경 백업 및 복원 도구 (PoC)

이 폴더는 `/basic` 폴더에서 구축한 로컬 Docker Supabase 환경의 PostgreSQL 데이터베이스 백업 및 복원을 위한 도구들을 포함하고 있습니다.

> **⚠️ 주의**: 이 도구는 **개념 증명(PoC) 목적**으로 개발되었으며, 프로덕션 환경에서의 사용을 위해 설계되지 않았습니다. 로컬 개발 및 테스트 환경에서만 사용하세요.

## 사전 요구사항

1. `/basic` 폴더의 로컬 Supabase Docker 환경이 실행 중이어야 합니다:

```bash
cd ../basic
make up
```

2. Docker가 설치되어 있어야 합니다 (PostgreSQL 클라이언트 도구 실행용)

## 파일 구성

- `Makefile`: 백업/복원 작업을 위한 make 명령어들
- `.gitignore`: 백업 파일들을 Git에서 제외
- `README.md`: 이 문서

## 주요 기능

### 1. 데이터베이스 연결

```bash
make connect
```

로컬 Docker Supabase의 PostgreSQL 데이터베이스에 직접 연결합니다.

### 2. Clean 백업 (스키마 + 데이터)

```bash
make backup-clean
```

- 테이블 구조와 데이터를 모두 백업
- `--if-exists`와 `--clean` 옵션으로 복원 시 기존 데이터 정리

### 3. Clean 복원

```bash
make restore-clean
```

Clean 백업 파일을 사용하여 데이터베이스를 복원합니다.

### 4. 데이터만 백업

```bash
make backup-dataonly
```

테이블 구조는 제외하고 데이터만 백업합니다.

### 5. 데이터만 복원

```bash
make restore-dataonly
```

데이터만 복원하며, 수동으로 트랜잭션을 관리할 수 있는 대화형 모드를 제공합니다.

## 설정

### 환경 변수

Makefile에서 다음 설정을 수정하여 사용하세요:

- `TARGET_TABLES`: 백업할 테이블 목록 (기본값: `member,member_detail`)
- `POSTGRES_VERSION`: PostgreSQL 버전 (기본값: `15`)
- `BACKUP_FILE`: 백업 파일명 (기본값: `backup.sql`)
- `CONNECTION_STR`: 데이터베이스 연결 문자열

### 연결 문자열 설정

현재 설정은 로컬 Docker Supabase 환경에 맞춰져 있습니다:

```bash
CONNECTION_STR=postgresql://postgres.your-tenant-id:your-super-secret-and-long-postgres-password@host.docker.internal:5432/postgres
```

실제 로컬 Supabase 프로젝트의 정보로 변경해야 합니다:

- `your-tenant-id`: 로컬 Supabase의 테넌트 ID
- `your-super-secret-and-long-postgres-password`: 로컬 Supabase의 PostgreSQL 비밀번호

> **💡 팁**: `/basic/docker/.env` 파일에서 실제 값들을 확인할 수 있습니다.

## 사용 예시

### 로컬 개발 환경에서의 일반적인 워크플로우

1. **로컬 Supabase 환경 시작**
   
```bash
cd ../basic
make up
```

2. **개발 데이터 백업**

```bash
cd ../backup
make backup-clean
```

3. **실험 후 데이터 복원**
   
```bash
make restore-clean
```

4. **데이터만 백업 후 복원**
   
```bash
make backup-dataonly
make restore-dataonly
# 대화형 모드에서 제공되는 명령어들을 순서대로 입력
```

## 도움말

pg_dump 및 pg_restore의 상세한 옵션을 확인하려면:

```bash
make backup-help    # pg_dump 도움말
make restore-help   # pg_restore 도움말
```

## 주의사항

### PoC 관련 제한사항

- **개발 목적으로만 사용**: 프로덕션 환경에서는 사용하지 마세요
- **보안 고려사항**: 연결 문자열이 평문으로 저장됩니다
- **에러 핸들링**: 기본적인 에러 처리만 구현되어 있습니다

### 기술적 제한사항

- 백업 파일(*.sql, *.dump)은 Git에서 제외됩니다
- Docker를 사용하여 PostgreSQL 클라이언트를 실행하므로 Docker가 설치되어 있어야 합니다
- `host.docker.internal`을 통해 로컬 호스트의 데이터베이스에 연결합니다
- 복원 작업은 기존 데이터를 삭제할 수 있으므로 주의해서 사용하세요
