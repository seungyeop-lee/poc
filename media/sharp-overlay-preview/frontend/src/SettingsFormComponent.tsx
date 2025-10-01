import React from "react";
import type { CouponEmbeddingSettings } from "./types";

interface Props {
	settings: CouponEmbeddingSettings;
	text: string;
	onSettingsChange: (settings: CouponEmbeddingSettings) => void;
	onTextChange: (text: string) => void;
	imageDimensions?: { width: number; height: number } | null;
}

export const SettingsFormComponent: React.FC<Props> = ({
	settings,
	text,
	onSettingsChange,
	onTextChange,
	imageDimensions,
}) => {
	const maxLeft = imageDimensions?.width || 2000;
	const maxTop = imageDimensions?.height || 2000;
	const handleChange = (
		key: keyof CouponEmbeddingSettings,
		value: string | number,
	) => {
		onSettingsChange({ ...settings, [key]: value });
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Text
					</label>
					<input
						type="text"
						placeholder="Text"
						value={text}
						onChange={(e) => onTextChange(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
					/>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Left: {settings.left}px
						</label>
						<div className="flex flex-wrap gap-2 items-center">
							<button
								type="button"
								onClick={() => handleChange("left", settings.left - 10)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								-10
							</button>
							<button
								type="button"
								onClick={() => handleChange("left", settings.left - 1)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								-1
							</button>
							<input
								type="range"
								min="0"
								max={maxLeft}
								value={settings.left}
								onChange={(e) => handleChange("left", Number(e.target.value))}
								className="flex-1 min-w-[120px]"
							/>
							<button
								type="button"
								onClick={() => handleChange("left", settings.left + 1)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								+1
							</button>
							<button
								type="button"
								onClick={() => handleChange("left", settings.left + 10)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								+10
							</button>
							<input
								type="number"
								value={settings.left}
								onChange={(e) => handleChange("left", Number(e.target.value))}
								className="w-20 px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Top: {settings.top}px
						</label>
						<div className="flex flex-wrap gap-2 items-center">
							<button
								type="button"
								onClick={() => handleChange("top", settings.top - 10)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								-10
							</button>
							<button
								type="button"
								onClick={() => handleChange("top", settings.top - 1)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								-1
							</button>
							<input
								type="range"
								min="0"
								max={maxTop}
								value={settings.top}
								onChange={(e) => handleChange("top", Number(e.target.value))}
								className="flex-1 min-w-[120px]"
							/>
							<button
								type="button"
								onClick={() => handleChange("top", settings.top + 1)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								+1
							</button>
							<button
								type="button"
								onClick={() => handleChange("top", settings.top + 10)}
								className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
							>
								+10
							</button>
							<input
								type="number"
								value={settings.top}
								onChange={(e) => handleChange("top", Number(e.target.value))}
								className="w-20 px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
							/>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Font Size
						</label>
						<input
							type="number"
							placeholder="Font Size"
							value={settings.fontSize}
							onChange={(e) => handleChange("fontSize", Number(e.target.value))}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Font Color
						</label>
						<div className="flex gap-2 items-center">
							<input
								type="color"
								value={settings.fontColor}
								onChange={(e) => handleChange("fontColor", e.target.value)}
								className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
							/>
							<input
								type="text"
								placeholder="Font Color"
								value={settings.fontColor}
								onChange={(e) => handleChange("fontColor", e.target.value)}
								className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Font Family
						</label>
						<input
							type="text"
							placeholder="Font Family"
							value={settings.fontFamily}
							onChange={(e) => handleChange("fontFamily", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Font Weight
						</label>
						<select
							value={settings.fontWeight}
							onChange={(e) => handleChange("fontWeight", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
						>
							<option value="normal">Normal (400)</option>
							<option value="bold">Bold (700)</option>
							<option value="lighter">Lighter (300)</option>
							<option value="bolder">Bolder (900)</option>
							<option value="100">100</option>
							<option value="200">200</option>
							<option value="300">300</option>
							<option value="400">400</option>
							<option value="500">500</option>
							<option value="600">600</option>
							<option value="700">700</option>
							<option value="800">800</option>
							<option value="900">900</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};
