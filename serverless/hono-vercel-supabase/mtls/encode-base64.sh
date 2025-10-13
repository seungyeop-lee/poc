#!/bin/bash

# mTLS 인증서 파일을 base64로 변환하는 스크립트
# 사용법: ./encode-base64.sh <파일경로>

set -e

# 출력용 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 색상 없음

# 스크립트가 위치한 디렉토리 가져오기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 인자 확인
if [ $# -eq 0 ]; then
    echo -e "${RED}오류: 파일 경로를 지정해주세요.${NC}"
    echo ""
    echo "사용법: $0 <파일경로>"
    echo ""
    echo "예시:"
    echo "  $0 certs/ca.crt"
    echo "  $0 certs/server.key"
    echo "  $0 /절대경로/파일.crt"
    exit 1
fi

FILE_PATH="$1"

# 상대 경로인 경우 mtls 디렉토리 기준으로 처리
if [[ ! "$FILE_PATH" = /* ]]; then
    FILE_PATH="${SCRIPT_DIR}/${FILE_PATH}"
fi

# 파일 존재 확인
if [ ! -f "$FILE_PATH" ]; then
    echo -e "${RED}오류: 파일을 찾을 수 없습니다: $FILE_PATH${NC}"
    exit 1
fi

# 파일 읽기 권한 확인
if [ ! -r "$FILE_PATH" ]; then
    echo -e "${RED}오류: 파일을 읽을 수 없습니다: $FILE_PATH${NC}"
    echo -e "${YELLOW}파일 권한을 확인해주세요.${NC}"
    exit 1
fi

# 파일명 추출
FILE_NAME=$(basename "$FILE_PATH")

echo -e "${YELLOW}파일을 base64로 변환 중: $FILE_NAME${NC}"
echo ""

# base64로 변환 (개행 없이)
BASE64_OUTPUT=$(base64 -i "$FILE_PATH" | tr -d '\n')

# 결과 출력
echo -e "${GREEN}✓ 변환 완료!${NC}"
echo ""
echo "────────────────────────────────────────────────────────────"
echo "$BASE64_OUTPUT"
echo "────────────────────────────────────────────────────────────"
echo ""

# 결과를 클립보드에 복사 (macOS의 경우)
if command -v pbcopy &> /dev/null; then
    echo "$BASE64_OUTPUT" | pbcopy
    echo -e "${GREEN}✓ 클립보드에 복사되었습니다!${NC}"
    echo ""
fi

# 통계 정보 출력
ORIGINAL_SIZE=$(wc -c < "$FILE_PATH" | tr -d ' ')
BASE64_SIZE=${#BASE64_OUTPUT}

echo "파일 정보:"
echo "  - 원본 파일: $FILE_NAME"
echo "  - 원본 크기: $ORIGINAL_SIZE bytes"
echo "  - Base64 크기: $BASE64_SIZE bytes"
echo ""
echo -e "${YELLOW}참고: 환경 변수나 설정 파일에 사용할 때는 줄바꿈 없이 사용하세요.${NC}"
