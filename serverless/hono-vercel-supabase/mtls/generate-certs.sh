#!/bin/bash

# mTLS 인증서 생성 스크립트
# 이 스크립트는 mTLS 테스트를 위한 CA, 서버, 클라이언트 인증서를 생성합니다

set -e

# 출력용 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 색상 없음

# 스크립트가 위치한 디렉토리 가져오기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERTS_DIR="${SCRIPT_DIR}/certs"

# 설정
CA_SUBJECT="/C=KR/ST=Seoul/L=Seoul/O=Test CA/CN=Test CA"
SERVER_SUBJECT="/C=KR/ST=Seoul/L=Seoul/O=Test Server/CN=localhost"
CLIENT_SUBJECT="/C=KR/ST=Seoul/L=Seoul/O=Test Client/CN=client"
DAYS_VALID=365

echo -e "${YELLOW}mTLS 인증서 생성을 시작합니다...${NC}"

# certs 디렉토리가 없으면 생성
if [ -d "$CERTS_DIR" ]; then
    echo -e "${YELLOW}기존 인증서를 제거하는 중...${NC}"
    rm -rf "$CERTS_DIR"
fi

mkdir -p "$CERTS_DIR"
cd "$CERTS_DIR"

# 1. CA 개인키 및 인증서 생성
echo -e "${GREEN}[1/6] CA 개인키 생성 중...${NC}"
openssl genrsa -out ca.key 4096

echo -e "${GREEN}[2/6] CA 인증서 생성 중...${NC}"
openssl req -new -x509 -days $DAYS_VALID -key ca.key -out ca.crt -subj "$CA_SUBJECT"

# 2. 서버 개인키 및 CSR 생성
echo -e "${GREEN}[3/6] 서버 개인키 및 CSR 생성 중...${NC}"
openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr -subj "$SERVER_SUBJECT"

# 서버 인증서 확장 파일 생성
cat > server.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

echo -e "${GREEN}[4/6] CA로 서버 인증서 서명 중...${NC}"
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
    -out server.crt -days $DAYS_VALID -extfile server.ext

# 3. 클라이언트 개인키 및 CSR 생성
echo -e "${GREEN}[5/6] 클라이언트 개인키 및 CSR 생성 중...${NC}"
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr -subj "$CLIENT_SUBJECT"

# 클라이언트 인증서 확장 파일 생성
cat > client.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = clientAuth
EOF

echo -e "${GREEN}[6/6] CA로 클라이언트 인증서 서명 중...${NC}"
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
    -out client.crt -days $DAYS_VALID -extfile client.ext

# 임시 파일 정리
rm -f server.csr server.ext client.csr client.ext

# 적절한 권한 설정
chmod 600 *.key
chmod 644 *.crt

echo -e "${GREEN}✓ 인증서 생성이 성공적으로 완료되었습니다!${NC}"
echo ""
echo "$CERTS_DIR 에 생성된 파일:"
echo "  - ca.crt, ca.key          : 인증 기관 (CA)"
echo "  - server.crt, server.key  : 서버 인증서"
echo "  - client.crt, client.key  : 클라이언트 인증서"
echo ""
echo -e "${YELLOW}참고: 이 인증서들은 테스트 목적으로만 사용하세요.${NC}"
echo -e "${YELLOW}프로덕션 환경에서는 절대 사용하지 마세요.${NC}"
