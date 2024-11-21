# GRPC 통신 PoC

Go, Python, Java로 구현된 간단한 GRPC 통신 PoC

각 언어 별 Client와 Server를 준비하였으며, Server는 Web Server와 GRPC 서버가 동시에 구동되는 방식으로 구현 되었음

## 요구 사항

### 공통 요구 사항

- [Make](https://www.gnu.org/software/make/)
    - Mac은 기본적으로 설치되어 있음
    - Make를 사용하지 않는다면, 각 폴더의 Makefile 내 명령어를 직접 실행

### go

- [GRPC Quick Start 참고](https://grpc.io/docs/languages/go/quickstart/#prerequisites)

### python

- Python 3.12+
- [Poetry](https://python-poetry.org/)

### java

- JDK 21+

## 각 폴더 설명

- `modules/go`: Go 언어로 구현된 GRPC 통신 PoC
- `modules/java`: Java 언어로 구현된 GRPC 통신 PoC
- `modules/proto`: GRPC 통신을 위한 proto 파일
- `modules/python`: Python 언어로 구현된 GRPC 통신 PoC

## 실행 방법

각 폴더에 있는 Makefile을 통해 실행하며 Makefile 내 명령어는 아래와 같음

- `protoc`: proto 파일을 기반으로 protobuf 파일을 생성
- `server`: Server를 실행
- `request-go-server`: Go GRPC Server에 요청
- `request-java-server`: Java GRPC Server에 요청
- `request-python-server`: Python GRPC Server에 요청
