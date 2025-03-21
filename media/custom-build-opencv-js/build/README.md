# 커스텀 OpenCV.js 빌드

## 작성환경

- OS: MacOS
- CPU: M1 Pro
- OpenCV Version: 4.11.0

## 적용 옵션

- SIFT를 포함한 custom config
  - `opencv_js_custom.config.py` 적용
- 결과물에 Promise 제거
  - `--build_flags="-sWASM_ASYNC_COMPILATION=0 "` 옵션 적용
- ESM 형식 적용
  - `opencv.js.patch` 적용
