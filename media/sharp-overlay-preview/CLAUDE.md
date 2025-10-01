# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이미지에 텍스트를 오버레이하고 실시간 미리보기할 수 있는 웹 애플리케이션입니다. Node.js/Express 백엔드에서 Sharp 라이브러리를 사용하여 이미지 처리를 수행하고, React 프론트엔드에서 드래그 앤 드롭 인터페이스를 제공합니다.

## 프로젝트 구조

```
├── backend/           # Node.js + Express + Sharp 서버
│   └── src/
│       ├── server.ts    # Express 서버 및 API 엔드포인트
│       ├── overlay.ts   # Sharp를 이용한 이미지 오버레이 로직
│       └── types.ts     # CouponEmbeddingSettings 인터페이스
├── frontend/          # React + TypeScript + Vite 클라이언트
│   └── src/
│       ├── App.tsx                    # 메인 컴포넌트
│       ├── ImageUploadComponent.tsx   # 이미지 업로드 UI
│       ├── SettingsFormComponent.tsx  # 텍스트 설정 입력 폼
│       ├── PreviewCanvasComponent.tsx # 드래그 앤 드롭 프리뷰
│       └── types.ts                   # CouponEmbeddingSettings 인터페이스
├── specs/             # 명세서 및 계획 문서
└── refs/              # 참고 문서 (API 스펙, 컴포넌트 구조 등)
```

## 개발 환경 설정

### 백엔드 서버 실행
```bash
cd backend
npm install    # 최초 1회만
npm start      # tsx로 server.ts 실행, http://localhost:3001
```

### 프론트엔드 개발 서버 실행
```bash
cd frontend
npm install    # 최초 1회만
npm run dev    # Vite 개발 서버, http://localhost:5173
```

### 프론트엔드 빌드 및 Lint
```bash
cd frontend
npm run build    # TypeScript 컴파일 및 Vite 빌드
npm run lint     # ESLint 실행
```

## 핵심 아키텍처

### 타입 시스템
- `CouponEmbeddingSettings` 인터페이스가 백엔드(`backend/src/types.ts`)와 프론트엔드(`frontend/src/types.ts`)에 동일하게 정의되어 있습니다.
- 속성: `left`, `top`, `fontSize`, `fontColor`, `fontFamily`, `fontWeight`

### 이미지 처리 흐름
1. 클라이언트에서 이미지 업로드 → 서버가 메모리에 Buffer로 저장하고 imageId 반환
2. 클라이언트에서 텍스트 및 설정값 변경 → `/preview` API 호출
3. 서버에서 Sharp를 사용하여 SVG 텍스트를 이미지에 오버레이
4. 클라이언트에서 프리뷰 이미지 표시 및 드래그 앤 드롭으로 위치 조정
5. 최종 이미지 다운로드 시 `/download` API 호출

### API 엔드포인트
- `POST /upload`: 이미지 업로드 (multipart/form-data) → `{ imageId: string }`
- `POST /preview`: 프리뷰 생성 (JSON: imageId, settings, text) → Buffer (image/png)
- `POST /download`: 최종 이미지 생성 (JSON: imageId, settings, text) → Buffer (image/png)

### Sharp 오버레이 구현
- `backend/src/overlay.ts`의 `overlayText()` 함수가 SVG 텍스트를 생성하고 Sharp의 `composite()` API를 사용하여 이미지에 합성합니다.
- SVG의 `x`, `y` 속성에 `settings.left`, `settings.top` 값을 직접 사용합니다.

### 프론트엔드 상태 관리
- `App.tsx`에서 `imageId`, `text`, `settings` 상태를 관리합니다.
- 각 컴포넌트(`ImageUploadComponent`, `SettingsFormComponent`, `PreviewCanvasComponent`)는 props로 상태와 setState 함수를 받습니다.
- `PreviewCanvasComponent`는 드래그 앤 드롭 이벤트를 처리하여 `settings.left`, `settings.top`을 업데이트합니다.

## 작업 시 주의사항

### 타입 동기화
- `CouponEmbeddingSettings` 인터페이스를 변경할 때는 백엔드와 프론트엔드 양쪽 파일을 모두 수정해야 합니다.

### Sharp SVG 오버레이 좌표
- Sharp의 `composite()` API에서 `top`, `left` 옵션은 SVG 자체의 배치 위치입니다.
- SVG 내부의 `<text>` 요소의 `x`, `y` 속성이 실제 텍스트 좌표를 결정합니다.
- 현재 구현에서는 `composite({ top: 0, left: 0 })`로 고정하고, SVG의 `x`, `y`에 `settings.left`, `settings.top`을 사용합니다.

### 이미지 저장소
- 서버의 `imageStore`는 메모리 기반 Map이므로, 서버 재시작 시 이미지가 사라집니다.
- 프로덕션 환경에서는 파일 시스템 또는 외부 스토리지로 변경이 필요합니다.

### 지원 이미지 포맷
- JPEG, PNG, WebP 포맷을 지원합니다.
- 폰트는 시스템 폰트만 사용 가능합니다(폰트 파일 업로드 미지원).