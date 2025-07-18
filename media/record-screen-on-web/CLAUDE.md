# CLAUDE.md

이 파일은 이 리포지토리의 코드 작업 시 Claude Code (claude.ai/code)에게 가이드를 제공합니다.

## 프로젝트 개요

선택한 비디오 또는 웹캠 영상의 우측상단에 선택한 이미지를 추가하여 다시 인코딩하는 웹 기반 비디오 편집 도구입니다. 이 프로젝트는 브라우저에서 직접 비디오 편집이 가능한 개념 증명(POC)입니다.

### 주요 기능
- **영상 소스 선택**
  - 비디오 파일 업로드 및 미리보기
  - 웹캠 실시간 스트림 캡처
- **편집 기능**
  - 이미지 파일 업로드 (워터마크/로고용)
  - 이미지를 영상 우측상단에 오버레이 적용
  - 실시간 편집 미리보기
- **출력 기능**
  - 편집된 비디오 실시간 인코딩
  - 완성된 비디오 파일 다운로드

## 기술 스택

### 프론트엔드 프레임워크
- **Next.js 15**: App Router 방식 사용
- **React 19**: 최신 React 기능 활용
- **TypeScript**: 완전한 타입 안전성
- **Tailwind CSS v4**: 모던 스타일링

### 미디어 처리 기술
- **HTMLCanvasElement.captureStream()**: 캔버스의 실시간 스트림 캡처
- **WebCodecs API**: 브라우저 네이티브 비디오 인코딩/디코딩
- **MediaRecorder API**: 캡처된 스트림 녹화
- **getUserMedia API**: 웹캠 및 마이크 접근
- **MediaStream API**: 실시간 미디어 스트림 처리
- **File API**: 로컬 파일 읽기 및 처리

### 아키텍처 구조
- **클라이언트 사이드 처리**: 모든 비디오 편집은 브라우저에서 실행
- **컴포넌트 기반**: 재사용 가능한 React 컴포넌트 구조
- **상태 관리**: React hooks를 통한 로컬 상태 관리

## 코드 아키텍처 지침

### PoC 및 재사용성 원칙
이 프로젝트는 개념 증명(PoC)이지만, 동시에 **실제 프로덕션 환경에서 부분적으로 갈아끼우거나 그 자체를 사용할 수 있는 형태**로 코드를 작성해야 합니다.

### 컴포넌트 설계 원칙
1. **모듈성 (Modularity)**
   - 각 컴포넌트는 단일 책임 원칙을 따라 독립적으로 작동
   - 외부 의존성을 최소화하여 다른 프로젝트에서 쉽게 재사용 가능
   - Props 인터페이스를 명확히 정의하여 컴포넌트 간 결합도 최소화

2. **재사용성 (Reusability)**
   - 비즈니스 로직과 UI 로직 분리
   - Custom Hooks를 활용한 상태 로직 추상화
   - 범용적으로 사용 가능한 컴포넌트 우선 설계

3. **확장성 (Scalability)**
   - 컴포넌트 컴포지션 패턴 적용
   - Render Props 및 Higher-Order Components 활용
   - 플러그인 방식의 기능 확장 지원

### 폴더 구조 설계
```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Input 등)
│   ├── media/          # 미디어 관련 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── hooks/              # Custom Hooks
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
└── features/           # 기능별 도메인 컴포넌트
```

### 컴포넌트 예시 구조
```typescript
// 독립적이고 재사용 가능한 컴포넌트 구조
interface VideoEditorProps {
  onVideoProcessed?: (blob: Blob) => void;
  watermarkPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxFileSize?: number;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  onVideoProcessed,
  watermarkPosition = 'top-right',
  maxFileSize = 100 * 1024 * 1024 // 100MB
}) => {
  // 컴포넌트 구현
};
```

### 개발 시 고려사항
- 각 컴포넌트는 `README.md`와 함께 사용법 문서화
- Props 인터페이스에 JSDoc 주석으로 상세 설명 추가
- 컴포넌트별 스토리북 또는 예시 코드 제공
- 에러 바운더리 및 폴백 UI 구현
- 성능 최적화를 위한 메모이제이션 적용

이러한 원칙을 통해 PoC 단계에서도 실제 프로덕션에서 활용 가능한 고품질 컴포넌트를 개발합니다.

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린팅 실행
npm run lint
```

## 주요 파일 및 구조

- `src/app/page.tsx` - 메인 랜딩 페이지 (현재 "Hello World!" 표시)
- `src/app/layout.tsx` - 루트 레이아웃 컴포넌트
- `src/app/globals.css` - Tailwind 임포트가 포함된 글로벌 CSS
- `package.json` - Next.js 15, React 19, Tailwind CSS v4 사용

## 의존성

- **React**: 19.1.0
- **Next.js**: 15.4.1
- **Tailwind CSS**: v4 (최신)
- **TypeScript**: v5

## 구현 계획

### 1단계: 영상 소스 선택 및 미리보기
- 영상 소스 선택 인터페이스 (비디오 파일 vs 웹캠)
- 비디오 파일 업로드 컴포넌트 구현
- 웹캠 접근 및 스트림 캡처 기능
- 이미지 파일 업로드 컴포넌트 구현
- 선택된 소스 미리보기 기능

### 2단계: 캔버스 기반 영상 렌더링
- HTMLCanvasElement를 사용한 영상 프레임 렌더링
- 비디오 파일과 웹캠 스트림 모두 지원
- 이미지 오버레이를 영상 우측상단에 합성
- 실시간 미리보기 기능 구현

### 3단계: 스트림 캡처 및 인코딩
- Canvas.captureStream()으로 합성된 영상 캡처
- WebCodecs API를 사용한 비디오 인코딩
- MediaRecorder API로 최종 비디오 파일 생성

### 4단계: 사용자 인터페이스 완성
- 파일 선택 UI 개선
- 진행률 표시기 추가
- 다운로드 기능 구현

## 구현 세부 사항

### 웹캠 접근 로직
```typescript
// 웹캠 스트림 가져오기
const getUserMediaStream = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080 },
      audio: true
    });
    return stream;
  } catch (error) {
    console.error('웹캠 접근 오류:', error);
    throw error;
  }
};
```

### 캔버스 합성 로직
```typescript
// 영상 소스(비디오/웹캠)와 이미지를 캔버스에 합성
const drawFrame = (
  ctx: CanvasRenderingContext2D, 
  videoSource: HTMLVideoElement, 
  image: HTMLImageElement
) => {
  // 영상 프레임 그리기 (비디오 파일 또는 웹캠 스트림)
  ctx.drawImage(videoSource, 0, 0, canvas.width, canvas.height);
  
  // 이미지를 우측상단에 오버레이
  const imageSize = 100; // 이미지 크기
  const margin = 20; // 여백
  ctx.drawImage(
    image, 
    canvas.width - imageSize - margin, 
    margin, 
    imageSize, 
    imageSize
  );
};
```

### WebCodecs 활용
```typescript
// VideoEncoder를 사용한 인코딩 설정
const encoder = new VideoEncoder({
  output: (chunk) => {
    // 인코딩된 비디오 청크 처리
  },
  error: (error) => {
    console.error('인코딩 오류:', error);
  }
});

encoder.configure({
  codec: 'vp8',
  width: 1920,
  height: 1080,
  bitrate: 2000000
});
```

이 프로젝트는 현재 기본 Next.js 설정이 완료된 초기 개발 단계입니다.

## 언어 지침

- **모든 문서화**: 한국어로 작성
- **Claude의 모든 답변**: 한국어로 제공
- **코드 주석**: 한국어로 작성 (필요시)
- **컨텍스트상 작성되는 모든 문서**: 한국어로 기재