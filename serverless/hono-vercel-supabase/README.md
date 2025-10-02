# Hono + Vercel Serverless + Supabase (PostgreSQL) PoC

Vercel 서버리스 환경에서 Hono 웹 프레임워크, Drizzle ORM을 사용한 PostgreSQL 연결, 그리고 mTLS(Mutual TLS) 클라이언트 기능을 포함한 Proof of Concept 프로젝트입니다.

## 프로젝트 구조

```
.
├── server-app/          # Hono 서버 애플리케이션
│   ├── src/
│   │   ├── index.ts            # Vercel 서버리스 엔트리 포인트
│   │   ├── server.ts           # 로컬 개발 서버
│   │   ├── db/                 # 데이터베이스 레이어
│   │   │   ├── connection.ts  # Drizzle ORM 연결 설정
│   │   │   └── schema.ts      # 데이터베이스 스키마 정의
│   │   └── utils/
│   │       ├── mtls-client.ts      # mTLS 클라이언트 구현
│   │       └── mtls-fail-tests.ts  # mTLS 실패 시나리오 테스트
│   ├── certs/                  # mTLS 인증서 (개발용)
│   ├── scripts/                # 유틸리티 스크립트
│   ├── docker-compose.yml      # Docker 기반 테스트 환경
│   ├── Makefile                # Docker 환경 관리 명령어
│   └── vercel.json             # Vercel 배포 설정
└── README.md
```

## 주요 기능

### API 엔드포인트

- `GET /` - 기본 텍스트 응답
- `GET /health` - 헬스체크 (상태 및 타임스탬프)
- `GET /db-test` - PostgreSQL 연결 테스트 (Drizzle ORM 사용)
- `GET /mtls-test` - mTLS 클라이언트 연결 테스트
- `GET /mtls-fail-test` - mTLS 실패 시나리오 테스트

### 기술 스택

- **웹 프레임워크**: [Hono](https://hono.dev/) - 경량 고속 웹 프레임워크
- **런타임 환경**: Vercel Serverless Functions
- **데이터베이스**: PostgreSQL (Supabase)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) with postgres-js
- **mTLS 클라이언트**: [undici](https://undici.nodejs.org/)
- **언어**: TypeScript (ES Modules)

## 시작하기

### 사전 요구사항

- Node.js 20+
- Yarn 패키지 매니저
- [Vercel CLI](https://vercel.com/docs/cli) (선택사항, 로컬 개발용)
- Docker & Docker Compose (선택사항, mTLS 테스트용)

### 설치 및 실행

```bash
cd server-app
yarn install
```

### 환경 변수 설정

`server-app/.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# 필수
DATABASE_URL=postgresql://user:password@host:port/database

# 선택사항 (mTLS 테스트용)
MTLS_SERVER_URL=https://localhost:8443
CA_CERT=-----BEGIN CERTIFICATE-----...
CLIENT_CERT=-----BEGIN CERTIFICATE-----...
CLIENT_KEY=-----BEGIN PRIVATE KEY-----...
```

### 로컬 개발

**Vercel CLI를 사용한 개발** (권장):
```bash
cd server-app
yarn dev
# 또는
vercel dev
```

서버가 http://localhost:3000 에서 실행됩니다.

**타입 체크**:
```bash
yarn type-check
```

**빌드**:
```bash
yarn build
```

### Docker를 사용한 mTLS 테스트

Makefile을 통해 Docker Compose 환경을 관리할 수 있습니다:

```bash
cd server-app

# mTLS 서버 및 Hono 서버 시작
make up

# mTLS 연결 테스트
make test

# 로그 확인
make logs

# 서비스 중지
make down

# 환경 정리
make clean
```

## Vercel 배포

```bash
cd server-app

# Vercel에 로그인
vercel login

# 프로젝트 배포
vercel deploy

# 프로덕션 배포
vercel deploy --prod
```

배포 전 Vercel 프로젝트에 환경 변수를 설정해야 합니다:
- `DATABASE_URL` (필수)
- mTLS 관련 환경 변수 (선택사항)

## 아키텍처 특징

### 서버리스 환경 최적화

- **엔트리 포인트 분리**:
  - `src/index.ts`: Vercel 서버리스 함수용 (Hono 앱 export)
  - `src/server.ts`: 로컬 개발용 (@hono/node-server 사용)

### 데이터베이스 연결

- **Drizzle ORM** with postgres-js 클라이언트
- **Supabase Transaction 풀 모드** 호환 (`prepare: false` 설정)
- 환경 변수 `DATABASE_URL`로 연결 문자열 주입

### mTLS 클라이언트

- **undici** 라이브러리를 사용한 Mutual TLS 구현
- 인증서 관리:
  - 환경 변수 우선 사용 (CA_CERT, CLIENT_CERT, CLIENT_KEY)
  - 환경 변수가 없으면 `certs/` 디렉토리에서 파일 읽기
- Docker Compose 환경에서 자체 서명 인증서로 테스트 가능

### TypeScript 설정

- **모듈 시스템**: ES Modules (`"type": "module"`)
- **모듈 해상도**: NodeNext
- **Import 확장자**: `.js` 확장자 필수 (예: `import { db } from './db/connection.js'`)
- **JSX**: Hono JSX 지원

## 개발 시 주의사항

1. **ES Modules**: TypeScript 파일에서도 import 시 `.js` 확장자 사용 필요
2. **Vercel 환경 테스트**: `vercel dev`로 로컬 테스트하여 서버리스 환경 재현
3. **데이터베이스 풀 모드**: Supabase Transaction 모드 사용 시 `prepare: false` 필수
4. **패키지 매니저**: 이 프로젝트는 `yarn`을 사용합니다 (npm 대신 yarn 사용)

## 라이선스

MIT
