# Next.js + CloudFront + API Gateway 통합 배포

CloudFormation 네이티브 방식으로 CloudFront와 SAM을 분리해서 배포하는 예제입니다.

- **CloudFront**: 별도 CloudFormation 스택으로 먼저 생성
- **SAM**: API Gateway + Lambda 배포 후 CloudFront origin 업데이트  
- **네이티브**: Python Custom Resource 없이 순수 CloudFormation만 사용

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 초기 설정 파일 생성
make deploy-init

# .env 파일에서 인증서 ARN과 도메인 수정
# AcmCertificateArnParameter=arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id
# CustomDomainName=your-domain.com

# samconfig.toml 파일에서 관련 설정 수정
```

### 2. 배포

```bash
# 전체 배포 (CloudFront → SAM → CloudFront 업데이트)
make deploy
```

### 3. 확인

- CloudFront URL: https://your-domain.com
- API Gateway URL: AWS 콘솔에서 확인

### 4. 정리

```bash
# 모든 리소스 삭제
make cleanup
```

## 📁 프로젝트 구조

```
├── Makefile                 # 🚀 빌드/배포/정리 명령어
├── template.yaml            # 📝 SAM 템플릿 (API Gateway + Lambda)
├── .env                     # 🔧 환경 변수 (인증서 ARN, 도메인 등)
├── app/                     # 📱 Next.js 애플리케이션
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── infrastructure/
    └── cloudfront.yaml      # 🌐 CloudFront CloudFormation 템플릿
```

## 🔧 배포 과정

`make deploy` 명령어는 다음 순서로 실행됩니다:

1. **SAM 빌드** (sam build)
2. **CloudFront 스택 배포** (placeholder origin: example.com)
3. **SAM 애플리케이션 배포** (API Gateway + Lambda)
4. **API Gateway 도메인 확인**
5. **CloudFront origin 업데이트** (실제 API Gateway 도메인으로)

## 🛠️ 사용 가능한 명령어

```bash
make deploy-init    # 초기 설정 파일 생성
make local          # 로컬 개발 서버 실행
make deploy         # CloudFront + SAM 통합 배포
make cleanup        # 모든 스택 삭제
make build          # SAM 빌드만 실행
make help           # 도움말 표시
```

## 🔑 ACM 인증서 준비

1. [AWS Certificate Manager](https://console.aws.amazon.com/acm/home?region=us-east-1)에서 인증서 발급 (**us-east-1 리전 필수**)
2. 도메인 검증 완료
3. 인증서 ARN을 `.env` 파일에 설정

⚠️ **중요 주의사항**: CloudFront 스택 생성 전에 **해당 도메인이 DNS에 연결되어 있지 않아야** 합니다. CloudFront 도메인 검증 과정에서 충돌이 발생할 수 있습니다.

## 🔗 DNS 설정 (배포 완료 후)

모든 배포가 완료된 후, DNS 설정을 통해 도메인을 CloudFront에 연결합니다:

1. **CloudFront 도메인 확인**
   ```bash
   # CloudFront 배포 도메인 조회
   aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[0]=='your-domain.com'].DomainName" --output text
   ```

2. **DNS CNAME 레코드 추가**
   - 도메인 등록업체 또는 DNS 서비스 제공업체에서 설정
   - 레코드 타입: `CNAME`
   - 이름: `your-domain.com` (또는 서브도메인)
   - 값: CloudFront 배포 도메인 (예: `d1234567890123.cloudfront.net`)

## ✨ 장점

- ✅ **간단함**: Python Custom Resource 불필요
- ✅ **명확함**: CloudFormation 네이티브 기능만 사용
- ✅ **유지보수**: 템플릿 파일만 관리하면 됨
- ✅ **디버깅**: CloudFormation 로그로 모든 것을 추적 가능
- ✅ **분리**: CloudFront와 SAM 스택이 독립적으로 관리됨

## 🛠️ 로컬 개발

```bash
# 로컬 실행
make local

# localhost:3000에서 확인
```

## 📚 참고 링크

- [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Next.js Documentation](https://nextjs.org/docs)
