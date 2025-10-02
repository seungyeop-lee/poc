#!/bin/bash

# mTLS 인증서 생성 스크립트
# CA, 서버, 클라이언트 인증서를 자체 서명으로 생성

set -e

CERTS_DIR="certs"
CA_DIR="$CERTS_DIR/ca"
SERVER_DIR="$CERTS_DIR/server"
CLIENT_DIR="$CERTS_DIR/client"

echo "=== mTLS 인증서 생성 시작 ==="

# 1. CA 인증서 생성
echo "1. CA 인증서 생성 중..."
openssl genrsa -out "$CA_DIR/ca.key" 4096
openssl req -new -x509 -days 365 -key "$CA_DIR/ca.key" -out "$CA_DIR/ca.crt" \
  -subj "/C=KR/ST=Seoul/L=Seoul/O=Test/OU=TestCA/CN=TestCA"

# 2. 서버 인증서 생성
echo "2. 서버 인증서 생성 중..."
openssl genrsa -out "$SERVER_DIR/server.key" 4096
openssl req -new -key "$SERVER_DIR/server.key" -out "$SERVER_DIR/server.csr" \
  -subj "/C=KR/ST=Seoul/L=Seoul/O=Test/OU=Server/CN=localhost"
openssl x509 -req -days 365 -in "$SERVER_DIR/server.csr" \
  -CA "$CA_DIR/ca.crt" -CAkey "$CA_DIR/ca.key" -CAcreateserial \
  -out "$SERVER_DIR/server.crt"

# 3. 클라이언트 인증서 생성
echo "3. 클라이언트 인증서 생성 중..."
openssl genrsa -out "$CLIENT_DIR/client.key" 4096
openssl req -new -key "$CLIENT_DIR/client.key" -out "$CLIENT_DIR/client.csr" \
  -subj "/C=KR/ST=Seoul/L=Seoul/O=Test/OU=Client/CN=client"
openssl x509 -req -days 365 -in "$CLIENT_DIR/client.csr" \
  -CA "$CA_DIR/ca.crt" -CAkey "$CA_DIR/ca.key" -CAcreateserial \
  -out "$CLIENT_DIR/client.crt"

echo "=== 인증서 생성 완료 ==="
echo "생성된 파일:"
echo "- CA: $CA_DIR/ca.crt, $CA_DIR/ca.key"
echo "- Server: $SERVER_DIR/server.crt, $SERVER_DIR/server.key"
echo "- Client: $CLIENT_DIR/client.crt, $CLIENT_DIR/client.key"
