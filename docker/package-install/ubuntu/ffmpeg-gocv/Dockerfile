ARG BASE_IMAGE=ubuntu:24.04

ARG FFMPEG_VERSION=7.1
FROM mwader/static-ffmpeg:${FFMPEG_VERSION} AS ffmpeg-source

FROM ${BASE_IMAGE} AS gocv

# https://techoverflow.net/2019/05/18/how-to-fix-configuring-tzdata-interactive-input-when-building-docker-images/
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Seoul

RUN apt-get -qq update \
    && apt-get install -y \
    software-properties-common
RUN add-apt-repository ppa:longsleep/golang-backports \
    && apt-get -qq update

ARG GO_VERSION=1.23

RUN apt-get install -y \
    golang-${GO_VERSION}-go

# Go 환경 설정
ENV GOROOT=/usr/lib/go-${GO_VERSION}
ENV GOPATH=/go
ENV PATH=$PATH:$GOROOT/bin:$GOPATH/bin

# Go 작업 디렉토리 생성
RUN mkdir -p $GOPATH/src $GOPATH/bin $GOPATH/pkg

# 일반적인 위치에 심볼릭 링크 생성
RUN ln -s /usr/lib/go-${GO_VERSION} /usr/local/go

# FFMPEG 설치
COPY --from=ffmpeg-source /ffmpeg /usr/local/bin/

# GoCV 설치
RUN apt-get install -y \
    sudo \
    git \
    make

ARG GOCV_VERSION=0.39.0
ARG GOCV_MAKE_TARGET=install
# https://github.com/hybridgroup/gocv/issues/1144
WORKDIR /go/temp
RUN git clone https://github.com/hybridgroup/gocv.git && \
    cd gocv && \
    git checkout v${GOCV_VERSION} && \
    awk '{gsub(/libtbb2/, "libtbbmalloc2"); gsub(/libdc1394-22-dev/, "libdc1394-dev"); print}' Makefile > Makefile.tmp && \
    mv Makefile.tmp Makefile && \
    make ${GOCV_MAKE_TARGET} && \
    cd .. && \
    rm -rf gocv

RUN rm -rf /var/lib/apt/lists/*