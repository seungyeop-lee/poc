FROM ubuntu:24.04

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

RUN rm -rf /var/lib/apt/lists/*