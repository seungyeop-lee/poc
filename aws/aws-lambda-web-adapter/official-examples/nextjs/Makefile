include .env

# CloudFormation 네이티브 방식 변수
CLOUDFRONT_STACK_NAME=cloudfront-stack
SAM_STACK_NAME=poc-aws-lambda-web-adapter-nextjs

.PHONY: deploy-init
deploy-init:
	cp .env.example .env
	cp example.samconfig.toml samconfig.toml

.PHONY: build
build:
	sam build

.PHONY: local
local: build
	sam local start-api

.PHONY: deploy-cloudfront
deploy-cloudfront:
	@echo "🚀 CloudFront 배포 시작..."
	aws cloudformation deploy \
		--template-file infrastructure/cloudfront.yaml \
		--stack-name $(CLOUDFRONT_STACK_NAME) \
		--parameter-overrides \
			AcmCertificateArnParameter="$(AcmCertificateArnParameter)" \
			CustomDomainName="$(CustomDomainName)" \
			OriginDomainName="example.com" \
		--capabilities CAPABILITY_IAM

.PHONY: deploy-sam
deploy-sam: build
	@echo "🚀 SAM 배포 시작..."
	sam deploy --stack-name $(SAM_STACK_NAME) --no-confirm-changeset

.PHONY: update-cloudfront
update-cloudfront:
	@echo "🚀 API Gateway 도메인 확인"
	$(eval API_GATEWAY_DOMAIN := $(shell aws cloudformation describe-stacks \
		--stack-name $(SAM_STACK_NAME) \
		--query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayDomainName`].OutputValue' \
		--output text))
	@echo "API Gateway Domain: $(API_GATEWAY_DOMAIN)"

	@if [ -z "$(API_GATEWAY_DOMAIN)" ]; then \
		echo "❌ API Gateway 도메인을 찾을 수 없습니다. 스택이 정상적으로 배포되었는지 확인하세요."; \
		exit 1; \
	fi
	
	@echo "🚀 CloudFront origin 업데이트"
	aws cloudformation deploy \
		--template-file infrastructure/cloudfront.yaml \
		--stack-name $(CLOUDFRONT_STACK_NAME) \
		--parameter-overrides \
			AcmCertificateArnParameter="$(AcmCertificateArnParameter)" \
			CustomDomainName="$(CustomDomainName)" \
			OriginDomainName="$(API_GATEWAY_DOMAIN)" \
		--capabilities CAPABILITY_IAM

# CloudFormation 네이티브 방식 배포 (통합)
.PHONY: deploy
deploy:
	@echo "🚀 CloudFront + SAM 통합 배포 시작..."
	
	$(MAKE) deploy-cloudfront
	$(MAKE) deploy-sam
	$(MAKE) update-cloudfront

	@echo "✅ 배포 완료!"
	@echo "🌐 CloudFront URL: https://$(CustomDomainName)"

.PHONY: delete-cloudfront
delete-cloudfront:
	@echo "🧹 CloudFront 스택 삭제 시작..."
	aws cloudformation delete-stack --stack-name $(CLOUDFRONT_STACK_NAME)
	aws cloudformation wait stack-delete-complete --stack-name $(CLOUDFRONT_STACK_NAME)
	@echo "✅ CloudFront 스택 삭제 완료!"

.PHONY: delete-sam
delete-sam:
	@echo "🧹 SAM 스택 삭제 시작..."
	aws cloudformation delete-stack --stack-name $(SAM_STACK_NAME)
	aws cloudformation wait stack-delete-complete --stack-name $(SAM_STACK_NAME)
	@echo "✅ SAM 스택 삭제 완료!"

# CloudFormation 네이티브 방식 정리
.PHONY: cleanup
cleanup:
	@echo "🧹 CloudFront + SAM 스택 정리 시작..."

	$(MAKE) delete-cloudfront
	$(MAKE) delete-sam

	@echo "✅ 정리 완료!"

# 도움말
.PHONY: help
help:
	@echo "🔧 사용 가능한 명령어:"
	@echo "  make deploy-init    - 초기 설정 파일 생성"
	@echo "  make local          - 로컬 개발 서버 실행"
	@echo "  make deploy         - CloudFront + SAM 통합 배포"
	@echo "  make cleanup        - 모든 스택 삭제"
	@echo "  make build          - SAM 빌드만 실행"
	@echo "  make help           - 이 도움말 표시"
