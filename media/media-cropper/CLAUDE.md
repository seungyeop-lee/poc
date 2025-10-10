# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

브라우저에서 완전히 클라이언트 사이드로 동작하는 미디어 편집 도구입니다. 이미지와 비디오를 크롭하고 편집할 수 있으며, 서버 업로드 없이 브라우저 내에서 모든 처리가 이루어집니다.

## 개발 명령어

```bash
# 개발 서버 실행 (기본 포트: 5173)
make up

# 개발 서버 중지
make down

# TypeScript 타입 체크 후 프로덕션 빌드
npm run build

# ESLint 실행 (Prettier 규칙 포함)
npm run lint
```

## 기술 스택 및 아키텍처

### 핵심 라이브러리
- **React 19** + **TypeScript**: UI 프레임워크 및 타입 안전성
- **Vite**: 빌드 도구 (HMR 및 빠른 빌드)
- **TailwindCSS v4**: 유틸리티 우선 CSS 프레임워크 (Vite 플러그인 사용)
- **react-router v7**: 클라이언트 사이드 라우팅
- **react-easy-crop**: 이미지/비디오 크롭 UI 컴포넌트
- **mediabunny**: 브라우저 내 비디오 처리 라이브러리 (WebCodecs API 활용)
- **Zustand**: 상태 관리 (미디어, 이미지 크롭, 비디오 크롭 스토어)

### 브라우저 기술 활용
- **WebCodecs API**: 고성능 비디오 인코딩/디코딩 (`checkWebCodecsSupport()`로 지원 확인)
- **Canvas API**: 이미지 처리 및 크롭
- **File API**: 로컬 파일 접근 및 다운로드

모든 미디어 처리는 클라이언트에서만 수행되며 서버 전송이 없습니다.

### 코덱 및 포맷 지원
- 자동 코덱 지원 감지 (H.264/AVC, VP9, AV1, AAC, Opus, MP3)
- 동적 포맷 호환성 확인 (MP4, WebM)
- 비트레이트, 프레임률, 키프레임 간격 등 고급 설정
- 코덱별 최적화 옵션 자동 추천

## 코드 스타일
- ESLint + Prettier 설정됨
- TypeScript strict mode (tsconfig.app.json:20)
- React 19 최신 기능 활용 (Compiler 등)

## 라이브러리 작업 가이드
핵심 라이브러리(React, react-router, react-easy-crop, mediabunny, TailwindCSS 등)와 관련된 작업을 수행할 경우:
1. **context7 MCP를 통해 최신 문서 정보를 먼저 확인**
   - `mcp__context7__resolve-library-id`로 라이브러리 ID 조회
   - `mcp__context7__get-library-docs`로 공식 문서 및 예제 획득
2. **획득한 공식 자료를 바탕으로 작업 진행**
   - 추측하지 말고 문서화된 API 및 베스트 프랙티스 준수
   - 버전별 차이나 최신 기능 변경사항 반영

## 코드 검색 가이드
파일에 대한 정보가 필요하면 **ck-search MCP의 hybrid_search**를 적극 이용하세요. 이 검색 도구는 시맨틱 검색과 정규식 검색을 결합하여 코드베이스 내의 관련 코드를 효과적으로 찾아줍니다.

## 빌드 및 타입 설정
- Vite 설정: `vite.config.ts` (React + TailwindCSS 플러그인)
- TypeScript 설정: `tsconfig.app.json` (ES2022, strict mode, DOM types)
- 빌드 순서: `tsc -b && vite build` (타입 체크 후 번들링)

## 상태 관리 패턴
Zustand를 사용한 분리된 스토어 구조:
- `useMediaStore`: 파일 관리 및 URL 메모리 정리
- `useImageCropStore`: 이미지 크롭 파라미터
- `useVideoCropStore`: 비디오 크롭, 트림, 코덱 옵션 통합 관리
