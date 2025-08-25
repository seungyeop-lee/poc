include .env

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

.PHONY: deploy
deploy: build
	sam deploy \
	--parameter-overrides \
	AcmCertificateArnParameter="$(AcmCertificateArnParameter)" \
	CustomDomainName="$(CustomDomainName)"
