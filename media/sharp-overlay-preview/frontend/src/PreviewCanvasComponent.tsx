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
