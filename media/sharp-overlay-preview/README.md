# Sharp Overlay Preview

이미지에 텍스트를 오버레이하고 실시간으로 미리보기할 수 있는 웹 애플리케이션입니다.

## 기능

- 이미지 업로드 (JPEG, PNG, WebP 지원)
- 텍스트 입력 및 스타일 설정 (위치, 폰트, 크기, 색상 등)
- 드래그 앤 드롭으로 텍스트 위치 조정
- 실시간 프리뷰
- 최종 이미지 다운로드

## 기술 스택

- **백엔드**: Node.js, Express, Sharp, TypeScript
- **프론트엔드**: React, TypeScript, Vite

## 실행 방법

### Docker Compose 사용 (권장)

Docker Compose를 사용하여 백엔드와 프론트엔드를 한 번에 실행할 수 있습니다.

#### 1. Docker 이미지 빌드 및 컨테이너 시작

```bash
make build  # Docker 이미지 빌드
make up     # 컨테이너 시작
```

또는 Docker Compose 명령어를 직접 사용:

```bash
docker compose build
docker compose up -d
```

#### 2. 애플리케이션 접속

- 프론트엔드: `http://localhost:5173`
- 백엔드: `http://localhost:3001`

#### 3. 로그 확인

```bash
make logs  # 전체 로그 확인
```

#### 4. 컨테이너 중지

```bash
make down  # 컨테이너 중지 및 제거
```

#### 5. 기타 유용한 명령어

```bash
make help     # 사용 가능한 명령어 목록 보기
make restart  # 컨테이너 재시작
make clean    # 컨테이너, 이미지, 볼륨 모두 제거
```

### 로컬 개발 환경 (수동 실행)

#### 1. 백엔드 서버 시작

```bash
cd backend
npm install  # 최초 1회만 실행
npm start
```

서버는 `http://localhost:3001`에서 실행됩니다.

#### 2. 프론트엔드 개발 서버 시작

```bash
cd frontend
npm install  # 최초 1회만 실행
npm run dev
```

브라우저에서 `http://localhost:5173`에 접속합니다.

## 사용법

1. **이미지 업로드**: 파일 선택 버튼을 클릭하여 이미지를 업로드합니다.
2. **텍스트 설정**: 텍스트 입력 및 위치(left, top), 폰트 크기, 색상, 폰트 패밀리, 폰트 굵기를 설정합니다.
3. **위치 조정**: 프리뷰 영역에서 이미지를 드래그하여 텍스트 위치를 조정할 수 있습니다.
4. **다운로드**: 다운로드 버튼을 클릭하여 최종 이미지를 저장합니다.

## API 엔드포인트

- `POST /upload`: 이미지 업로드
- `POST /preview`: 프리뷰 이미지 생성
- `POST /download`: 최종 이미지 다운로드
