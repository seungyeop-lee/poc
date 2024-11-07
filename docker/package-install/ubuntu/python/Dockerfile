FROM ubuntu:24.04

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

# poetry 설치
RUN pip install -U pip setuptools
RUN pip install poetry

RUN rm -rf /var/lib/apt/lists/*