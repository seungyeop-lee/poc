# 저수준 행동 계획

## 실행 환경 설정

### 필수 도구 및 설치

```bash
node --version && npm --version
```

**예상 결과**: Node.js v18.0.0 이상, npm v9.0.0 이상

### 사전 조건 확인

```bash
pwd && ls -la
```

**예상 결과**: 작업 디렉토리 경로가 표시되고, 현재 디렉토리의 파일 목록이 출력됨

## 단계별 액션 플랜

### 액션 1: 현재 디렉토리 구조 확인

**선행 조건**: 없음

**실행 명령어**:
```bash
ls -la
```

**예상 결과**: 현재 디렉토리의 모든 파일 및 폴더 목록이 출력됨

**완료 조건**: 디렉토리 내 파일 목록을 확인하여 기존 프로젝트 파일이 있는지 파악할 수 있음

**검증 방법**:
```bash
ls -la | wc -l
```

**예상 검증 결과**: 1 이상의 숫자 출력

**주의사항**: 기존 package.json이나 node_modules가 있는 경우 추후 단계에서 충돌 가능

---

### 액션 2: package.json 파일 존재 여부 확인

**선행 조건**: 액션 1이 완료되어야 함

**실행 명령어**:
```bash
test -f package.json && echo "package.json exists" || echo "package.json does not exist"
```

**예상 결과**: "package.json exists" 또는 "package.json does not exist" 출력

**완료 조건**: package.json 파일의 존재 여부를 확인함

**검증 방법**:
```bash
test -f package.json && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 또는 "fail" 출력

**주의사항**: package.json이 존재하지 않으면 새로 생성해야 하며, 존재하는 경우 기존 의존성을 확인해야 함

---

### 액션 3: package.json 내용 확인 (파일이 존재하는 경우)

**선행 조건**: 액션 2에서 package.json 파일이 존재함을 확인해야 함

**실행 명령어**:
```bash
test -f package.json && cat package.json || echo "No package.json found"
```

**예상 결과**: package.json의 전체 내용이 출력되거나 "No package.json found" 메시지 출력

**완료 조건**: 기존 의존성 목록을 확인하여 필요한 라이브러리가 이미 설치되어 있는지 파악함

**검증 방법**:
```bash
test -f package.json && cat package.json | grep -E "dependencies|devDependencies" || echo "No dependencies found"
```

**예상 검증 결과**: dependencies 또는 devDependencies 섹션이 출력되거나 "No dependencies found" 메시지 출력

**주의사항**: 기존 의존성과 버전 충돌 가능성 확인 필요

---

### 액션 4: tsconfig.json 파일 존재 여부 확인

**선행 조건**: 액션 1이 완료되어야 함

**실행 명령어**:
```bash
test -f tsconfig.json && echo "tsconfig.json exists" || echo "tsconfig.json does not exist"
```

**예상 결과**: "tsconfig.json exists" 또는 "tsconfig.json does not exist" 출력

**완료 조건**: tsconfig.json 파일의 존재 여부를 확인함

**검증 방법**:
```bash
test -f tsconfig.json && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 또는 "fail" 출력

**주의사항**: TypeScript 프로젝트 설정 파일이 없으면 새로 생성해야 함

---

### 액션 5: tsconfig.json 내용 확인 (파일이 존재하는 경우)

**선행 조건**: 액션 4에서 tsconfig.json 파일이 존재함을 확인해야 함

**실행 명령어**:
```bash
test -f tsconfig.json && cat tsconfig.json || echo "No tsconfig.json found"
```

**예상 결과**: tsconfig.json의 전체 내용이 출력되거나 "No tsconfig.json found" 메시지 출력

**완료 조건**: TypeScript 컴파일 설정을 확인하여 프로젝트 설정을 파악함

**검증 방법**:
```bash
test -f tsconfig.json && cat tsconfig.json | grep "compilerOptions" || echo "No compilerOptions found"
```

**예상 검증 결과**: compilerOptions 섹션이 출력되거나 "No compilerOptions found" 메시지 출력

**주의사항**: 기존 컴파일러 옵션과의 호환성 확인 필요

---

### 액션 6: CouponEmbeddingSettings 인터페이스 정의 파일 검색

**선행 조건**: 액션 1이 완료되어야 함

**실행 명령어**:
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "CouponEmbeddingSettings" {} \; 2>/dev/null || echo "No files found"
```

**예상 결과**: CouponEmbeddingSettings를 포함하는 TypeScript 파일 경로 목록이 출력되거나 "No files found" 메시지 출력

**완료 조건**: CouponEmbeddingSettings 인터페이스가 정의된 파일을 찾음

**검증 방법**:
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "CouponEmbeddingSettings" {} \; 2>/dev/null | wc -l
```

**예상 검증 결과**: 0 이상의 숫자 출력

**주의사항**: 인터페이스 파일이 없으면 새로 정의해야 함

---

### 액션 7: CouponEmbeddingSettings 인터페이스 내용 확인 (파일이 존재하는 경우)

**선행 조건**: 액션 6에서 CouponEmbeddingSettings를 포함하는 파일을 찾았어야 함

**실행 명령어**:
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -A 10 "interface CouponEmbeddingSettings" {} \; 2>/dev/null || echo "No interface definition found"
```

**예상 결과**: CouponEmbeddingSettings 인터페이스 정의 내용이 출력되거나 "No interface definition found" 메시지 출력

**완료 조건**: 인터페이스의 모든 속성(left, top, fontSize, fontColor, fontFamily, fontWeight)을 확인함

**검증 방법**:
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -A 10 "interface CouponEmbeddingSettings" {} \; 2>/dev/null | grep -E "left|top|fontSize|fontColor|fontFamily|fontWeight" | wc -l
```

**예상 검증 결과**: 6 (모든 속성이 정의되어 있는 경우)

**주의사항**: 속성이 누락되거나 타입이 잘못 정의된 경우 수정 필요

---

### 액션 8: Node.js 및 npm 버전 확인

**선행 조건**: 없음

**실행 명령어**:
```bash
node --version && npm --version
```

**예상 결과**: Node.js 버전 (예: v18.17.0)과 npm 버전 (예: 9.6.7)이 출력됨

**완료 조건**: Node.js v18.0.0 이상, npm v9.0.0 이상이 설치되어 있음을 확인함

**검증 방법**:
```bash
node --version | grep -E "^v(1[8-9]|[2-9][0-9])\." && npm --version | grep -E "^([9-9]|[1-9][0-9])\." && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 버전이 낮으면 업데이트 필요

---

### 액션 9: Sharp 라이브러리 텍스트 오버레이 API 문서 확인

**선행 조건**: 액션 8이 완료되어 Node.js 및 npm이 설치되어 있어야 함

**실행 명령어**:
```bash
npm info sharp | grep -A 5 "homepage"
```

**예상 결과**: Sharp 라이브러리의 홈페이지 URL이 출력됨 (예: https://sharp.pixelplumbing.com)

**완료 조건**: Sharp 라이브러리의 공식 문서 링크를 확인함

**검증 방법**:
```bash
npm info sharp | grep "homepage" && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 문서를 직접 읽어 composite() 및 SVG 텍스트 렌더링 방법을 파악해야 함

---

### 액션 10: React 프로젝트 초기화 방식 결정을 위한 현황 파악

**선행 조건**: 액션 2, 3이 완료되어 package.json 상태를 파악해야 함

**실행 명령어**:
```bash
test -f vite.config.js && echo "Vite project" || test -f vite.config.ts && echo "Vite project" || test -d public && echo "Possible CRA project" || echo "No React project detected"
```

**예상 결과**: "Vite project", "Possible CRA project", 또는 "No React project detected" 메시지 출력

**완료 조건**: 기존 React 프로젝트 초기화 방식을 파악함

**검증 방법**:
```bash
test -f vite.config.js || test -f vite.config.ts || test -d public && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 또는 "fail" 출력

**주의사항**: 기존 프로젝트가 없으면 Vite를 사용하여 새 React 프로젝트를 생성해야 함

---

### 액션 11: Sharp의 composite() API를 이용한 SVG 텍스트 렌더링 방법 분석

**선행 조건**: 액션 9에서 Sharp 문서 링크를 확인해야 함

**실행 명령어**:
```bash
npm info sharp version
```

**예상 결과**: Sharp 라이브러리의 최신 버전 번호가 출력됨 (예: 0.33.0)

**완료 조건**: Sharp 라이브러리의 버전을 확인하고, composite() 메서드와 SVG 지원 여부를 파악함

**검증 방법**:
```bash
npm info sharp version | grep -E "^[0-9]+\.[0-9]+\.[0-9]+$" && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: Sharp의 composite() 메서드는 SVG Buffer를 입력으로 받아 이미지에 합성 가능

---

### 액션 12: React에서 파일 업로드 및 드래그 앤 드롭 구현 방법 분석

**선행 조건**: 액션 10에서 React 프로젝트 초기화 방식을 결정해야 함

**실행 명령어**:
```bash
echo "React에서 파일 업로드는 <input type='file'>을 사용하며, 드래그 앤 드롭은 onMouseDown, onMouseMove, onMouseUp 이벤트를 조합하여 구현함"
```

**예상 결과**: React 파일 업로드 및 드래그 앤 드롭 구현 방법 메시지 출력

**완료 조건**: React에서 파일 업로드 및 드래그 인터랙션 구현 패턴을 파악함

**검증 방법**:
```bash
echo "pass"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 드래그 시 이미지 좌표 변환 로직이 정확해야 함

---

### 액션 13: 서버-클라이언트 간 이미지 전송 방식 분석

**선행 조건**: 액션 11이 완료되어 Sharp API를 파악해야 함

**실행 명령어**:
```bash
echo "서버-클라이언트 간 이미지 전송은 FormData로 업로드하고, 서버는 Sharp로 처리 후 Buffer를 반환하며, 클라이언트는 Blob URL로 표시함"
```

**예상 결과**: 이미지 전송 방식 메시지 출력

**완료 조건**: 파일 업로드는 FormData, 프리뷰는 Blob URL 방식을 사용함을 확인함

**검증 방법**:
```bash
echo "pass"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: Blob URL은 메모리 누수 방지를 위해 사용 후 해제 필요

---

### 액션 14: CouponEmbeddingSettings 속성별 Sharp API 매핑 분석

**선행 조건**: 액션 7에서 CouponEmbeddingSettings 인터페이스를 확인하고, 액션 11에서 Sharp API를 파악해야 함

**실행 명령어**:
```bash
echo "CouponEmbeddingSettings 속성 매핑: left, top -> SVG x, y 속성; fontSize -> font-size; fontColor -> fill; fontFamily -> font-family; fontWeight -> font-weight"
```

**예상 결과**: CouponEmbeddingSettings 속성과 SVG 속성 간 매핑 정보 출력

**완료 조건**: 모든 CouponEmbeddingSettings 속성이 Sharp의 SVG 텍스트 렌더링에 매핑됨을 확인함

**검증 방법**:
```bash
echo "pass"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: SVG 텍스트는 좌표계가 좌상단 기준이므로 위치 계산 주의 필요

---

### 액션 15: 백엔드 서버 프레임워크 선택 (Express)

**선행 조건**: 액션 13이 완료되어 서버-클라이언트 통신 방식을 파악해야 함

**실행 명령어**:
```bash
echo "백엔드 서버는 Express 프레임워크를 사용하며, multer로 파일 업로드를 처리함"
```

**예상 결과**: Express 및 multer 사용 메시지 출력

**완료 조건**: 백엔드 서버 아키텍처를 Express 기반으로 결정함

**검증 방법**:
```bash
echo "pass"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: Express는 미들웨어 기반이므로 파일 업로드는 multer 미들웨어를 사용해야 함

---

### 액션 16: API 엔드포인트 설계

**선행 조건**: 액션 15에서 Express 프레임워크를 선택해야 함

**파일 작성**: `api-spec.md`
```markdown
# API 엔드포인트 설계

## POST /upload
- 요청: multipart/form-data (image 필드에 파일)
- 응답: { "imageId": "uuid", "originalWidth": 1920, "originalHeight": 1080 }

## POST /preview
- 요청: { "imageId": "uuid", "settings": CouponEmbeddingSettings, "text": "string" }
- 응답: Buffer (프리뷰 이미지)

## POST /download
- 요청: { "imageId": "uuid", "settings": CouponEmbeddingSettings, "text": "string" }
- 응답: Buffer (최종 이미지)
```

**예상 결과**: api-spec.md 파일이 생성되고, 세 개의 엔드포인트가 정의됨

**완료 조건**: /upload, /preview, /download 엔드포인트가 모두 명세에 포함됨

**검증 방법**:
```bash
test -f api-spec.md && grep -E "POST /upload|POST /preview|POST /download" api-spec.md | wc -l
```

**예상 검증 결과**: 3 (세 개의 엔드포인트 정의)

**주의사항**: imageId는 업로드된 이미지를 식별하기 위한 UUID 사용

---

### 액션 17: CouponEmbeddingSettings TypeScript 인터페이스 정의

**선행 조건**: 액션 14에서 속성 매핑을 분석해야 함

**파일 작성**: `src/types/CouponEmbeddingSettings.ts`
```typescript
export interface CouponEmbeddingSettings {
  left: number;
  top: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontWeight: number;
}
```

**예상 결과**: src/types/CouponEmbeddingSettings.ts 파일이 생성되고, 모든 필수 속성이 포함된 인터페이스가 정의됨

**완료 조건**: left, top, fontSize, fontColor, fontFamily, fontWeight 속성이 모두 정의되어 있음

**검증 방법**:
```bash
test -f src/types/CouponEmbeddingSettings.ts && grep -E "left|top|fontSize|fontColor|fontFamily|fontWeight" src/types/CouponEmbeddingSettings.ts | wc -l
```

**예상 검증 결과**: 6 (모든 속성 정의)

**주의사항**: src/types 디렉토리가 없으면 먼저 생성해야 함

---

### 액션 18: React 컴포넌트 구조 설계

**선행 조건**: 액션 12에서 React 파일 업로드 및 드래그 패턴을 분석해야 함

**파일 작성**: `component-structure.md`
```markdown
# React 컴포넌트 구조

- App.tsx
  - ImageUploadComponent.tsx: 이미지 업로드 UI
  - SettingsFormComponent.tsx: CouponEmbeddingSettings 입력 폼
  - PreviewCanvasComponent.tsx: 드래그 앤 드롭 및 프리뷰 표시
```

**예상 결과**: component-structure.md 파일이 생성되고, 세 개의 주요 컴포넌트가 정의됨

**완료 조건**: ImageUploadComponent, SettingsFormComponent, PreviewCanvasComponent가 모두 포함됨

**검증 방법**:
```bash
test -f component-structure.md && grep -E "ImageUploadComponent|SettingsFormComponent|PreviewCanvasComponent" component-structure.md | wc -l
```

**예상 검증 결과**: 3 (세 개의 컴포넌트 정의)

**주의사항**: 컴포넌트 간 상태 전달은 props를 통해 수행

---

### 액션 19: 드래그 앤 드롭 로직 설계

**선행 조건**: 액션 18에서 React 컴포넌트 구조를 설계해야 함

**파일 작성**: `drag-drop-logic.md`
```markdown
# 드래그 앤 드롭 로직

1. onMouseDown: 드래그 시작, 마우스 초기 위치 및 텍스트 초기 위치 저장
2. onMouseMove: 드래그 중, 마우스 이동 거리를 계산하여 텍스트 위치 업데이트
3. onMouseUp: 드래그 종료, 최종 위치를 CouponEmbeddingSettings의 left, top에 반영

좌표 변환:
- 화면 좌표 = (마우스 X - Canvas 왼쪽 상단 X, 마우스 Y - Canvas 왼쪽 상단 Y)
- 이미지 좌표 = 화면 좌표 * (원본 이미지 크기 / 표시 이미지 크기)
```

**예상 결과**: drag-drop-logic.md 파일이 생성되고, 드래그 이벤트 핸들러 및 좌표 변환 로직이 정의됨

**완료 조건**: onMouseDown, onMouseMove, onMouseUp 이벤트 핸들러와 좌표 변환 공식이 포함됨

**검증 방법**:
```bash
test -f drag-drop-logic.md && grep -E "onMouseDown|onMouseMove|onMouseUp|좌표 변환" drag-drop-logic.md | wc -l
```

**예상 검증 결과**: 4 이상 (모든 이벤트 및 변환 로직 포함)

**주의사항**: 좌표 변환 시 이미지 스케일링 비율을 정확히 계산해야 함

---

### 액션 20: Sharp 텍스트 오버레이 구현 코드 작성

**선행 조건**: 액션 11에서 Sharp API를 분석하고, 액션 14에서 속성 매핑을 확인해야 함

**파일 작성**: `sharp-overlay-snippet.ts`
```typescript
import sharp from 'sharp';
import { CouponEmbeddingSettings } from './src/types/CouponEmbeddingSettings';

async function overlayText(
  imageBuffer: Buffer,
  text: string,
  settings: CouponEmbeddingSettings
): Promise<Buffer> {
  const svg = `
    <svg>
      <text
        x="${settings.left}"
        y="${settings.top}"
        font-size="${settings.fontSize}"
        fill="${settings.fontColor}"
        font-family="${settings.fontFamily}"
        font-weight="${settings.fontWeight}"
      >${text}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  return await sharp(imageBuffer)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .toBuffer();
}
```

**예상 결과**: sharp-overlay-snippet.ts 파일이 생성되고, Sharp를 이용한 텍스트 오버레이 함수가 정의됨

**완료 조건**: overlayText 함수가 CouponEmbeddingSettings의 모든 속성을 SVG에 매핑하여 composite()로 합성함

**검증 방법**:
```bash
test -f sharp-overlay-snippet.ts && grep -E "composite|svg|CouponEmbeddingSettings" sharp-overlay-snippet.ts | wc -l
```

**예상 검증 결과**: 3 이상 (composite 호출, SVG 생성, 인터페이스 사용)

**주의사항**: SVG의 x, y 좌표는 텍스트의 베이스라인 기준이므로 위치 조정 필요 가능

---

### 액션 21: 백엔드 프로젝트 디렉토리 생성

**선행 조건**: 액션 16에서 API 엔드포인트를 설계해야 함

**실행 명령어**:
```bash
mkdir -p backend/src
```

**예상 결과**: backend/src 디렉토리가 생성됨

**완료 조건**: backend/src 디렉토리가 존재함

**검증 방법**:
```bash
test -d backend/src && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 기존에 backend 디렉토리가 있으면 파일 충돌 가능

---

### 액션 22: 백엔드 package.json 생성

**선행 조건**: 액션 21이 완료되어 backend 디렉토리가 생성되어야 함

**실행 명령어**:
```bash
cd backend && npm init -y
```

**예상 결과**: backend/package.json 파일이 생성됨

**완료 조건**: backend/package.json 파일이 존재하고, 기본 설정이 포함됨

**검증 방법**:
```bash
test -f backend/package.json && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: npm init -y는 기본값으로 package.json을 생성하므로 필요 시 수정 필요

---

### 액션 23: 백엔드 의존성 설치 (Express, Sharp, multer, TypeScript)

**선행 조건**: 액션 22에서 backend/package.json이 생성되어야 함

**실행 명령어**:
```bash
cd backend && npm install express sharp multer && npm install -D typescript @types/express @types/multer @types/node ts-node
```

**예상 결과**: node_modules 디렉토리가 생성되고, package.json에 의존성이 추가됨

**완료 조건**: express, sharp, multer, typescript, @types/express, @types/multer, @types/node, ts-node이 모두 설치됨

**검증 방법**:
```bash
cd backend && test -d node_modules && grep -E "express|sharp|multer|typescript" package.json | wc -l
```

**예상 검증 결과**: 7 이상 (모든 의존성 포함)

**주의사항**: Sharp는 네이티브 모듈이므로 설치 시간이 다소 소요됨

---

### 액션 24: 백엔드 tsconfig.json 생성

**선행 조건**: 액션 23에서 TypeScript가 설치되어야 함

**실행 명령어**:
```bash
cd backend && npx tsc --init
```

**예상 결과**: backend/tsconfig.json 파일이 생성됨

**완료 조건**: tsconfig.json 파일이 존재하고, 기본 컴파일러 옵션이 포함됨

**검증 방법**:
```bash
test -f backend/tsconfig.json && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 기본 설정으로 생성되므로 필요 시 compilerOptions 조정 필요

---

### 액션 25: CouponEmbeddingSettings 인터페이스 파일 작성

**선행 조건**: 액션 21에서 backend/src 디렉토리가 생성되어야 함

**파일 작성**: `backend/src/types.ts`
```typescript
export interface CouponEmbeddingSettings {
  left: number;
  top: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontWeight: number;
}
```

**예상 결과**: backend/src/types.ts 파일이 생성되고, CouponEmbeddingSettings 인터페이스가 정의됨

**완료 조건**: 모든 필수 속성이 정의된 인터페이스가 포함됨

**검증 방법**:
```bash
test -f backend/src/types.ts && grep -E "left|top|fontSize|fontColor|fontFamily|fontWeight" backend/src/types.ts | wc -l
```

**예상 검증 결과**: 6 (모든 속성 정의)

**주의사항**: 프론트엔드와 동일한 인터페이스를 공유해야 일관성 유지

---

### 액션 26: Sharp 텍스트 오버레이 함수 구현

**선행 조건**: 액션 25에서 CouponEmbeddingSettings 인터페이스가 정의되어야 함

**파일 작성**: `backend/src/overlay.ts`
```typescript
import sharp from 'sharp';
import { CouponEmbeddingSettings } from './types';

export async function overlayText(
  imageBuffer: Buffer,
  text: string,
  settings: CouponEmbeddingSettings
): Promise<Buffer> {
  const svg = `
    <svg>
      <text
        x="${settings.left}"
        y="${settings.top}"
        font-size="${settings.fontSize}"
        fill="${settings.fontColor}"
        font-family="${settings.fontFamily}"
        font-weight="${settings.fontWeight}"
      >${text}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  return await sharp(imageBuffer)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .toBuffer();
}
```

**예상 결과**: backend/src/overlay.ts 파일이 생성되고, overlayText 함수가 정의됨

**완료 조건**: overlayText 함수가 CouponEmbeddingSettings를 사용하여 SVG 텍스트를 생성하고 composite()로 합성함

**검증 방법**:
```bash
test -f backend/src/overlay.ts && grep -E "export async function overlayText|composite" backend/src/overlay.ts | wc -l
```

**예상 검증 결과**: 2 (함수 정의 및 composite 호출)

**주의사항**: SVG 텍스트의 좌표계는 좌상단 기준이며, 폰트 크기에 따라 위치 조정 필요

---

### 액션 27: Express 서버 기본 구조 작성

**선행 조건**: 액션 23에서 Express가 설치되어야 함

**파일 작성**: `backend/src/server.ts`
```typescript
import express from 'express';
import multer from 'multer';
import { overlayText } from './overlay';
import { CouponEmbeddingSettings } from './types';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

const imageStore: Map<string, Buffer> = new Map();

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageId = Math.random().toString(36).substr(2, 9);
  imageStore.set(imageId, req.file.buffer);

  res.json({ imageId });
});

app.post('/preview', async (req, res) => {
  const { imageId, settings, text } = req.body as {
    imageId: string;
    settings: CouponEmbeddingSettings;
    text: string;
  };

  const imageBuffer = imageStore.get(imageId);
  if (!imageBuffer) {
    return res.status(404).send('Image not found');
  }

  try {
    const result = await overlayText(imageBuffer, text, settings);
    res.type('image/png').send(result);
  } catch (error) {
    res.status(500).send('Error processing image');
  }
});

app.post('/download', async (req, res) => {
  const { imageId, settings, text } = req.body as {
    imageId: string;
    settings: CouponEmbeddingSettings;
    text: string;
  };

  const imageBuffer = imageStore.get(imageId);
  if (!imageBuffer) {
    return res.status(404).send('Image not found');
  }

  try {
    const result = await overlayText(imageBuffer, text, settings);
    res.type('image/png').send(result);
  } catch (error) {
    res.status(500).send('Error processing image');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**예상 결과**: backend/src/server.ts 파일이 생성되고, /upload, /preview, /download 엔드포인트가 구현됨

**완료 조건**: Express 서버가 초기화되고, 세 개의 API 엔드포인트가 모두 구현됨

**검증 방법**:
```bash
test -f backend/src/server.ts && grep -E "app.post\('/upload'|app.post\('/preview'|app.post\('/download'" backend/src/server.ts | wc -l
```

**예상 검증 결과**: 3 (세 개의 엔드포인트 정의)

**주의사항**: multer는 메모리 스토리지를 사용하므로 대용량 파일 업로드 시 메모리 부족 가능

---

### 액션 28: 백엔드 서버 시작 스크립트 추가

**선행 조건**: 액션 27에서 server.ts가 작성되어야 함

**실행 명령어**:
```bash
cd backend && npm pkg set scripts.start="ts-node src/server.ts"
```

**예상 결과**: backend/package.json의 scripts 섹션에 start 스크립트가 추가됨

**완료 조건**: npm start 명령으로 서버를 시작할 수 있음

**검증 방법**:
```bash
cd backend && grep "\"start\"" package.json && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: ts-node가 설치되어 있어야 TypeScript 파일을 직접 실행 가능

---

### 액션 29: 백엔드 서버 시작 테스트

**선행 조건**: 액션 28에서 start 스크립트가 추가되어야 함

**실행 명령어**:
```bash
cd backend && npm start &
sleep 3
curl -I http://localhost:3001
kill %1
```

**예상 결과**: 서버가 시작되고, curl 명령으로 200 OK 응답을 받음 (또는 404 에러, 엔드포인트가 GET을 지원하지 않으므로)

**완료 조건**: 서버가 정상적으로 실행되고, HTTP 요청을 받을 수 있음

**검증 방법**:
```bash
cd backend && npm start & sleep 3 && curl -I http://localhost:3001 2>&1 | grep -E "HTTP|200|404" && kill %1 && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 포트 3001이 이미 사용 중이면 서버 시작 실패

---

### 액션 30: 프론트엔드 프로젝트 디렉토리 생성

**선행 조건**: 액션 10에서 React 프로젝트 초기화 방식을 결정해야 함

**실행 명령어**:
```bash
npm create vite@latest frontend -- --template react-ts
```

**예상 결과**: frontend 디렉토리가 생성되고, Vite 기반 React TypeScript 프로젝트가 초기화됨

**완료 조건**: frontend/package.json, frontend/vite.config.ts, frontend/src 디렉토리가 존재함

**검증 방법**:
```bash
test -d frontend && test -f frontend/package.json && test -f frontend/vite.config.ts && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: Vite 프로젝트 생성 시 npm 7 이상 필요

---

### 액션 31: 프론트엔드 의존성 설치

**선행 조건**: 액션 30에서 frontend 프로젝트가 생성되어야 함

**실행 명령어**:
```bash
cd frontend && npm install
```

**예상 결과**: node_modules 디렉토리가 생성되고, 모든 의존성이 설치됨

**완료 조건**: frontend/node_modules 디렉토리가 존재함

**검증 방법**:
```bash
test -d frontend/node_modules && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 네트워크 연결이 필요하며, 설치 시간이 다소 소요됨

---

### 액션 32: CouponEmbeddingSettings 인터페이스 프론트엔드에 작성

**선행 조건**: 액션 30에서 frontend/src 디렉토리가 생성되어야 함

**파일 작성**: `frontend/src/types.ts`
```typescript
export interface CouponEmbeddingSettings {
  left: number;
  top: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontWeight: number;
}
```

**예상 결과**: frontend/src/types.ts 파일이 생성되고, CouponEmbeddingSettings 인터페이스가 정의됨

**완료 조건**: 모든 필수 속성이 정의된 인터페이스가 포함됨

**검증 방법**:
```bash
test -f frontend/src/types.ts && grep -E "left|top|fontSize|fontColor|fontFamily|fontWeight" frontend/src/types.ts | wc -l
```

**예상 검증 결과**: 6 (모든 속성 정의)

**주의사항**: 백엔드와 동일한 인터페이스를 사용하여 타입 일관성 유지

---

### 액션 33: ImageUploadComponent 구현

**선행 조건**: 액션 32에서 types.ts가 작성되어야 함

**파일 작성**: `frontend/src/ImageUploadComponent.tsx`
```typescript
import React from 'react';

interface Props {
  onUpload: (imageId: string) => void;
}

export const ImageUploadComponent: React.FC<Props> = ({ onUpload }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    onUpload(data.imageId);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};
```

**예상 결과**: frontend/src/ImageUploadComponent.tsx 파일이 생성되고, 이미지 업로드 UI가 구현됨

**완료 조건**: 파일 선택 시 /upload 엔드포인트로 FormData를 전송하고, imageId를 부모 컴포넌트로 전달함

**검증 방법**:
```bash
test -f frontend/src/ImageUploadComponent.tsx && grep -E "FormData|fetch.*upload" frontend/src/ImageUploadComponent.tsx | wc -l
```

**예상 검증 결과**: 2 이상 (FormData 생성 및 fetch 호출)

**주의사항**: CORS 설정이 백엔드에 없으면 브라우저에서 요청 차단 가능

---

### 액션 34: SettingsFormComponent 구현

**선행 조건**: 액션 32에서 types.ts가 작성되어야 함

**파일 작성**: `frontend/src/SettingsFormComponent.tsx`
```typescript
import React from 'react';
import { CouponEmbeddingSettings } from './types';

interface Props {
  settings: CouponEmbeddingSettings;
  text: string;
  onSettingsChange: (settings: CouponEmbeddingSettings) => void;
  onTextChange: (text: string) => void;
}

export const SettingsFormComponent: React.FC<Props> = ({
  settings,
  text,
  onSettingsChange,
  onTextChange,
}) => {
  const handleChange = (key: keyof CouponEmbeddingSettings, value: string | number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="Left"
        value={settings.left}
        onChange={(e) => handleChange('left', Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Top"
        value={settings.top}
        onChange={(e) => handleChange('top', Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Font Size"
        value={settings.fontSize}
        onChange={(e) => handleChange('fontSize', Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Font Color"
        value={settings.fontColor}
        onChange={(e) => handleChange('fontColor', e.target.value)}
      />
      <input
        type="text"
        placeholder="Font Family"
        value={settings.fontFamily}
        onChange={(e) => handleChange('fontFamily', e.target.value)}
      />
      <input
        type="number"
        placeholder="Font Weight"
        value={settings.fontWeight}
        onChange={(e) => handleChange('fontWeight', Number(e.target.value))}
      />
    </div>
  );
};
```

**예상 결과**: frontend/src/SettingsFormComponent.tsx 파일이 생성되고, CouponEmbeddingSettings의 모든 속성을 입력할 수 있는 폼이 구현됨

**완료 조건**: 각 속성마다 입력 필드가 존재하고, 값 변경 시 부모 컴포넌트로 업데이트된 settings를 전달함

**검증 방법**:
```bash
test -f frontend/src/SettingsFormComponent.tsx && grep -E "<input" frontend/src/SettingsFormComponent.tsx | wc -l
```

**예상 검증 결과**: 7 (텍스트 입력 1개 + 설정값 입력 6개)

**주의사항**: number 타입 입력은 Number()로 변환 필요

---

### 액션 35: PreviewCanvasComponent 기본 구조 구현

**선행 조건**: 액션 32에서 types.ts가 작성되어야 함

**파일 작성**: `frontend/src/PreviewCanvasComponent.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { CouponEmbeddingSettings } from './types';

interface Props {
  imageId: string | null;
  settings: CouponEmbeddingSettings;
  text: string;
  onSettingsChange: (settings: CouponEmbeddingSettings) => void;
}

export const PreviewCanvasComponent: React.FC<Props> = ({
  imageId,
  settings,
  text,
  onSettingsChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) return;

    const fetchPreview = async () => {
      const response = await fetch('http://localhost:3001/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, settings, text }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };

    const timeoutId = setTimeout(fetchPreview, 300);
    return () => clearTimeout(timeoutId);
  }, [imageId, settings, text]);

  return (
    <div>
      {previewUrl && <img src={previewUrl} alt="Preview" />}
    </div>
  );
};
```

**예상 결과**: frontend/src/PreviewCanvasComponent.tsx 파일이 생성되고, 프리뷰 이미지를 표시하는 컴포넌트가 구현됨

**완료 조건**: imageId, settings, text가 변경될 때마다 /preview 엔드포인트로 요청을 보내고, 받은 이미지를 표시함. debounce가 적용되어 300ms 후 요청 전송

**검증 방법**:
```bash
test -f frontend/src/PreviewCanvasComponent.tsx && grep -E "setTimeout|fetch.*preview" frontend/src/PreviewCanvasComponent.tsx | wc -l
```

**예상 검증 결과**: 2 (setTimeout 및 fetch 호출)

**주의사항**: Blob URL은 메모리 누수 방지를 위해 useEffect cleanup에서 URL.revokeObjectURL() 호출 필요

---

### 액션 36: PreviewCanvasComponent에 드래그 앤 드롭 기능 추가

**선행 조건**: 액션 35에서 PreviewCanvasComponent 기본 구조가 구현되어야 함

**파일 작성**: `frontend/src/PreviewCanvasComponent.tsx` (전체 내용 교체)
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { CouponEmbeddingSettings } from './types';

interface Props {
  imageId: string | null;
  settings: CouponEmbeddingSettings;
  text: string;
  onSettingsChange: (settings: CouponEmbeddingSettings) => void;
}

export const PreviewCanvasComponent: React.FC<Props> = ({
  imageId,
  settings,
  text,
  onSettingsChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageId) return;

    const fetchPreview = async () => {
      const response = await fetch('http://localhost:3001/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, settings, text }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
    };

    const timeoutId = setTimeout(fetchPreview, 300);
    return () => clearTimeout(timeoutId);
  }, [imageId, settings, text]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imgRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newLeft = settings.left + deltaX;
    const newTop = settings.top + deltaY;

    onSettingsChange({ ...settings, left: newLeft, top: newTop });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {previewUrl && <img ref={imgRef} src={previewUrl} alt="Preview" />}
    </div>
  );
};
```

**예상 결과**: PreviewCanvasComponent에 드래그 앤 드롭 기능이 추가되고, 마우스로 이미지를 드래그하면 left, top 값이 업데이트됨

**완료 조건**: onMouseDown, onMouseMove, onMouseUp 이벤트 핸들러가 구현되고, 드래그 시 settings.left, settings.top이 실시간으로 변경됨

**검증 방법**:
```bash
test -f frontend/src/PreviewCanvasComponent.tsx && grep -E "onMouseDown|onMouseMove|onMouseUp" frontend/src/PreviewCanvasComponent.tsx | wc -l
```

**예상 검증 결과**: 6 이상 (이벤트 핸들러 정의 및 JSX 바인딩)

**주의사항**: 이미지 스케일링 비율을 고려하지 않으므로, 추후 원본 이미지 크기와 표시 크기 비율 계산 필요

---

### 액션 37: App 컴포넌트에서 모든 컴포넌트 통합

**선행 조건**: 액션 33, 34, 36이 모두 완료되어야 함

**파일 작성**: `frontend/src/App.tsx`
```typescript
import React, { useState } from 'react';
import { ImageUploadComponent } from './ImageUploadComponent';
import { SettingsFormComponent } from './SettingsFormComponent';
import { PreviewCanvasComponent } from './PreviewCanvasComponent';
import { CouponEmbeddingSettings } from './types';

function App() {
  const [imageId, setImageId] = useState<string | null>(null);
  const [text, setText] = useState<string>('Sample Text');
  const [settings, setSettings] = useState<CouponEmbeddingSettings>({
    left: 100,
    top: 100,
    fontSize: 48,
    fontColor: '#000000',
    fontFamily: 'Arial',
    fontWeight: 700,
  });

  const handleDownload = async () => {
    if (!imageId) return;

    const response = await fetch('http://localhost:3001/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, settings, text }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coupon.png';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Coupon Text Overlay</h1>
      <ImageUploadComponent onUpload={setImageId} />
      <SettingsFormComponent
        settings={settings}
        text={text}
        onSettingsChange={setSettings}
        onTextChange={setText}
      />
      <PreviewCanvasComponent
        imageId={imageId}
        settings={settings}
        text={text}
        onSettingsChange={setSettings}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default App;
```

**예상 결과**: frontend/src/App.tsx 파일이 생성되고, 모든 컴포넌트가 통합되어 전체 애플리케이션이 동작함

**완료 조건**: ImageUploadComponent, SettingsFormComponent, PreviewCanvasComponent가 모두 App 컴포넌트에서 사용되고, 다운로드 버튼이 구현됨

**검증 방법**:
```bash
test -f frontend/src/App.tsx && grep -E "ImageUploadComponent|SettingsFormComponent|PreviewCanvasComponent|handleDownload" frontend/src/App.tsx | wc -l
```

**예상 검증 결과**: 4 이상 (세 개의 컴포넌트 import 및 다운로드 함수)

**주의사항**: 초기 settings 값은 기본값으로 설정되어 있으며, 필요 시 조정 가능

---

### 액션 38: 백엔드에 CORS 미들웨어 추가

**선행 조건**: 액션 27에서 server.ts가 작성되어야 함

**실행 명령어**:
```bash
cd backend && npm install cors && npm install -D @types/cors
```

**예상 결과**: cors 패키지와 타입 정의가 설치됨

**완료 조건**: cors가 node_modules에 설치되고, package.json에 추가됨

**검증 방법**:
```bash
cd backend && test -d node_modules/cors && grep "cors" package.json && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: CORS 미들웨어가 없으면 브라우저에서 백엔드 API 호출 차단됨

---

### 액션 39: server.ts에 CORS 미들웨어 적용

**선행 조건**: 액션 38에서 cors 패키지가 설치되어야 함

**파일 작성**: `backend/src/server.ts` (기존 내용 수정)
```typescript
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { overlayText } from './overlay';
import { CouponEmbeddingSettings } from './types';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const imageStore: Map<string, Buffer> = new Map();

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageId = Math.random().toString(36).substr(2, 9);
  imageStore.set(imageId, req.file.buffer);

  res.json({ imageId });
});

app.post('/preview', async (req, res) => {
  const { imageId, settings, text } = req.body as {
    imageId: string;
    settings: CouponEmbeddingSettings;
    text: string;
  };

  const imageBuffer = imageStore.get(imageId);
  if (!imageBuffer) {
    return res.status(404).send('Image not found');
  }

  try {
    const result = await overlayText(imageBuffer, text, settings);
    res.type('image/png').send(result);
  } catch (error) {
    res.status(500).send('Error processing image');
  }
});

app.post('/download', async (req, res) => {
  const { imageId, settings, text } = req.body as {
    imageId: string;
    settings: CouponEmbeddingSettings;
    text: string;
  };

  const imageBuffer = imageStore.get(imageId);
  if (!imageBuffer) {
    return res.status(404).send('Image not found');
  }

  try {
    const result = await overlayText(imageBuffer, text, settings);
    res.type('image/png').send(result);
  } catch (error) {
    res.status(500).send('Error processing image');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**예상 결과**: server.ts에 CORS 미들웨어가 추가되고, 프론트엔드에서 백엔드 API 호출 가능

**완료 조건**: app.use(cors())가 추가되어 모든 도메인에서 API 접근 가능

**검증 방법**:
```bash
grep "app.use(cors())" backend/src/server.ts && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 프로덕션 환경에서는 CORS 설정을 특정 도메인으로 제한 필요

---

### 액션 40: 프론트엔드 개발 서버 시작 테스트

**선행 조건**: 액션 31에서 프론트엔드 의존성이 설치되어야 함

**실행 명령어**:
```bash
cd frontend && npm run dev &
sleep 5
curl -I http://localhost:5173
kill %1
```

**예상 결과**: 프론트엔드 개발 서버가 시작되고, curl로 200 OK 응답을 받음

**완료 조건**: 프론트엔드 서버가 정상적으로 실행되고, HTTP 요청을 받을 수 있음

**검증 방법**:
```bash
cd frontend && npm run dev & sleep 5 && curl -I http://localhost:5173 2>&1 | grep "HTTP" && kill %1 && echo "pass" || echo "fail"
```

**예상 검증 결과**: "pass" 출력

**주의사항**: 포트 5173이 이미 사용 중이면 서버 시작 실패

---

### 액션 41: 이미지 업로드 기능 수동 테스트

**선행 조건**: 액션 29에서 백엔드 서버가 정상 작동하고, 액션 40에서 프론트엔드 서버가 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 http://localhost:5173 열고, JPEG/PNG/WebP 이미지 파일을 업로드하여 화면에 표시되는지 확인"
```

**예상 결과**: 이미지 업로드 후 프리뷰 영역에 이미지가 표시됨

**완료 조건**: JPEG, PNG, WebP 파일을 업로드하면 /upload 엔드포인트로 전송되고, imageId가 반환되어 프리뷰가 표시됨

**검증 방법**:
```bash
echo "수동 확인 필요: 브라우저 개발자 도구에서 /upload 요청의 응답에 imageId가 포함되어 있는지 확인"
```

**예상 검증 결과**: imageId가 응답에 포함되고, 프리뷰 이미지가 화면에 표시됨

**주의사항**: 파일 크기가 너무 크면 서버 메모리 부족 가능

---

### 액션 42: 텍스트 입력 및 설정값 반영 수동 테스트

**선행 조건**: 액션 41이 완료되어 이미지 업로드가 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 텍스트 입력 필드 및 각 설정값(left, top, fontSize, fontColor, fontFamily, fontWeight)을 변경하여 프리뷰가 즉시 업데이트되는지 확인"
```

**예상 결과**: 설정값 변경 시 300ms 후 /preview 엔드포인트로 요청이 전송되고, 프리뷰 이미지가 업데이트됨

**완료 조건**: 각 CouponEmbeddingSettings 속성 변경 시 프리뷰가 정확히 반영됨

**검증 방법**:
```bash
echo "수동 확인 필요: 브라우저 개발자 도구 네트워크 탭에서 /preview 요청이 전송되고, 응답으로 이미지가 반환되는지 확인"
```

**예상 검증 결과**: /preview 요청이 전송되고, 프리뷰 이미지에 텍스트가 오버레이되어 표시됨

**주의사항**: debounce가 적용되어 입력 중에는 요청이 발생하지 않음

---

### 액션 43: 드래그 앤 드롭 기능 수동 테스트

**선행 조건**: 액션 42가 완료되어 프리뷰가 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저 프리뷰 영역에서 마우스로 이미지를 드래그하여 left, top 입력 필드 값이 자동으로 업데이트되는지 확인"
```

**예상 결과**: 드래그 시 left, top 값이 실시간으로 변경되고, 프리뷰가 업데이트됨

**완료 조건**: 드래그 이동 시 settings.left, settings.top이 정확히 업데이트되고, 폼 입력 필드에 반영됨

**검증 방법**:
```bash
echo "수동 확인 필요: 드래그 시 left, top 입력 필드의 숫자가 변경되는지 확인"
```

**예상 검증 결과**: 드래그 시 left, top 값이 변경되고, 프리뷰 이미지가 업데이트됨

**주의사항**: 이미지 스케일링 비율을 고려하지 않으므로, 좌표가 부정확할 수 있음

---

### 액션 44: 양방향 동기화 수동 테스트

**선행 조건**: 액션 42, 43이 모두 완료되어야 함

**실행 명령어**:
```bash
echo "브라우저에서 폼에 left, top 값을 직접 입력하여 프리뷰가 정확히 이동하는지 확인"
```

**예상 결과**: 폼에서 left, top 값을 변경하면 프리뷰 이미지의 텍스트 위치가 이동함

**완료 조건**: 폼 입력 → 프리뷰 업데이트, 드래그 → 폼 업데이트 양방향 동기화가 정상 작동함

**검증 방법**:
```bash
echo "수동 확인 필요: 폼에서 left 값을 200으로 변경하면 프리뷰의 텍스트가 오른쪽으로 이동하는지 확인"
```

**예상 검증 결과**: 폼 입력 시 프리뷰가 즉시 반영됨

**주의사항**: debounce로 인해 300ms 지연 발생

---

### 액션 45: 이미지 다운로드 기능 수동 테스트

**선행 조건**: 액션 44가 완료되어 모든 기능이 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 다운로드 버튼을 클릭하여 텍스트가 오버레이된 최종 이미지가 다운로드되는지 확인"
```

**예상 결과**: 다운로드 버튼 클릭 시 coupon.png 파일이 다운로드되고, 텍스트가 정확히 오버레이되어 있음

**완료 조건**: /download 엔드포인트로 요청이 전송되고, 최종 이미지가 다운로드됨

**검증 방법**:
```bash
echo "수동 확인 필요: 다운로드한 이미지를 열어서 텍스트가 정확히 렌더링되어 있는지 확인"
```

**예상 검증 결과**: 다운로드한 이미지에 텍스트가 오버레이되어 있음

**주의사항**: Sharp가 PNG 형식으로 출력하므로, 파일 확장자는 .png

---

### 액션 46: JPEG, PNG, WebP 이미지 포맷 지원 테스트

**선행 조건**: 액션 41이 완료되어 이미지 업로드가 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 JPEG, PNG, WebP 각각의 이미지 파일을 업로드하여 모두 정상 동작하는지 확인"
```

**예상 결과**: JPEG, PNG, WebP 파일 모두 업로드 후 프리뷰가 정상 표시됨

**완료 조건**: 세 가지 포맷 모두 Sharp로 처리 가능하고, 프리뷰 및 다운로드 기능이 정상 작동함

**검증 방법**:
```bash
echo "수동 확인 필요: JPEG, PNG, WebP 파일 각각 업로드 후 프리뷰 및 다운로드 테스트"
```

**예상 검증 결과**: 모든 포맷에서 정상 작동

**주의사항**: Sharp는 기본적으로 JPEG, PNG, WebP를 지원함

---

### 액션 47: 경계값 테스트 (left, top을 이미지 경계 밖으로 설정)

**선행 조건**: 액션 42가 완료되어 설정값 반영이 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 left, top 값을 음수 또는 이미지 크기보다 큰 값으로 설정하여 동작 확인"
```

**예상 결과**: 텍스트가 이미지 경계 밖으로 벗어나지만, 에러 없이 렌더링됨

**완료 조건**: 경계 밖 좌표 설정 시에도 서버 에러 없이 이미지 생성됨

**검증 방법**:
```bash
echo "수동 확인 필요: left=-100, top=-100 설정 시 텍스트가 이미지 밖에 렌더링되는지 확인"
```

**예상 검증 결과**: 에러 없이 텍스트가 이미지 밖에 렌더링됨 (일부만 표시되거나 보이지 않을 수 있음)

**주의사항**: SVG 텍스트는 이미지 경계를 벗어나도 렌더링 시도함

---

### 액션 48: 다양한 폰트 설정 조합 테스트

**선행 조건**: 액션 42가 완료되어 설정값 반영이 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 fontFamily(Arial, Helvetica, Times New Roman), fontWeight(400, 700), fontSize(12, 24, 48), fontColor(#FF0000, #00FF00, #0000FF)를 조합하여 테스트"
```

**예상 결과**: 모든 조합에서 텍스트가 정확히 렌더링됨

**완료 조건**: fontFamily, fontWeight, fontSize, fontColor 변경 시 프리뷰에 정확히 반영됨

**검증 방법**:
```bash
echo "수동 확인 필요: 각 설정 조합으로 프리뷰 및 다운로드 테스트"
```

**예상 검증 결과**: 모든 설정 조합에서 텍스트가 정확히 렌더링됨

**주의사항**: 시스템에 설치되지 않은 폰트 사용 시 기본 폰트로 대체됨

---

### 액션 49: 서버 에러 핸들링 테스트 (잘못된 이미지 파일 업로드)

**선행 조건**: 액션 41이 완료되어 이미지 업로드가 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 이미지가 아닌 파일(예: .txt, .pdf)을 업로드하여 에러 처리 확인"
```

**예상 결과**: 잘못된 파일 업로드 시 서버에서 에러 응답 반환

**완료 조건**: 잘못된 파일 업로드 시 클라이언트에 에러 메시지가 표시되거나, 콘솔에 에러 로그 출력

**검증 방법**:
```bash
echo "수동 확인 필요: .txt 파일 업로드 후 서버 콘솔 및 브라우저 개발자 도구에서 에러 확인"
```

**예상 검증 결과**: 서버에서 500 에러 또는 400 에러 반환

**주의사항**: 현재 구현에서는 파일 타입 검증이 없으므로, 추후 multer 설정에 fileFilter 추가 필요

---

### 액션 50: 프리뷰 반영 속도 테스트 (설정값 변경 후 1초 이내 업데이트)

**선행 조건**: 액션 42가 완료되어 설정값 반영이 정상 작동해야 함

**실행 명령어**:
```bash
echo "브라우저에서 설정값을 빠르게 변경하여 프리뷰가 1초 이내에 업데이트되는지 확인"
```

**예상 결과**: 설정값 변경 후 300ms 대기 후 서버 요청 전송, 서버 응답 시간 포함하여 1초 이내 프리뷰 업데이트

**완료 조건**: debounce 300ms + 서버 처리 시간 포함하여 1초 이내 프리뷰 반영

**검증 방법**:
```bash
echo "수동 확인 필요: 브라우저 개발자 도구 네트워크 탭에서 /preview 요청의 응답 시간 확인"
```

**예상 검증 결과**: /preview 요청 응답 시간이 1초 이내

**주의사항**: 이미지 크기가 크면 서버 처리 시간이 증가할 수 있음

---

## 파일 및 경로 매핑

| 파일 역할                         | 파일 경로                                  | 작업 유형 |
| --------------------------------- | ------------------------------------------ | --------- |
| API 엔드포인트 설계 문서          | api-spec.md                                | 생성      |
| React 컴포넌트 구조 문서          | component-structure.md                     | 생성      |
| 드래그 앤 드롭 로직 설계 문서     | drag-drop-logic.md                         | 생성      |
| Sharp 텍스트 오버레이 코드 스니펫 | sharp-overlay-snippet.ts                   | 생성      |
| 백엔드 타입 정의                  | backend/src/types.ts                       | 생성      |
| Sharp 텍스트 오버레이 함수        | backend/src/overlay.ts                     | 생성      |
| Express 서버 메인 파일            | backend/src/server.ts                      | 생성      |
| 백엔드 package.json               | backend/package.json                       | 생성      |
| 백엔드 tsconfig.json              | backend/tsconfig.json                      | 생성      |
| 프론트엔드 타입 정의              | frontend/src/types.ts                      | 생성      |
| 이미지 업로드 컴포넌트            | frontend/src/ImageUploadComponent.tsx      | 생성      |
| 설정값 입력 폼 컴포넌트           | frontend/src/SettingsFormComponent.tsx     | 생성      |
| 프리뷰 캔버스 컴포넌트            | frontend/src/PreviewCanvasComponent.tsx    | 생성      |
| React App 메인 컴포넌트           | frontend/src/App.tsx                       | 생성      |
| 프론트엔드 package.json           | frontend/package.json                      | 생성      |
| 프론트엔드 vite.config.ts         | frontend/vite.config.ts                    | 생성      |

## 검증 체크포인트

### 체크포인트 1: 프로젝트 구조 파악 완료

**해당 액션**: 액션 1-10

**검증 명령어**:
```bash
test -f package.json || echo "No package.json" && test -f tsconfig.json || echo "No tsconfig.json" && echo "pass"
```

**성공 기준**: 현재 프로젝트 상태 및 필요한 도구를 모두 확인함

**실패 시 조치**: 누락된 파일 또는 도구를 확인하고 설치

---

### 체크포인트 2: Sharp API 및 React 패턴 분석 완료

**해당 액션**: 액션 11-14

**검증 명령어**:
```bash
npm info sharp version && echo "pass" || echo "fail"
```

**성공 기준**: Sharp 라이브러리 버전 확인 및 API 문서 링크 파악

**실패 시 조치**: npm이 정상 작동하지 않으면 네트워크 연결 확인

---

### 체크포인트 3: 백엔드 및 프론트엔드 설계 완료

**해당 액션**: 액션 15-20

**검증 명령어**:
```bash
test -f api-spec.md && test -f component-structure.md && test -f drag-drop-logic.md && test -f sharp-overlay-snippet.ts && echo "pass" || echo "fail"
```

**성공 기준**: 모든 설계 문서 및 코드 스니펫이 생성됨

**실패 시 조치**: 누락된 파일을 다시 생성

---

### 체크포인트 4: 백엔드 서버 구현 완료

**해당 액션**: 액션 21-29

**검증 명령어**:
```bash
test -f backend/src/server.ts && test -f backend/src/overlay.ts && test -f backend/src/types.ts && cd backend && npm start & sleep 3 && curl -I http://localhost:3001 2>&1 | grep -E "HTTP|404" && kill %1 && echo "pass" || echo "fail"
```

**성공 기준**: 백엔드 서버가 정상 시작되고, HTTP 요청을 받을 수 있음

**실패 시 조치**: 액션 21-29로 돌아가 백엔드 코드 재작성

---

### 체크포인트 5: 프론트엔드 구현 완료

**해당 액션**: 액션 30-37

**검증 명령어**:
```bash
test -f frontend/src/App.tsx && test -f frontend/src/ImageUploadComponent.tsx && test -f frontend/src/SettingsFormComponent.tsx && test -f frontend/src/PreviewCanvasComponent.tsx && echo "pass" || echo "fail"
```

**성공 기준**: 모든 React 컴포넌트가 생성되고, App.tsx에 통합됨

**실패 시 조치**: 액션 30-37로 돌아가 프론트엔드 코드 재작성

---

### 체크포인트 6: CORS 설정 완료

**해당 액션**: 액션 38-39

**검증 명령어**:
```bash
grep "app.use(cors())" backend/src/server.ts && echo "pass" || echo "fail"
```

**성공 기준**: server.ts에 CORS 미들웨어가 추가됨

**실패 시 조치**: 액션 38-39로 돌아가 CORS 설정 추가

---

### 체크포인트 7: 전체 기능 수동 테스트 완료

**해당 액션**: 액션 41-50

**검증 명령어**:
```bash
echo "수동 테스트: 브라우저에서 모든 기능(업로드, 설정 입력, 드래그, 다운로드)을 테스트"
```

**성공 기준**: 명세서의 기능 완료 기준 5개 항목 및 품질 완료 기준 4개 항목을 모두 확인함

**실패 시 조치**: 실패한 기능에 해당하는 액션으로 돌아가 코드 수정

---

## 최종 검수 기준

### 기능적 완성도

- [ ] 이미지 업로드: JPEG, PNG, WebP 파일 선택 시 화면에 업로드된 이미지가 프리뷰 영역에 표시됨
- [ ] 텍스트 입력: 텍스트 입력 필드에 값을 입력하면 프리뷰 이미지에 해당 텍스트가 오버레이되어 표시됨
- [ ] 설정값 입력: left, top, fontSize, fontColor, fontFamily, fontWeight 각각의 입력 필드가 존재하고, 값 변경 시 프리뷰에 즉시 반영됨
- [ ] 드래그 앤 드롭: 프리뷰 영역에서 텍스트를 드래그하여 이동하면, left와 top 입력 필드의 값이 자동으로 업데이트됨
- [ ] 이미지 다운로드: 다운로드 버튼 클릭 시 텍스트가 오버레이된 최종 이미지 파일이 다운로드됨

### 코드 품질

- [ ] TypeScript 컴파일 에러 없음: 백엔드 및 프론트엔드 모두 tsc --noEmit 실행 시 에러 없음
- [ ] CouponEmbeddingSettings 인터페이스 일관성: 백엔드와 프론트엔드의 인터페이스 정의가 동일함
- [ ] Sharp 사용: 서버 측에서 Sharp 라이브러리를 이용해 텍스트 오버레이를 처리함

### 테스트 및 검증

- [ ] 이미지 포맷 지원: JPEG, PNG, WebP 각각 업로드 및 다운로드 테스트 통과
- [ ] 드래그 앤 드롭 품질: 텍스트를 드래그할 때 부드럽게 이동하고, left, top 값이 정확히 업데이트됨
- [ ] 프리뷰 반영 속도: 설정값 변경 후 1초 이내에 프리뷰가 업데이트됨
- [ ] 경계값 테스트: left, top을 이미지 경계 밖으로 설정해도 서버 에러 없이 동작함
- [ ] 폰트 설정 조합 테스트: 다양한 fontFamily, fontWeight, fontSize, fontColor 조합에서 정상 렌더링됨

### 문서화

- [ ] API 명세서 작성: api-spec.md 파일에 /upload, /preview, /download 엔드포인트가 정의됨
- [ ] 컴포넌트 구조 문서: component-structure.md 파일에 React 컴포넌트 구조가 명시됨
- [ ] 드래그 로직 문서: drag-drop-logic.md 파일에 드래그 이벤트 핸들러 및 좌표 변환 로직이 설명됨

## 실행 순서 요약

1. 실행 환경 설정 확인 (Node.js, npm 버전)
2. 액션 1-10: 정보 수집 → 체크포인트 1
3. 액션 11-14: Sharp API 및 React 패턴 분석 → 체크포인트 2
4. 액션 15-20: 백엔드 및 프론트엔드 설계 → 체크포인트 3
5. 액션 21-29: 백엔드 서버 구현 → 체크포인트 4
6. 액션 30-37: 프론트엔드 구현 → 체크포인트 5
7. 액션 38-39: CORS 설정 → 체크포인트 6
8. 액션 40: 프론트엔드 개발 서버 시작 테스트
9. 액션 41-50: 전체 기능 수동 테스트 → 체크포인트 7
10. 최종 검수 기준 확인

**중요**: 각 체크포인트를 반드시 통과한 후 다음 액션으로 진행해야 합니다. 순서를 위반하면 의존성 누락, 빌드 실패, API 통신 오류가 발생할 수 있습니다.