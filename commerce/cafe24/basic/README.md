# Cafe24 API 연동 기본 프로젝트

카페24 OAuth 인증 및 API 연동을 위한 Next.js 기반 웹 애플리케이션입니다.

## 프로젝트 개요

이 프로젝트는 카페24 스토어와의 API 연동을 위한 기본적인 OAuth 인증 플로우를 구현합니다. 카페24 API를 통해 상품 정보를 조회하고 관리할 수 있는 기능을 제공합니다.

## 주요 기능

- **OAuth 인증**: 카페24 OAuth 2.0 인증 플로우 구현
- **HMAC 검증**: 카페24에서 전달되는 데이터의 무결성 검증
- **토큰 관리**: Access Token 및 Refresh Token 관리
- **API 연동**: 카페24 상품 API 연동 예제

## 기술 스택

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **HTTP Client**: Axios
- **Crypto**: crypto-js (HMAC 생성용)
- **Testing**: Jest

## 환경 설정

프로젝트 실행을 위해 다음 환경변수를 설정해야 합니다:

```env
CAFE24_CLIENT_ID=your_client_id
CAFE24_SECRET_KEY=your_secret_key
CAFE24_REDIRECT_URL=http://localhost:3000/redirect
CAFE24_SCOPE=mall.read_product,mall.write_product
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 위의 환경변수를 설정합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 `http://localhost:3000`에서 애플리케이션에 접근할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/webhook/        # 웹훅 API 엔드포인트
│   ├── auth/              # OAuth 인증 페이지
│   └── redirect/          # OAuth 리다이렉트 처리 페이지
├── components/            # 재사용 가능한 컴포넌트
├── config/               # 설정 파일
├── server/              # 서버 액션 및 API 로직
└── utils/               # 유틸리티 함수
```

## 사용 방법

### 1. 카페24 앱 설치 및 접근

카페24에서 앱을 설치하거나 접근할 때 다음 형식의 URL로 호출됩니다:

```
https://{{AppUrl}}/?is_multi_shop={{멀티쇼핑몰여부}}&lang={{쇼핑몰언어}}&mall_id={{mall_id}}&shop_no={{shop_no}}&timestamp={{timestamp}}&user_id={{로그인아이디}}&user_name={{로그인사용자이름}}&user_type={{사용자유형}}&hmac={{검증용 key}}
```

이 프로젝트에서는 `AppUrl`을 `{host}/auth`로 설정합니다. 예시:

```
http://localhost:3000/auth?is_multi_shop=F&lang=ko_KR&mall_id=testmall&shop_no=1&timestamp=1234567890&user_id=testuser&user_name=테스트사용자&user_type=A&hmac=HMAC_VALUE
```

### 2. 기본 테스트 플로우

1. **HMAC 검증 확인**: `/auth` 페이지에서 전달된 HMAC 값의 유효성을 확인합니다
2. **OAuth 인증 요청**: "Request Auth" 버튼을 클릭하여 카페24 OAuth 서버로 이동합니다
3. **리다이렉트 처리**: 인증 완료 후 `/redirect` 페이지로 이동하여 상태값을 검증합니다
4. **토큰 획득**: "Request Token (by code)" 버튼으로 Access Token과 Refresh Token을 획득합니다
5. **토큰 갱신**: "Request Token (by refreshToken)" 버튼으로 토큰을 갱신할 수 있습니다
6. **API 호출**: "all Product List" 버튼으로 상품 목록 API를 테스트합니다

### 3. 인증 플로우 상세

1. **HMAC 검증**: 카페24에서 전달된 데이터의 무결성을 검증합니다
2. **OAuth 인증**: 카페24 OAuth 서버로 리다이렉트하여 인증을 진행합니다
3. **토큰 획득**: 인증 완료 후 Access Token과 Refresh Token을 획득합니다
4. **API 호출**: 획득한 토큰으로 카페24 API를 호출합니다

### 3. 주요 API

- **상품 목록 조회**: `/api/v2/admin/products`
- **토큰 갱신**: Refresh Token을 이용한 Access Token 갱신

## 테스트

```bash
npm test
```

Jest를 이용하여 HMAC 생성 함수 등의 단위 테스트를 실행할 수 있습니다.

## 주의사항

- 실제 운영 환경에서는 적절한 환경변수 관리가 필요합니다
- HMAC 검증은 보안상 매우 중요하므로 반드시 서버 사이드에서 처리해야 합니다
- 토큰은 보안상 안전한 곳에 저장하고 관리해야 합니다

## 라이센스

이 프로젝트는 개인 학습 및 테스트 목적으로 제작되었습니다.
