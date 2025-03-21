#!/bin/bash

# 1. clone opencv repository
echo "Cloning OpenCV repository..."
git clone -b 4.11.0 git@github.com:opencv/opencv.git source

# 2. custom config를 source에 복사
echo "Copying custom config..."
cp opencv_js_custom.config.py source/platforms/js/opencv_js_custom.config.py

# 3. custom config를 사용하여 OpenCV.js를 빌드
echo "Building OpenCV.js..."
(
  cd source && \
  docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk:4.0.5-arm64 \
    emcmake python3 ./platforms/js/build_js.py build_js \
    --config ./platforms/js/opencv_js_custom.config.py \
    --build_flags="-sWASM_ASYNC_COMPILATION=0 "
)

# 4. dist 폴더에 빌드 결과물 복사
echo "Copying OpenCV.js to dist..."
mkdir -p dist
cp source/build_js/bin/opencv.js dist/opencv.js

# 5. esm 적용 patch
echo "Applying ESM patch..."
patch -i opencv.js.patch dist/opencv.js
