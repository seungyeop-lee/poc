#!/bin/bash

# mTLS 인증서 생성 스크립트
# CA, 서버, 클라이언트 인증서 생성

set -e

echo "mTLS 인증서 생성 시작..."

# 디렉토리 생성 (이미 존재하면 스킵)
mkdir -p certs

# Step 1: CA 인증서 생성
echo "1. CA 인증서 생성 중..."

# CA 개인키 생성
openssl genrsa -out certs/ca.key 4096

# CA 인증서 생성 (1년 유효기간)
openssl req -x509 -new -nodes -key certs/ca.key -sha256 -days 365 -out certs/ca.crt -subj "/C=KR/ST=Seoul/L=Seoul/O=MTLS Demo/OU=Demo CA/CN=mtls-demo-ca"

echo "CA 인증서 생성 완료"

# Step 2: 서버 인증서 생성
echo "2. 서버 인증서 생성 중..."

# 서버 개인키 생성
openssl genrsa -out certs/server.key 2048

# 서버 CSR 생성
openssl req -new -key certs/server.key -out certs/server.csr -subj "/C=KR/ST=Seoul/L=Seoul/O=MTLS Demo/OU=Server/CN=localhost"

# 서버 인증서 생성 (CA로 서명, 1년 유효기간)
openssl x509 -req -in certs/server.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/server.crt -days 365 -sha256 -extfile <(cat <<EOF
[v3_req]
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
DNS.2 = mtls-server
IP.1 = 127.0.0.1
EOF
)

# 임시 파일 삭제
rm certs/server.csr

echo "서버 인증서 생성 완료"

# Step 3: 클라이언트 인증서 생성
echo "3. 클라이언트 인증서 생성 중..."

# 클라이언트 개인키 생성
openssl genrsa -out certs/client.key 2048

# 클라이언트 CSR 생성
openssl req -new -key certs/client.key -out certs/client.csr -subj "/C=KR/ST=Seoul/L=Seoul/O=MTLS Demo/OU=Client/CN=mtls-client"

# 클라이언트 인증서 생성 (CA로 서명, 1년 유효기간)
openssl x509 -req -in certs/client.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/client.crt -days 365 -sha256

# 임시 파일 삭제
rm certs/client.csr

echo "클라이언트 인증서 생성 완료"

# Step 4: 인증서 검증
echo "4. 생성된 인증서 검증 중..."

# 인증서 체인 검증
echo "서버 인증서 검증:"
openssl verify -CAfile certs/ca.crt certs/server.crt

echo "클라이언트 인증서 검증:"
openssl verify -CAfile certs/ca.crt certs/client.crt

# 생성된 파일 목록 표시
echo "생성된 인증서 파일:"
ls -la certs/

echo "mTLS 인증서 생성 완료!"
echo "인증서 파일 위치:"
echo "  CA 인증서: certs/ca.crt, certs/ca.key"
echo "  서버 인증서: certs/server.crt, certs/server.key"
echo "  클라이언트 인증서: certs/client.crt, certs/client.key"