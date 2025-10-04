# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

브라우저에서 완전히 클라이언트 사이드로 동작하는 미디어 편집 도구입니다. 이미지와 비디오를 크롭하고 편집할 수 있으며, 서버 업로드 없이 브라우저 내에서 모든 처리가 이루어집니다.

## 개발 명령어

```bash
# 개발 서버 실행 (기본 포트: 5173)
npm run dev

# TypeScript 타입 체크 후 프로덕션 빌드
npm run build

# ESLint 실행 (Prettier 규칙 포함)
npm run lint

# 빌드된 결과물 프리뷰
npm run preview
```

## 기술 스택 및 아키텍처

### 핵심 라이브러리
- **React 19** + **TypeScript**: UI 프레임워크 및 타입 안전성
- **Vite**: 빌드 도구 (HMR 및 빠른 빌드)
- **TailwindCSS v4**: 유틸리티 우선 CSS 프레임워크 (Vite 플러그인 사용)
- **react-router v7**: 클라이언트 사이드 라우팅
- **react-easy-crop**: 이미지/비디오 크롭 UI 컴포넌트
- **mediabunny**: 브라우저 내 비디오 처리 라이브러리 (WebCodecs API 활용)

### 프로젝트 구조
- `src/routes.ts`: 라우터 설정 (`createBrowserRouter` 사용)
- `src/App.tsx`: 메인 앱 컴포넌트
- `src/main.tsx`: React 앱 진입점

### 브라우저 기술 활용
- **WebCodecs API**: 고성능 비디오 인코딩/디코딩
- **Canvas API**: 이미지 처리
- **File API**: 로컬 파일 접근

모든 미디어 처리는 클라이언트에서만 수행되며 서버 전송이 없습니다.

## 코드 스타일
- ESLint + Prettier 설정됨
- TypeScript strict mode 권장
- React 19 최신 기능 활용 (Compiler 등)
