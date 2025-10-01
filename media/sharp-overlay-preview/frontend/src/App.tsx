import { useState } from "react";
import { ImageUploadComponent } from "./ImageUploadComponent";
import { SettingsFormComponent } from "./SettingsFormComponent";
import { PreviewCanvasComponent } from "./PreviewCanvasComponent";
import type { CouponEmbeddingSettings } from "./types";

function App() {
	const [imageId, setImageId] = useState<string | null>(null);
	const [text, setText] = useState<string>("Sample Text");
	const [settings, setSettings] = useState<CouponEmbeddingSettings>({
		left: 50,
		top: 50,
		fontSize: 24,
		fontColor: "#000000",
		fontFamily: "Arial",
		fontWeight: "bold",
	});
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const handleDownload = async () => {
		if (!imageId) return;

		const response = await fetch("http://localhost:3001/download", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ imageId, settings, text }),
		});

		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "coupon.png";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
			<div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
					Coupon Text Overlay
				</h1>
				<ImageUploadComponent onUpload={setImageId} />
				<SettingsFormComponent
					settings={settings}
					text={text}
					onSettingsChange={setSettings}
					onTextChange={setText}
					imageDimensions={imageDimensions}
				/>
				<PreviewCanvasComponent
					imageId={imageId}
					settings={settings}
					text={text}
					onSettingsChange={setSettings}
					onImageDimensionsChange={setImageDimensions}
				/>
				<button
					type="button"
					onClick={handleDownload}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
				>
					Download
				</button>
			</div>
		</div>
	);
}

export default App;
