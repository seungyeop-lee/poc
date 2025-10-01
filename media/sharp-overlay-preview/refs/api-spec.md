# API 엔드포인트 설계

## POST /upload
- 요청: multipart/form-data (image 필드에 파일)
- 응답: { "imageId": "uuid", "originalWidth": 1920, "originalHeight": 1080 }

## POST /preview
- 요청: { "imageId": "uuid", "settings": CouponEmbeddingSettings, "text": "string" }
- 응답: Buffer (프리뷰 이미지)

## POST /download
- 요청: { "imageId": "uuid", "settings": CouponEmbeddingSettings, "text": "string" }
- 응답: Buffer (최종 이미지)