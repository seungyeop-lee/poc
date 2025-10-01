import express from "express";
import cors from "cors";
import multer from "multer";
import { overlayText } from "./overlay.js";
import type { CouponEmbeddingSettings } from "./types.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const imageStore: Map<string, Buffer> = new Map();

app.post("/upload", upload.single("image"), (req, res) => {
	if (!req.file) {
		return res.status(400).send("No file uploaded");
	}

	const imageId = Math.random().toString(36).substr(2, 9);
	imageStore.set(imageId, req.file.buffer);

	res.json({ imageId });
});

app.post("/preview", async (req, res) => {
	const { imageId, settings, text } = req.body as {
		imageId: string;
		settings: CouponEmbeddingSettings;
		text: string;
	};

	const imageBuffer = imageStore.get(imageId);
	if (!imageBuffer) {
		return res.status(404).send("Image not found");
	}

	try {
		const result = await overlayText(imageBuffer, text, settings);
		res.type("image/png").send(result);
	} catch (error) {
		res.status(500).send("Error processing image");
	}
});

app.post("/download", async (req, res) => {
	const { imageId, settings, text } = req.body as {
		imageId: string;
		settings: CouponEmbeddingSettings;
		text: string;
	};

	const imageBuffer = imageStore.get(imageId);
	if (!imageBuffer) {
		return res.status(404).send("Image not found");
	}

	try {
		const result = await overlayText(imageBuffer, text, settings);
		res.type("image/png").send(result);
	} catch (error) {
		res.status(500).send("Error processing image");
	}
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
