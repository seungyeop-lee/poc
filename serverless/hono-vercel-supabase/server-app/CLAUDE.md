# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Vercel 서버리스 환경에서 Hono 웹 프레임워크를 사용하는 애플리케이션입니다. PostgreSQL 데이터베이스 연결(Drizzle ORM 사용)과 mTLS(Mutual TLS) 클라이언트 기능을 포함합니다.

## 주요 명령어

### 패키지 관리자
- 이 프로젝트는 `yarn`을 사용합니다 (`yarn.lock` 존재)
- 패키지 설치: `yarn install`

### 개발 환경
- **로컬 개발 서버**: `yarn dev` 또는 `vercel dev`
  - Vercel CLI를 사용하여 서버리스 환경을 시뮬레이션합니다
  - 기본 포트: http://localhost:3000
- **타입 체크**: `yarn type-check`
  - 빌드 없이 TypeScript 타입 검사만 수행
- **빌드**: `yarn build`
  - TypeScript를 컴파일하여 `dist/` 디렉토리에 출력

### Docker 기반 테스트 환경
Makefile을 통해 Docker Compose 환경을 관리합니다:
- **서비스 시작**: `make up`
  - mTLS 서버(포트 8443)와 Hono 서버(포트 3000)를 백그라운드로 실행
- **서비스 중지**: `make down`
- **이미지 빌드**: `make build`
- **로그 확인**: `make logs`
- **mTLS 테스트**: `make test`
  - http://localhost:3000/mtls-test 엔드포인트 호출
- **환경 정리**: `make clean`

### Vercel 배포
- **로컬 빌드**: `vercel build` (또는 `vc build`)
- **배포**: `vercel deploy` (또는 `vc deploy`)

## 아키텍처 구조

### 엔트리 포인트 및 라우팅
- **Vercel 서버리스**: `src/index.ts`가 메인 엔트리 포인트
  - `vercel.json`에서 모든 요청(`/(.*)`)을 `src/index.ts`로 라우팅
  - Hono 앱 인스턴스를 export하여 Vercel이 핸들링
- **로컬 개발**: `src/server.ts`
  - `@hono/node-server`를 사용하여 로컬 포트 3000에서 실행
  - `src/index.ts`의 Hono 앱을 import하여 사용

### 데이터베이스 계층
- **연결**: `src/db/connection.ts`
  - `postgres-js` 클라이언트와 Drizzle ORM 초기화
  - `prepare: false` 옵션: Supabase의 "Transaction" 풀 모드와 호환성 확보
  - 환경 변수 `DATABASE_URL` 필요
- **스키마**: `src/db/schema.ts`
  - Drizzle ORM의 `pgTable`을 사용하여 테이블 정의
  - 현재 `testTable`만 정의됨 (id, name, createdAt)
- **마이그레이션**: `drizzle.config.ts`
  - 스키마 경로: `./src/db/schema.ts`
  - 마이그레이션 출력: `./drizzle`

### mTLS 클라이언트
- **구현**: `src/utils/mtls-client.ts`
  - `undici` 라이브러리를 사용하여 mTLS 연결 수행
  - 인증서 관리:
    - 환경 변수 우선 사용: `CA_CERT`, `CLIENT_CERT`, `CLIENT_KEY`
    - 환경 변수 없으면 `certs/` 디렉토리에서 파일 읽기
  - 서버 URL: 환경 변수 `MTLS_SERVER_URL` (기본값: `https://localhost:8443`)
  - `servername: 'localhost'`로 인증서 CN 매칭 강제
- **실패 테스트**: `src/utils/mtls-fail-tests.ts`
  - 다양한 mTLS 실패 시나리오 테스트용

### API 엔드포인트
`src/index.ts`에서 정의된 엔드포인트:
- `GET /`: 기본 텍스트 응답
- `GET /health`: 헬스체크 (status, timestamp 반환)
- `GET /db-test`: 데이터베이스 연결 테스트 (testTable에서 1개 레코드 조회)
- `GET /mtls-test`: mTLS 연결 테스트 (외부 mTLS 서버에 요청)
- `GET /mtls-fail-test`: mTLS 실패 시나리오 테스트

## 환경 변수

필수 환경 변수:
- `DATABASE_URL`: PostgreSQL 연결 문자열 (Drizzle ORM 사용)

선택적 환경 변수:
- `MTLS_SERVER_URL`: mTLS 서버 주소 (기본값: https://localhost:8443)
- `CA_CERT`: CA 인증서 (PEM 형식)
- `CLIENT_CERT`: 클라이언트 인증서 (PEM 형식)
- `CLIENT_KEY`: 클라이언트 개인키 (PEM 형식)

Docker Compose 환경에서는 `docker-compose.yml`에 인증서가 하드코딩되어 있습니다.

## TypeScript 설정

- **모듈 시스템**: ES Modules (`"type": "module"` in package.json)
- **모듈 해상도**: NodeNext
- **출력 디렉토리**: `./dist`
- **JSX**: Hono JSX 지원 (`jsxImportSource: "hono/jsx"`)
- **파일 임포트**: `.js` 확장자 필수 (예: `import { db } from './db/connection.js'`)

## 개발 시 주의사항

1. **Import 확장자**: ES Modules 사용으로 인해 TypeScript 파일에서도 `.js` 확장자로 import 필요
2. **Vercel 환경**: `vercel dev`로 테스트하여 서버리스 환경과 동일한 조건 재현
3. **데이터베이스 풀 모드**: Supabase Transaction 모드 사용 시 `prepare: false` 필수
4. **mTLS 테스트**: Docker Compose 환경에서 테스트 (인증서 자동 설정)
