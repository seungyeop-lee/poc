# Supabase 백업/복구 PoC

운영 중인 Supabase 서버의 데이터베이스를 백업하고 복구하는 전체 워크플로우를 검증하는 PoC(Proof of Concept) 프로젝트입니다.

## 🎯 PoC 목표

실제 운영 환경에서 Supabase 데이터베이스 백업/복구 프로세스를 안전하게 테스트하기 위해:

1. **가상 운영 서버**: Docker로 Supabase 스택을 구동하여 운영 서버 환경 시뮬레이션
2. **백업 클라이언트**: Supabase CLI를 사용하여 운영 서버에서 백업 및 복구 수행
3. **전체 워크플로우**: 백업 → 복구 → 검증의 완전한 프로세스 검증

## 🏗️ 아키텍처

```
┌─────────────────────────────────────┐    ┌─────────────────────────────────────┐
│         가상 운영 서버               │    │         백업 클라이언트              │
│        (Docker Compose)             │    │       (Supabase CLI)               │
├─────────────────────────────────────┤    ├─────────────────────────────────────┤
│ • Supabase Studio (3000)           │    │ • 스키마 백업                        │
│ • API Gateway (8000)               │◄───┤ • 데이터 백업                        │
│ • PostgreSQL (5432)                │    │ • 로컬 환경 복구                     │
│ • Auth, Storage, Realtime...       │    │ • 마이그레이션 생성                   │
└─────────────────────────────────────┘    └─────────────────────────────────────┘
```

## 🚀 시작하기

### 1. 초기 설정

```bash
# Supabase 저장소 클론 및 환경 구성
make init
```

### 2. 가상 운영 서버 구동

```bash
cd docker

# Docker 이미지 다운로드
make init

# Supabase 운영 서버 시작
make up
```

**🌐 운영 서버 접속 정보:**
- **Supabase Studio**: http://localhost:3000
- **API Gateway**: http://localhost:8000  
- **PostgreSQL**: `localhost:5432`
- **Username**: `postgres`
- **Password**: `your-super-secret-and-long-postgres-password`

### 3. 운영 서버에 테스트 데이터 생성

1. Supabase Studio (http://localhost:3000)에 접속
2. 테이블 생성 및 데이터 입력으로 운영 환경 시뮬레이션
3. 백업할 실제 데이터 준비

## 📋 백업/복구 워크플로우

### 1단계: 운영 서버에서 스키마 백업

```bash
cd local

# Supabase CLI 환경 초기화
make init

# 운영 서버에서 스키마 덤프
make db-schema-dump
```

**수행 작업:**
- 운영 서버의 전체 스키마를 `supabase/schemas/prod.sql`로 백업
- 테이블 소유자를 로컬 환경에 맞게 조정
- 마이그레이션 파일 자동 생성

### 2단계: 운영 서버에서 데이터 백업

```bash
# 운영 서버에서 데이터 덤프
make db-data-dump
```

**수행 작업:**
- 운영 서버의 모든 데이터를 `supabase/seed.sql`로 백업
- 테이블 구조 제외, 순수 데이터만 추출

### 3단계: 로컬 환경에서 복구 검증

```bash
# 로컬 Supabase 환경 시작
make up

# 백업된 데이터로 복구
make db-reset
```

**검증 방법:**
- 로컬 Supabase Studio에서 데이터 확인
- 백업 전후 데이터 일치성 검증
- 기능 정상 동작 테스트

## 📁 프로젝트 구조

```
backup/supabase/
├── README.md                    # 이 파일
├── Makefile                     # 전체 초기 설정
├── .gitignore                   # Git 무시 설정
│
├── docker/                      # 가상 운영 서버
│   ├── docker-compose.yml       # Supabase 전체 스택
│   ├── docker-compose.s3.yml    # S3 백업 설정
│   ├── .env                     # 환경 변수 (init 후 생성)
│   ├── reset.sh                 # 운영 서버 리셋
│   └── volumes/                 # 데이터 영속성
│
├── local/                       # 백업 클라이언트
│   ├── Makefile                 # 백업/복구 명령어
│   └── supabase/               # CLI 프로젝트
│       ├── config.toml          # Supabase 설정
│       ├── schemas/             # 백업된 스키마
│       │   └── prod.sql         # 운영 DB 스키마
│       ├── seed.sql             # 백업된 데이터
│       └── migrations/          # 생성된 마이그레이션
│
└── repo/                        # Supabase 공식 저장소
    └── (Supabase 소스코드)
```
