import * as path from "node:path";
import { pathToFileURL } from "node:url";

import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";
import sharp from "sharp";

import config from "./config.js";

tf.enableProdMode();

const model = await nsfwjs.load(pathToFileURL(path.join(config.modelDir, "model.json")).toString(), { type: "graph" } as unknown as { size: number });

export async function getPrediction(imageBuffer: Buffer) {
	const jpeg = await sharp(imageBuffer)
		.jpeg({ quality: 100 })
		.resize({
			width: 1080,
			height: 1080,
			fit: "cover",
			withoutEnlargement: true,
		})
		.toBuffer();

	const tfImage = tf.node.decodeImage(jpeg, 3);

	const prediction = await model.classify(tfImage);

	tfImage.dispose();

	return prediction;
}
