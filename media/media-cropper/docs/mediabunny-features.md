# MediaBunny 라이브러리 기능 문서

## 개요

MediaBunny는 브라우저에서 MP4, WebM 등 미디어 파일을 읽고 쓰고 변환하기 위한 zero-dependency 고성능 JavaScript 라이브러리입니다. WebCodecs API를 활용하여 클라이언트 사이드에서 고성능 비디오 처리를 가능하게 합니다.

## 핵심 기능

### 1. 코덱 지원 확인 기능

#### 주요 API
- **`getEncodableCodecs()`**: 브라우저에서 인코딩 가능한 모든 코덱 목록 반환
- **`getEncodableVideoCodecs()`**: 비디오 코덱 목록 반환
- **`getEncodableAudioCodecs()`**: 오디오 코덱 목록 반환
- **`getFirstEncodableVideoCodec()`**: 지원되는 첫 번째 비디오 코덱 반환
- **`canEncode(codec)`**: 특정 코덱 인코딩 가능 여부 확인
- **`canEncodeVideo(config)`**: 특정 비디오 코덱과 설정으로 인코딩 가능 여부 확인

#### 활용 시나리오
- 브라우저 호환성 확인
- 최적 코덱 자동 선택
- 사용자에게 지원 가능한 포맷 안내

### 2. 고급 비디오 처리 기능

#### 비디오 프레임 처리
- **`VideoSampleSink`**: 디코딩된 비디오 샘플(프레임) 추출
- **`EncodedPacketSink`**: 인코딩된 비디오 패킷 처리
- **`VideoFrameDrain`**: 비디오 프레임 반복 처리

#### 미디어 변환
- **`Conversion.init()`**: 미디어 파일 변환 (크기 조정, 회전, 크롭, 코덱 변환)
- **트랙 관리**: 비디오/오디오 트랙별 개별 설정 및 처리

### 3. 출력 포맷 지원

#### 컨테이너 포맷
- **`Mp4OutputFormat`**: MP4 컨테이너 지원
- **`MovOutputFormat`**: MOV 컨테이너 지원
- **`WebMOutputFormat`**: WebM 컨테이너 지원

#### 포맷별 코덱 확인
- **`getSupportedVideoCodecs(format)`**: 포맷별 지원 비디오 코덱 확인
- **`getSupportedAudioCodecs(format)`**: 포맷별 지원 오디오 코덱 확인

### 4. WebCodecs API 연동

#### 변환 기능
- **`VideoSample.toVideoFrame()`**: MediaBunny 샘플을 WebCodecs VideoFrame으로 변환
- **`EncodedPacket.toEncodedVideoChunk()`**: MediaBunny 패킷을 WebCodecs 청크로 변환

#### 확장성
- **Custom Decoder/Encoder Interface**: 맞춤형 디코더/인코더 구현 지원
- **Plugin Architecture**: 기능 확장을 위한 플러그인 시스템

## 기술적 특징

### 성능
- Zero 의존성으로 번들 사이즈 최소화
- WebCodecs API 활용으로 하드웨어 가속 지원
- 비동기 처리로 UI 블로킹 방지

### 호환성
- 최신 브라우저 (Chrome 94+, Edge 94+, Firefox 133+)
- WebCodecs API 지원 환경
- Progressive Enhancement 패턴 지원

### 사용 편의성
- 직관적인 API 설계
- 풍부한 예제 코드 (328개 이상)
- TypeScript 타입 지원

## 브라우저 지원 현황

| 기능 | Chrome | Edge | Firefox | Safari |
|------|--------|------|---------|--------|
| 코덱 확인 | ✅ 94+ | ✅ 94+ | ✅ 133+ | ❌ |
| 비디오 변환 | ✅ 94+ | ✅ 94+ | ✅ 133+ | ❌ |
| WebCodecs 연동 | ✅ 94+ | ✅ 94+ | ✅ 133+ | ❌ |

## 참고 자료

- [공식 문서](https://github.com/vanilagy/mediabunny)
- [API 레퍼런스](https://vanilagy.github.io/mediabunny/)
- [WebCodecs API 명세](https://wicg.github.io/web-codecs/)