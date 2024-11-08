ARG BASE_IMAGE=ubuntu:24.04

ARG FFMPEG_VERSION=7.1
FROM mwader/static-ffmpeg:${FFMPEG_VERSION} AS ffmpeg-source

FROM ${BASE_IMAGE} AS opencv

# https://techoverflow.net/2019/05/18/how-to-fix-configuring-tzdata-interactive-input-when-building-docker-images/
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Seoul

RUN apt-get -qq update \
    && apt-get install -y \
    software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa \
    && apt-get -qq update

ARG PYTHON_VERSION=3.12

RUN apt-get install -y \
    python${PYTHON_VERSION} \
    python${PYTHON_VERSION}-venv \
    python${PYTHON_VERSION}-full

WORKDIR /app
RUN python${PYTHON_VERSION} -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# FFMPEG 설치
COPY --from=ffmpeg-source /ffmpeg /usr/local/bin/

# OpenCV 설치
ARG OPENCV_VERSION=4.10.0.84

RUN pip3 install opencv-python==${OPENCV_VERSION}
RUN pip3 install opencv-contrib-python==${OPENCV_VERSION}
# https://stackoverflow.com/questions/55313610/importerror-libgl-so-1-cannot-open-shared-object-file-no-such-file-or-directo
RUN pip3 install opencv-python-headless==${OPENCV_VERSION}

RUN rm -rf /var/lib/apt/lists/*