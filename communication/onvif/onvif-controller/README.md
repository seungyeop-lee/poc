# onvif controller

간단한 onvif controller

## 요구 사항

- Go 1.23.3+ SDK

## 실행법

```bash
# 1. config.example.yml에 ONVIF 카메라 정보를 입력

# 2. help를 통해 어떤 명령어를 실행 할 건지 확인
go run cmd/cmd.go -h

# 3. 명령어 실행
go run cmd/cmd.go -c config.example.yml [command]
```
