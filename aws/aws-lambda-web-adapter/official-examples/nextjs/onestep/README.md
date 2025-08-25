# Next.js on AWS Lambda 예제

이 예제는 AWS Lambda 환경에서 Next.js 앱을 실행하는 방법을 보여줍니다. [aws-lambda-web-adapter](https://github.com/awslabs/aws-lambda-web-adapter)를 사용해 서버리스 환경에 Next.js를 배포할 수 있습니다.

구성: AWS CloudFront - API Gateway - Lambda (aws-lambda-web-adapter)

## 준비사항

- Docker (로컬 빌드 및 SAM CLI 실행용)
- Node.js (Next.js 앱 빌드 및 실행용)
- AWS SAM CLI ([설치 가이드](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html))
- AWS CLI ([설치 가이드](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- make (GNU Make, 자동화 명령어 실행용)
- AWS 계정 및 자격 증명 (IAM 사용자/역할, 액세스 키 등)

모든 CLI 도구는 PATH에 등록되어 있어야 하며, AWS CLI로 자격 증명이 정상적으로 설정되어 있어야 합니다.

※ 본 예제는 macOS 환경에서 테스트되었습니다.

## 주요 명령어 및 사용법

### 1. 로컬 개발/테스트

```bash
make local # SAM 로컬 실행 (sam local start-api)

# localhost:3000 접속해서 확인
```

### 2. 도메인 및 인증서 준비 (CloudFront)

CloudFront에서 커스텀 도메인을 사용하려면 아래 절차를 따릅니다.

1. 도메인 준비: 사용할 도메인을 미리 준비하고, Route 53에 등록(선택)
2. ACM 인증서 발급: [AWS Certificate Manager(ACM)](https://console.aws.amazon.com/acm/home?region=us-east-1#/certificates)에서 인증서 발급 (CloudFront는 반드시 N. Virginia(us-east-1) 리전 필요)
3. 도메인 소유권 검증: DNS 또는 이메일로 검증
4. CloudFront에 인증서 연결: 배포 시 인증서 연결

발급받은 인증서의 ARN과 도메인 정보는 `.env` 파일에 추가해야 하며, 예시는 `.example.env` 참고

---

### 3. AWS Lambda 배포

AWS CLI/SAM CLI 필요

```bash
make deploy-init
# .env 파일을 열어 값 수정
# samconfig.toml 파일 수정

make deploy
```

## 주요 파일 설명

- template.yaml : Lambda + API Gateway 배포를 위한 SAM 템플릿
- samconfig.toml : SAM CLI 설정 파일
- app/Dockerfile : Next.js를 Lambda 환경에 맞게 빌드하는 Dockerfile
- Makefile : 빌드/배포/로컬 실행 등 자동화 명령어
- .env : 환경 변수 파일 (API 키 등 민감 정보는 git에 포함 X)

## 참고 사항

- Next.js 15 (app router 기반) 예제
- aws-lambda-web-adapter로 Lambda에서 Next.js 서버 실행
- SAM 빌드 산출물은 `.aws-sam/`에 생성
- 배포 전 AWS 자격 증명 및 리전 설정 확인
- CloudFront 리소스는 생성/삭제에 시간이 오래 걸릴 수 있음 (십수 분 소요될 수 있음)

## 참고 링크

- https://github.com/awslabs/aws-lambda-web-adapter
- https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/
- https://nextjs.org/docs
