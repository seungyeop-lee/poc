FROM ubuntu:24.04

# https://techoverflow.net/2019/05/18/how-to-fix-configuring-tzdata-interactive-input-when-building-docker-images/
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Seoul

ARG JAVA_VERSION=21

RUN apt-get -qq update \
    && apt-get install -y \
      openjdk-${JAVA_VERSION}-jdk

RUN rm -rf /var/lib/apt/lists/*