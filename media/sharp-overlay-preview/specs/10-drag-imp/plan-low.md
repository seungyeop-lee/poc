# 저수준 행동 계획

## 실행 환경 설정

### 필수 도구 및 설치

```bash
node --version
npm --version
```

**예상 결과**: Node.js v18.0.0 이상, npm v9.0.0 이상

### 사전 조건 확인

```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend
npm list react react-dom typescript
```

**예상 결과**: react, react-dom, typescript 패키지가 설치되어 있음

## 단계별 액션 플랜

### 액션 1: 현재 PreviewCanvasComponent.tsx 파일 읽기

**선행 조건**: 없음

**실행 명령어**:
```bash
cat /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend/src/PreviewCanvasComponent.tsx
```

**예상 결과**: 현재 파일 내용이 출력되며, 144-180번 줄에 드래그 핸들 렌더링 코드가 존재함

**완료 조건**: 파일 내용을 확인하고 다음 정보를 파악함:
- 드래그 핸들 렌더링 위치 (144-180번 줄)
- 마우스 이벤트 핸들러 (`handleMouseDown`, `handleMouseMove`, `handleMouseUp`)
- 좌표 변환 로직 (`imageScale.scaleX`, `imageScale.scaleY`)
- 텍스트 위치 정보 (`settings.left`, `settings.top`)

**검증 방법**:
```bash
grep -n "Drag Handle" /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend/src/PreviewCanvasComponent.tsx
```

**예상 검증 결과**: "144:			{/* Drag Handle */}" 출력됨

**주의사항**: 이 단계는 정보 수집 단계이므로 코드를 수정하지 않음

---

### 액션 2: 드래그 핸들 제거 및 아웃라인 박스 렌더링 코드 작성

**선행 조건**: 액션 1이 완료되어 현재 코드 구조를 파악한 상태

**파일 작성**: `/Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend/src/PreviewCanvasComponent.tsx`
```typescript
import React, { useState, useEffect, useRef } from "react";
import type { CouponEmbeddingSettings } from "./types";

interface Props {
	imageId: string | null;
	settings: CouponEmbeddingSettings;
	text: string;
	onSettingsChange: (settings: CouponEmbeddingSettings) => void;
	onImageDimensionsChange: (dimensions: {
		width: number;
		height: number;
	} | null) => void;
}

export const PreviewCanvasComponent: React.FC<Props> = ({
	imageId,
	settings,
	text,
	onSettingsChange,
	onImageDimensionsChange,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [imageScale, setImageScale] = useState({ scaleX: 1, scaleY: 1 });
	const imgRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (imgRef.current && imgRef.current.complete) {
			const img = imgRef.current;
			onImageDimensionsChange({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});

			// Calculate scale factor for drag handle positioning
			const scaleX = img.offsetWidth / img.naturalWidth;
			const scaleY = img.offsetHeight / img.naturalHeight;
			setImageScale({ scaleX, scaleY });
		}
	}, [previewUrl, onImageDimensionsChange]);

	useEffect(() => {
		if (!imageId) return;

		const fetchPreview = async () => {
			const response = await fetch("http://localhost:3001/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageId, settings, text }),
			});

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			setPreviewUrl((oldUrl) => {
				if (oldUrl) URL.revokeObjectURL(oldUrl);
				return url;
			});
		};

		const timeoutId = setTimeout(fetchPreview, 100);
		return () => clearTimeout(timeoutId);
	}, [imageId, settings, text]);


	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event bubbling to image
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !imgRef.current) return;

		const deltaX = e.clientX - dragStart.x;
		const deltaY = e.clientY - dragStart.y;

		// Convert display coordinates to actual image coordinates
		const actualDeltaX = deltaX / imageScale.scaleX;
		const actualDeltaY = deltaY / imageScale.scaleY;

		const newLeft = Math.max(
			0,
			Math.min(
				imgRef.current.naturalWidth,
				settings.left + actualDeltaX
			)
		);
		const newTop = Math.max(
			0,
			Math.min(
				imgRef.current.naturalHeight,
				settings.top + actualDeltaY
			)
		);

		onSettingsChange({ ...settings, left: newLeft, top: newTop });
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Calculate outline box position and size
	const outlineBoxPosition = {
		left: settings.left * imageScale.scaleX,
		top: settings.top * imageScale.scaleY,
	};

	// Approximate text width based on fontSize and text length
	const approximateTextWidth = text.length * settings.fontSize * 0.6;
	const approximateTextHeight = settings.fontSize * 1.2;

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
				💡 Tip: Drag the outline box below to adjust text position
			</div>
			{previewUrl && (
				<div
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					className="inline-block relative border-2 border-gray-300 dark:border-gray-600 rounded-lg"
				>
					<img
						ref={imgRef}
						src={previewUrl}
						alt="Preview"
						className="max-w-full h-auto rounded-lg block"
						onLoad={() => {
							if (imgRef.current) {
								const img = imgRef.current;
								onImageDimensionsChange({
									width: img.naturalWidth,
									height: img.naturalHeight,
								});

								// Update scale factor
								const scaleX = img.offsetWidth / img.naturalWidth;
								const scaleY = img.offsetHeight / img.naturalHeight;
								setImageScale({ scaleX, scaleY });
							}
						}}
					/>
					{/* Outline Box */}
					<div
						onMouseDown={handleMouseDown}
						style={{
							position: "absolute",
							left: `${outlineBoxPosition.left}px`,
							top: `${outlineBoxPosition.top}px`,
							width: `${approximateTextWidth * imageScale.scaleX}px`,
							height: `${approximateTextHeight * imageScale.scaleY}px`,
							cursor: isDragging ? "grabbing" : "grab",
							zIndex: 10,
							border: "2px dashed rgba(59, 130, 246, 0.8)",
							backgroundColor: isDragging ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
							transition: isDragging ? "none" : "background-color 0.2s",
						}}
						className={`
							${isDragging ? "" : "hover:bg-blue-200 hover:bg-opacity-20"}
						`}
						aria-label="Drag to adjust text position"
					/>
				</div>
			)}
		</div>
	);
};
```

**예상 결과**:
- 기존 드래그 핸들 (144-180번 줄)이 제거됨
- 새로운 아웃라인 박스가 텍스트 위치에 렌더링됨
- 박스 크기는 `text.length * fontSize * 0.6`로 계산된 너비, `fontSize * 1.2`로 계산된 높이를 가짐
- 박스는 점선 테두리와 반투명 배경을 가짐

**완료 조건**: 파일이 저장되고 TypeScript 컴파일 에러가 없음

**검증 방법**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit
```

**예상 검증 결과**: TypeScript 컴파일 에러 없음 (아무 출력 없음)

**주의사항**: 기존 드래그 핸들 코드를 완전히 제거하고 아웃라인 박스로 대체함

---

### 액션 3: 터치 이벤트 핸들러 추가

**선행 조건**: 액션 2가 완료되어 아웃라인 박스가 렌더링되는 상태

**파일 작성**: `/Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend/src/PreviewCanvasComponent.tsx`
```typescript
import React, { useState, useEffect, useRef } from "react";
import type { CouponEmbeddingSettings } from "./types";

interface Props {
	imageId: string | null;
	settings: CouponEmbeddingSettings;
	text: string;
	onSettingsChange: (settings: CouponEmbeddingSettings) => void;
	onImageDimensionsChange: (dimensions: {
		width: number;
		height: number;
	} | null) => void;
}

export const PreviewCanvasComponent: React.FC<Props> = ({
	imageId,
	settings,
	text,
	onSettingsChange,
	onImageDimensionsChange,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [imageScale, setImageScale] = useState({ scaleX: 1, scaleY: 1 });
	const imgRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (imgRef.current && imgRef.current.complete) {
			const img = imgRef.current;
			onImageDimensionsChange({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});

			// Calculate scale factor for drag handle positioning
			const scaleX = img.offsetWidth / img.naturalWidth;
			const scaleY = img.offsetHeight / img.naturalHeight;
			setImageScale({ scaleX, scaleY });
		}
	}, [previewUrl, onImageDimensionsChange]);

	useEffect(() => {
		if (!imageId) return;

		const fetchPreview = async () => {
			const response = await fetch("http://localhost:3001/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageId, settings, text }),
			});

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			setPreviewUrl((oldUrl) => {
				if (oldUrl) URL.revokeObjectURL(oldUrl);
				return url;
			});
		};

		const timeoutId = setTimeout(fetchPreview, 100);
		return () => clearTimeout(timeoutId);
	}, [imageId, settings, text]);


	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event bubbling to image
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !imgRef.current) return;

		const deltaX = e.clientX - dragStart.x;
		const deltaY = e.clientY - dragStart.y;

		// Convert display coordinates to actual image coordinates
		const actualDeltaX = deltaX / imageScale.scaleX;
		const actualDeltaY = deltaY / imageScale.scaleY;

		const newLeft = Math.max(
			0,
			Math.min(
				imgRef.current.naturalWidth,
				settings.left + actualDeltaX
			)
		);
		const newTop = Math.max(
			0,
			Math.min(
				imgRef.current.naturalHeight,
				settings.top + actualDeltaY
			)
		);

		onSettingsChange({ ...settings, left: newLeft, top: newTop });
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		e.stopPropagation(); // Prevent event bubbling to image
		const touch = e.touches[0];
		setIsDragging(true);
		setDragStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || !imgRef.current) return;

		const touch = e.touches[0];
		const deltaX = touch.clientX - dragStart.x;
		const deltaY = touch.clientY - dragStart.y;

		// Convert display coordinates to actual image coordinates
		const actualDeltaX = deltaX / imageScale.scaleX;
		const actualDeltaY = deltaY / imageScale.scaleY;

		const newLeft = Math.max(
			0,
			Math.min(
				imgRef.current.naturalWidth,
				settings.left + actualDeltaX
			)
		);
		const newTop = Math.max(
			0,
			Math.min(
				imgRef.current.naturalHeight,
				settings.top + actualDeltaY
			)
		);

		onSettingsChange({ ...settings, left: newLeft, top: newTop });
		setDragStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
	};

	// Calculate outline box position and size
	const outlineBoxPosition = {
		left: settings.left * imageScale.scaleX,
		top: settings.top * imageScale.scaleY,
	};

	// Approximate text width based on fontSize and text length
	const approximateTextWidth = text.length * settings.fontSize * 0.6;
	const approximateTextHeight = settings.fontSize * 1.2;

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
				💡 Tip: Drag the outline box below to adjust text position
			</div>
			{previewUrl && (
				<div
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					className="inline-block relative border-2 border-gray-300 dark:border-gray-600 rounded-lg"
				>
					<img
						ref={imgRef}
						src={previewUrl}
						alt="Preview"
						className="max-w-full h-auto rounded-lg block"
						onLoad={() => {
							if (imgRef.current) {
								const img = imgRef.current;
								onImageDimensionsChange({
									width: img.naturalWidth,
									height: img.naturalHeight,
								});

								// Update scale factor
								const scaleX = img.offsetWidth / img.naturalWidth;
								const scaleY = img.offsetHeight / img.naturalHeight;
								setImageScale({ scaleX, scaleY });
							}
						}}
					/>
					{/* Outline Box */}
					<div
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						style={{
							position: "absolute",
							left: `${outlineBoxPosition.left}px`,
							top: `${outlineBoxPosition.top}px`,
							width: `${approximateTextWidth * imageScale.scaleX}px`,
							height: `${approximateTextHeight * imageScale.scaleY}px`,
							cursor: isDragging ? "grabbing" : "grab",
							zIndex: 10,
							border: "2px dashed rgba(59, 130, 246, 0.8)",
							backgroundColor: isDragging ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
							transition: isDragging ? "none" : "background-color 0.2s",
						}}
						className={`
							${isDragging ? "" : "hover:bg-blue-200 hover:bg-opacity-20"}
						`}
						aria-label="Drag to adjust text position"
					/>
				</div>
			)}
		</div>
	);
};
```

**예상 결과**:
- `handleTouchStart`, `handleTouchMove`, `handleTouchEnd` 함수가 추가됨
- 컨테이너에 `onTouchMove`, `onTouchEnd` 이벤트 핸들러가 추가됨
- 아웃라인 박스에 `onTouchStart` 이벤트 핸들러가 추가됨
- 터치 이벤트는 마우스 이벤트와 동일한 로직으로 좌표 추출 방식만 변경됨 (`e.touches[0].clientX`, `e.touches[0].clientY`)

**완료 조건**: 파일이 저장되고 TypeScript 컴파일 에러가 없음

**검증 방법**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit
```

**예상 검증 결과**: TypeScript 컴파일 에러 없음 (아무 출력 없음)

**주의사항**: 터치 이벤트 핸들러는 마우스 이벤트와 독립적으로 동작하지만, 동일한 `isDragging`, `dragStart` 상태를 공유함

---

### 액션 4: 브라우저 기본 동작 차단 로직 추가

**선행 조건**: 액션 3이 완료되어 터치 이벤트 핸들러가 추가된 상태

**파일 작성**: `/Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend/src/PreviewCanvasComponent.tsx`
```typescript
import React, { useState, useEffect, useRef } from "react";
import type { CouponEmbeddingSettings } from "./types";

interface Props {
	imageId: string | null;
	settings: CouponEmbeddingSettings;
	text: string;
	onSettingsChange: (settings: CouponEmbeddingSettings) => void;
	onImageDimensionsChange: (dimensions: {
		width: number;
		height: number;
	} | null) => void;
}

export const PreviewCanvasComponent: React.FC<Props> = ({
	imageId,
	settings,
	text,
	onSettingsChange,
	onImageDimensionsChange,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [imageScale, setImageScale] = useState({ scaleX: 1, scaleY: 1 });
	const imgRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (imgRef.current && imgRef.current.complete) {
			const img = imgRef.current;
			onImageDimensionsChange({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});

			// Calculate scale factor for drag handle positioning
			const scaleX = img.offsetWidth / img.naturalWidth;
			const scaleY = img.offsetHeight / img.naturalHeight;
			setImageScale({ scaleX, scaleY });
		}
	}, [previewUrl, onImageDimensionsChange]);

	useEffect(() => {
		if (!imageId) return;

		const fetchPreview = async () => {
			const response = await fetch("http://localhost:3001/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageId, settings, text }),
			});

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			setPreviewUrl((oldUrl) => {
				if (oldUrl) URL.revokeObjectURL(oldUrl);
				return url;
			});
		};

		const timeoutId = setTimeout(fetchPreview, 100);
		return () => clearTimeout(timeoutId);
	}, [imageId, settings, text]);


	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event bubbling to image
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !imgRef.current) return;

		const deltaX = e.clientX - dragStart.x;
		const deltaY = e.clientY - dragStart.y;

		// Convert display coordinates to actual image coordinates
		const actualDeltaX = deltaX / imageScale.scaleX;
		const actualDeltaY = deltaY / imageScale.scaleY;

		const newLeft = Math.max(
			0,
			Math.min(
				imgRef.current.naturalWidth,
				settings.left + actualDeltaX
			)
		);
		const newTop = Math.max(
			0,
			Math.min(
				imgRef.current.naturalHeight,
				settings.top + actualDeltaY
			)
		);

		onSettingsChange({ ...settings, left: newLeft, top: newTop });
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault(); // Prevent default touch behavior
		e.stopPropagation(); // Prevent event bubbling to image
		const touch = e.touches[0];
		setIsDragging(true);
		setDragStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || !imgRef.current) return;

		e.preventDefault(); // Prevent scrolling during drag

		const touch = e.touches[0];
		const deltaX = touch.clientX - dragStart.x;
		const deltaY = touch.clientY - dragStart.y;

		// Convert display coordinates to actual image coordinates
		const actualDeltaX = deltaX / imageScale.scaleX;
		const actualDeltaY = deltaY / imageScale.scaleY;

		const newLeft = Math.max(
			0,
			Math.min(
				imgRef.current.naturalWidth,
				settings.left + actualDeltaX
			)
		);
		const newTop = Math.max(
			0,
			Math.min(
				imgRef.current.naturalHeight,
				settings.top + actualDeltaY
			)
		);

		onSettingsChange({ ...settings, left: newLeft, top: newTop });
		setDragStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
	};

	const handleImageDragStart = (e: React.DragEvent) => {
		e.preventDefault(); // Prevent image drag
	};

	// Calculate outline box position and size
	const outlineBoxPosition = {
		left: settings.left * imageScale.scaleX,
		top: settings.top * imageScale.scaleY,
	};

	// Approximate text width based on fontSize and text length
	const approximateTextWidth = text.length * settings.fontSize * 0.6;
	const approximateTextHeight = settings.fontSize * 1.2;

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
				💡 Tip: Drag the outline box below to adjust text position
			</div>
			{previewUrl && (
				<div
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					className="inline-block relative border-2 border-gray-300 dark:border-gray-600 rounded-lg"
					style={{ touchAction: "none" }}
				>
					<img
						ref={imgRef}
						src={previewUrl}
						alt="Preview"
						className="max-w-full h-auto rounded-lg block"
						onLoad={() => {
							if (imgRef.current) {
								const img = imgRef.current;
								onImageDimensionsChange({
									width: img.naturalWidth,
									height: img.naturalHeight,
								});

								// Update scale factor
								const scaleX = img.offsetWidth / img.naturalWidth;
								const scaleY = img.offsetHeight / img.naturalHeight;
								setImageScale({ scaleX, scaleY });
							}
						}}
						onDragStart={handleImageDragStart}
					/>
					{/* Outline Box */}
					<div
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						style={{
							position: "absolute",
							left: `${outlineBoxPosition.left}px`,
							top: `${outlineBoxPosition.top}px`,
							width: `${approximateTextWidth * imageScale.scaleX}px`,
							height: `${approximateTextHeight * imageScale.scaleY}px`,
							cursor: isDragging ? "grabbing" : "grab",
							zIndex: 10,
							border: "2px dashed rgba(59, 130, 246, 0.8)",
							backgroundColor: isDragging ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
							transition: isDragging ? "none" : "background-color 0.2s",
							touchAction: "none",
						}}
						className={`
							${isDragging ? "" : "hover:bg-blue-200 hover:bg-opacity-20"}
						`}
						aria-label="Drag to adjust text position"
					/>
				</div>
			)}
		</div>
	);
};
```

**예상 결과**:
- `handleTouchStart`와 `handleTouchMove`에 `e.preventDefault()` 호출 추가됨
- 이미지 요소에 `onDragStart={handleImageDragStart}` 추가되어 이미지 드래그 차단됨
- 컨테이너와 아웃라인 박스에 `touchAction: "none"` CSS 속성 추가되어 브라우저 제스처 차단됨

**완료 조건**: 파일이 저장되고 TypeScript 컴파일 에러가 없음

**검증 방법**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit
```

**예상 검증 결과**: TypeScript 컴파일 에러 없음 (아무 출력 없음)

**주의사항**:
- `preventDefault()`는 터치 이벤트에서만 호출하여 모바일 스크롤을 차단함
- 이미지 요소의 `onDragStart`는 데스크탑에서 이미지 드래그를 차단함
- `touchAction: "none"`은 브라우저의 기본 터치 제스처를 완전히 차단함

---

### 액션 5: 프론트엔드 개발 서버 실행 및 초기 동작 확인

**선행 조건**: 액션 4가 완료되어 모든 코드 수정이 완료된 상태

**실행 명령어**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npm run dev
```

**예상 결과**: Vite 개발 서버가 실행되고 `http://localhost:5173` 주소로 접속 가능함

**완료 조건**:
- 개발 서버가 정상적으로 시작됨
- 브라우저에서 `http://localhost:5173` 접속 시 애플리케이션이 로드됨
- 콘솔에 에러 메시지가 출력되지 않음

**검증 방법**:
```bash
curl -I http://localhost:5173
```

**예상 검증 결과**: `HTTP/1.1 200 OK` 응답 헤더 출력됨

**주의사항**:
- 개발 서버는 백그라운드에서 계속 실행되어야 함
- 백엔드 서버 (`http://localhost:3001`)도 함께 실행되어 있어야 프리뷰 기능이 동작함

---

### 액션 6: 데스크탑 마우스 드래그 테스트

**선행 조건**: 액션 5가 완료되어 개발 서버가 실행 중인 상태

**실행 명령어**:
수동 테스트 (자동화 불가능)

**테스트 절차**:
1. 브라우저에서 `http://localhost:5173` 접속
2. 이미지 업로드
3. 텍스트 입력
4. 프리뷰 이미지에서 아웃라인 박스 확인
5. 아웃라인 박스를 마우스로 클릭하고 드래그
6. 텍스트 위치가 변경되는지 확인

**예상 결과**:
- 아웃라인 박스가 텍스트 위치에 점선 테두리로 표시됨
- 마우스로 박스를 드래그하면 텍스트 위치가 실시간으로 변경됨
- 드래그 중 배경 이미지가 이동하지 않음

**완료 조건**:
- 아웃라인 박스가 정확히 텍스트 위치에 표시됨
- 마우스 드래그로 텍스트 위치를 자유롭게 변경 가능함
- 드래그 중 이미지가 이동하지 않음

**검증 방법**:
브라우저 개발자 도구 콘솔에서 에러 메시지 확인
```javascript
console.log("No errors")
```

**예상 검증 결과**: 콘솔에 에러 메시지가 없음

**주의사항**:
- 이 단계는 수동 테스트이므로 실제 브라우저에서 직접 확인해야 함
- 이미지가 드래그되지 않는지 특히 주의 깊게 확인해야 함

---

### 액션 7: Chrome 개발자 도구 터치 에뮬레이션 테스트

**선행 조건**: 액션 6이 완료되어 데스크탑 마우스 드래그가 정상 동작하는 상태

**실행 명령어**:
수동 테스트 (자동화 불가능)

**테스트 절차**:
1. Chrome 브라우저에서 `http://localhost:5173` 접속
2. 개발자 도구 열기 (F12 또는 Cmd+Option+I)
3. 디바이스 에뮬레이션 모드 활성화 (Cmd+Shift+M 또는 Toggle device toolbar 버튼 클릭)
4. 디바이스를 "iPhone 12 Pro" 또는 "Pixel 5" 등으로 설정
5. 이미지 업로드 및 텍스트 입력
6. 아웃라인 박스를 터치 드래그 (마우스로 클릭하고 드래그)
7. 드래그 중 페이지가 스크롤되지 않는지 확인

**예상 결과**:
- 터치 모드에서도 아웃라인 박스를 드래그하여 텍스트 위치 변경 가능
- 드래그 중 페이지 스크롤이 발생하지 않음
- 드래그 동작이 데스크탑과 동일하게 부드럽게 동작함

**완료 조건**:
- 터치 드래그로 텍스트 위치를 자유롭게 변경 가능함
- 드래그 중 페이지가 스크롤되지 않음
- 터치 이벤트가 정상적으로 처리됨

**검증 방법**:
브라우저 개발자 도구 콘솔에서 터치 이벤트 로그 확인
```javascript
console.log("Touch events working")
```

**예상 검증 결과**: 콘솔에 터치 이벤트 관련 에러 메시지가 없음

**주의사항**:
- Chrome 개발자 도구의 터치 에뮬레이션은 실제 모바일 기기와 완전히 동일하지 않을 수 있음
- 스크롤이 발생하지 않는지 특히 주의 깊게 확인해야 함

---

### 액션 8: 최종 통합 테스트 및 완료 확인

**선행 조건**: 액션 7이 완료되어 데스크탑과 터치 에뮬레이션 테스트가 모두 통과한 상태

**실행 명령어**:
수동 테스트 (자동화 불가능)

**테스트 절차**:
1. 모든 기능적 완료 기준 체크리스트 확인
2. 기술적 완료 기준 확인
3. 품질 완료 기준 확인

**완료 확인 체크리스트**:
- [ ] 아웃라인 박스가 텍스트 위치에 표시됨
- [ ] 마우스로 박스를 드래그하여 텍스트 이동 가능
- [ ] 터치로 박스를 드래그하여 텍스트 이동 가능
- [ ] 모바일 드래그 시 스크롤 발생하지 않음
- [ ] 데스크탑 드래그 시 이미지가 이동하지 않음
- [ ] `CouponEmbeddingSettings`의 `left`, `top` 속성이 정확히 업데이트됨
- [ ] 이미지 스케일링이 정확히 반영됨 (display 좌표 ↔ 실제 이미지 좌표 변환)
- [ ] 드래그 동작이 데스크탑과 모바일에서 일관됨
- [ ] 드래그 시작 시 박스 배경색이 변경되어 시각적 피드백 제공

**예상 결과**:
- 모든 체크리스트 항목이 통과됨
- 아웃라인 박스 드래그 기능이 완전히 동작함
- 데스크탑과 모바일 모두에서 일관된 사용자 경험 제공

**완료 조건**:
- 9개 체크리스트 항목이 모두 통과됨
- 콘솔에 에러 메시지가 없음
- TypeScript 컴파일 에러가 없음

**검증 방법**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit && npm run build
```

**예상 검증 결과**:
- TypeScript 컴파일 성공 (아무 출력 없음)
- 빌드 성공 (dist 폴더 생성됨)

**주의사항**:
- 모든 체크리스트 항목이 통과되어야만 작업이 완료된 것으로 간주함
- 하나라도 실패하면 해당 액션으로 돌아가 코드를 수정해야 함

## 파일 및 경로 매핑

| 파일 역할             | 파일 경로                                                                                                 | 작업 유형 |
| --------------------- | --------------------------------------------------------------------------------------------------------- | --------- |
| 메인 프리뷰 컴포넌트  | /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend/src/PreviewCanvasComponent.tsx | 수정      |

## 검증 체크포인트

### 체크포인트 1: TypeScript 컴파일 성공 (액션 2 완료 후)

**해당 액션**: 액션 2

**검증 명령어**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit
```

**성공 기준**: TypeScript 컴파일 에러 없음 (아무 출력 없음)

**실패 시 조치**: 액션 2로 돌아가 타입 에러를 수정함

---

### 체크포인트 2: TypeScript 컴파일 성공 (액션 3 완료 후)

**해당 액션**: 액션 3

**검증 명령어**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit
```

**성공 기준**: TypeScript 컴파일 에러 없음 (아무 출력 없음)

**실패 시 조치**: 액션 3으로 돌아가 터치 이벤트 핸들러의 타입 에러를 수정함

---

### 체크포인트 3: TypeScript 컴파일 성공 (액션 4 완료 후)

**해당 액션**: 액션 4

**검증 명령어**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit
```

**성공 기준**: TypeScript 컴파일 에러 없음 (아무 출력 없음)

**실패 시 조치**: 액션 4로 돌아가 이벤트 차단 로직의 타입 에러를 수정함

---

### 체크포인트 4: 개발 서버 정상 시작 (액션 5 완료 후)

**해당 액션**: 액션 5

**검증 명령어**:
```bash
curl -I http://localhost:5173
```

**성공 기준**: `HTTP/1.1 200 OK` 응답 헤더 출력됨

**실패 시 조치**:
- 포트 충돌 확인: `lsof -i :5173`
- 개발 서버 로그 확인
- 필요시 서버 재시작

---

### 체크포인트 5: 데스크탑 마우스 드래그 동작 (액션 6 완료 후)

**해당 액션**: 액션 6

**검증 방법**: 수동 테스트
- 아웃라인 박스가 표시됨
- 마우스로 드래그 가능함
- 이미지가 이동하지 않음

**성공 기준**: 3가지 조건이 모두 만족됨

**실패 시 조치**:
- 아웃라인 박스가 표시되지 않으면 액션 2로 돌아가 렌더링 로직 수정
- 드래그가 동작하지 않으면 액션 2로 돌아가 이벤트 핸들러 수정
- 이미지가 이동하면 액션 4로 돌아가 `onDragStart` 차단 로직 확인

---

### 체크포인트 6: 터치 드래그 동작 (액션 7 완료 후)

**해당 액션**: 액션 7

**검증 방법**: Chrome 개발자 도구 터치 에뮬레이션
- 터치 드래그 가능함
- 스크롤이 발생하지 않음

**성공 기준**: 2가지 조건이 모두 만족됨

**실패 시 조치**:
- 터치 드래그가 동작하지 않으면 액션 3으로 돌아가 터치 이벤트 핸들러 수정
- 스크롤이 발생하면 액션 4로 돌아가 `preventDefault()` 호출 확인

---

### 체크포인트 7: 최종 통합 테스트 (액션 8 완료 후)

**해당 액션**: 액션 8

**검증 명령어**:
```bash
cd /Users/leeseungyeop/repo/seungyeop-lee/poc/media/sharp-overlay-preview/frontend && npx tsc --noEmit && npm run build
```

**성공 기준**:
- TypeScript 컴파일 성공
- 빌드 성공
- 9개 체크리스트 항목 모두 통과

**실패 시 조치**:
- 컴파일 에러: 해당 액션으로 돌아가 타입 에러 수정
- 빌드 에러: 빌드 로그 확인 후 문제 해결
- 체크리스트 실패: 해당 기능의 액션으로 돌아가 수정

## 최종 검수 기준

### 기능적 완성도

- [ ] 아웃라인 박스가 프리뷰 이미지 위 텍스트 위치에 점선 테두리로 표시됨
- [ ] 마우스로 박스를 클릭하고 드래그하여 텍스트 위치를 변경할 수 있음
- [ ] 모바일 환경(터치 에뮬레이션)에서 박스를 터치하고 드래그하여 텍스트 위치를 변경할 수 있음
- [ ] 모바일에서 박스 드래그 시 페이지 스크롤이 발생하지 않음
- [ ] 데스크탑에서 박스 드래그 시 배경 이미지가 이동하지 않음

### 코드 품질

- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 위반 없음
- [ ] `CouponEmbeddingSettings` 인터페이스의 `left`, `top` 속성을 정확히 사용함
- [ ] 이미지 스케일링 고려: display 좌표와 실제 이미지 좌표 간 변환 정확함

### 테스트 및 검증

- [ ] 데스크탑 브라우저에서 마우스 드래그 테스트 통과
- [ ] Chrome 개발자 도구 터치 에뮬레이션 테스트 통과
- [ ] 브라우저 콘솔에 에러 메시지 없음
- [ ] 빌드 성공 (npm run build)

### 사용자 경험

- [ ] 드래그 시작 시 박스 배경색이 변경되어 명확한 시각적 피드백 제공
- [ ] 드래그 중 커서가 `grabbing`으로 변경됨
- [ ] 호버 시 박스 배경색이 변경됨
- [ ] 데스크탑과 모바일에서 동일한 드래그 경험 제공

## 실행 순서 요약

1. 실행 환경 설정 확인 (Node.js, npm 버전 확인)
2. 액션 1: 현재 PreviewCanvasComponent.tsx 파일 읽기 → 정보 수집 완료
3. 액션 2: 드래그 핸들 제거 및 아웃라인 박스 렌더링 추가 → 체크포인트 1 (TypeScript 컴파일 확인)
4. 액션 3: 터치 이벤트 핸들러 추가 → 체크포인트 2 (TypeScript 컴파일 확인)
5. 액션 4: 브라우저 기본 동작 차단 로직 추가 → 체크포인트 3 (TypeScript 컴파일 확인)
6. 액션 5: 프론트엔드 개발 서버 실행 → 체크포인트 4 (개발 서버 정상 시작 확인)
7. 액션 6: 데스크탑 마우스 드래그 테스트 → 체크포인트 5 (마우스 드래그 동작 확인)
8. 액션 7: Chrome 개발자 도구 터치 에뮬레이션 테스트 → 체크포인트 6 (터치 드래그 동작 확인)
9. 액션 8: 최종 통합 테스트 및 완료 확인 → 체크포인트 7 (모든 체크리스트 확인)

**중요**: 각 체크포인트를 반드시 통과한 후 다음 액션으로 진행해야 합니다. 순서를 위반하면 이전 단계의 에러가 다음 단계로 전파되어 디버깅이 어려워지고, 특히 터치 이벤트가 정상 동작하지 않거나 브라우저 기본 동작 차단이 실패할 수 있습니다.
