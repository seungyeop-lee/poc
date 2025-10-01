# 드래그 앤 드롭 로직

1. onMouseDown: 드래그 시작, 마우스 초기 위치 및 텍스트 초기 위치 저장
2. onMouseMove: 드래그 중, 마우스 이동 거리를 계산하여 텍스트 위치 업데이트
3. onMouseUp: 드래그 종료, 최종 위치를 CouponEmbeddingSettings의 left, top에 반영

좌표 변환:
- 화면 좌표 = (마우스 X - Canvas 왼쪽 상단 X, 마우스 Y - Canvas 왼쪽 상단 Y)
- 이미지 좌표 = 화면 좌표 * (원본 이미지 크기 / 표시 이미지 크기)