# UI 설계: 드래그 핸들

## 설계 개요
텍스트 위치에 드래그 가능한 핸들을 표시하여 이미지와 분리된 드래그 영역 제공

## 컴포넌트 구조

### 컨테이너 구조
```
<div> (외부 컨테이너 - 상대 위치 기준)
  <img /> (이미지 - 드래그 불가)
  <div> (드래그 핸들 - absolute positioning)
    🎯 (핸들 아이콘)
  </div>
</div>
```

### 핸들 위치 계산
- **위치 기준**: 이미지의 naturalWidth, naturalHeight 기준
- **표시 위치 계산**:
  - 이미지 실제 크기와 표시 크기의 비율 계산 (scale factor)
  - `settings.left * scaleX` → 핸들의 left position
  - `settings.top * scaleY` → 핸들의 top position

### 핸들 스타일링
```css
.drag-handle {
  position: absolute;
  width: 32px;
  height: 32px;
  background: rgba(59, 130, 246, 0.8); /* blue-500 with opacity */
  border: 2px solid white;
  border-radius: 50%;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%); /* 중심점을 텍스트 위치로 */
  z-index: 10;
}

.drag-handle:hover {
  background: rgba(59, 130, 246, 1);
  transform: translate(-50%, -50%) scale(1.1);
}

.drag-handle.dragging {
  cursor: grabbing;
  background: rgba(37, 99, 235, 1); /* blue-600 */
}
```

### 핸들 아이콘
- **아이콘**: 십자가 모양 (↕↔) 또는 타겟 모양 (🎯)
- **색상**: 흰색 (배경과 대비)
- **크기**: 16x16px

## 동작 흐름

### 1. 초기 렌더링
1. 이미지 로드 완료 시 naturalWidth, naturalHeight 저장
2. 이미지 실제 표시 크기(offsetWidth, offsetHeight) 저장
3. scale factor 계산: `scaleX = offsetWidth / naturalWidth`, `scaleY = offsetHeight / naturalHeight`
4. 핸들 위치 계산: `left = settings.left * scaleX`, `top = settings.top * scaleY`

### 2. 드래그 시작 (handleMouseDown)
1. 핸들에서만 이벤트 발생 (이미지는 드래그 불가)
2. 현재 마우스 위치 저장
3. isDragging 상태를 true로 설정
4. 핸들에 'dragging' 클래스 추가

### 3. 드래그 중 (handleMouseMove)
1. 마우스 이동 거리 계산 (deltaX, deltaY)
2. 실제 이미지 좌표로 변환: `deltaX / scaleX`, `deltaY / scaleY`
3. settings 업데이트: `left += deltaX / scaleX`, `top += deltaY / scaleY`
4. 핸들 위치 재계산 및 업데이트

### 4. 드래그 종료 (handleMouseUp)
1. isDragging 상태를 false로 설정
2. 핸들에서 'dragging' 클래스 제거

## 경계 처리
- **이미지 경계 내로 제한**: 핸들이 이미지 밖으로 나가지 않도록 제한
  - `left`: 0 ~ naturalWidth
  - `top`: 0 ~ naturalHeight

## 접근성
- **키보드 지원**: 화살표 키로 미세 조정 (선택사항, 향후 추가 가능)
- **ARIA 레이블**: "Drag to adjust text position"

## 반응형 고려사항
- 이미지 크기 변경 시 (리사이즈) scale factor 재계산
- 핸들 크기는 고정 (32px), 이미지 크기와 무관
