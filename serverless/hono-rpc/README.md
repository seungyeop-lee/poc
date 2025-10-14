# hono-rpc

Hono의 RPC 기능을 활용한 타입 안전한 클라이언트-서버 통신 PoC 프로젝트입니다.

## 프로젝트 목적

이 프로젝트는 Hono 프레임워크의 RPC(Remote Procedure Call) 기능을 활용하여 서버와 클라이언트 간에 완벽한 타입 추론이 가능한 API 통신을 구현하는 것을 목표로 합니다. 서버에서 정의된 API 타입을 클라이언트에서 직접 사용할 수 있어, 타입 안전성을 보장하면서도 개발 생산성을 높일 수 있습니다.

## 평가

- 타입 추론이 잘 되기는하나, tsc의 느린속도 및 타겟이 되는 속성 외에 다른 속성들도 자동완성으로 나와서 사용성이 떨어짐
- WebStorm에서는 Yarn Workspace가 잘 인식되나, VSCode에서는 인식이 안되는 것도 문제 (해결법이 있을 듯 하지만, 찾고 적용 할 의욕이 없음)
- 그래서 현재 (2025년 10월 14일) Hono RPC는 NextJS같은 Full Stack Framework에서나 사용 할 법하다는 결론

## 주요 기능

- **타입 안전한 API 통신**: 서버의 API 타입을 클라이언트에서 자동으로 추론
- **Zod 스키마 검증**: 요청 데이터의 유효성 검증
- **모노레포 구조**: Yarn 워크스페이스를 활용한 효율적인 패키지 관리
- **React 통합**: Vite 기반 React 애플리케이션에서 타입 안전한 API 호출

## 프로젝트 구조

```
hono-rpc/
├── packages/
│   ├── hono-server/    # Hono 서버 (API 제공)
│   └── hono-client/    # React 클라이언트 (Vite)
└── package.json        # 워크스페이스 설정
```

## 기술 스택

- **서버**: Hono, Zod, TypeScript
- **클라이언트**: React, Vite, TypeScript
- **패키지 관리**: Yarn 워크스페이스

## 시작하기

### 사전 요구사항

- Node.js (v20 이상 권장)
- Yarn (v4.9.2)

### 설치

```bash
yarn install
```

### 개발 서버 실행

#### 1. 서버 실행

터미널에서 다음 명령어를 실행하여 Hono 서버를 시작합니다 (포트 3000):

```bash
yarn workspace @hono-rpc/hono-server dev
```

#### 2. 클라이언트 실행

새 터미널을 열고 다음 명령어를 실행하여 React 개발 서버를 시작합니다:

```bash
yarn workspace @hono-rpc/hono-client dev
```

브라우저에서 표시된 URL(일반적으로 http://localhost:5173)로 접속하면 클라이언트 애플리케이션을 확인할 수 있습니다.

## 작동 방식

1. **서버 타입 정의** (`packages/hono-server/src/app.ts`): Hono 앱에서 API 라우트와 스키마를 정의
2. **타입 export** (`packages/hono-server/src/index.ts`): 서버 앱의 타입을 export
3. **클라이언트에서 타입 사용** (`packages/hono-client/src/hono-client.ts`): 서버 타입을 import하여 타입 안전한 클라이언트 생성
4. **API 호출**: React 컴포넌트에서 완벽한 타입 추론과 함께 API 호출

이를 통해 서버 API가 변경되면 클라이언트에서 타입 오류가 발생하여, 런타임 전에 문제를 발견할 수 있습니다.

## ref.

- [woowahan-monorepo-template](https://github.com/kowoohyuk/monorepo-template)
