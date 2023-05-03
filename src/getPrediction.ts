import { pathToFileURL } from "node:url";

import * as tf from "@tensorflow/tfjs-node";
import { load as loadNsfwJs, type NSFWJS } from "nsfwjs";
import sharp from "sharp";

import config from "./config.js";

tf.enableProdMode();

const modelUrl = `http://localhost:${config.port}/model/model.json`;

let modelPromise: null | Promise<NSFWJS> = null;

export async function getPrediction(imageBuffer: Buffer) {
	if (modelPromise === null) {
		modelPromise = loadNsfwJs(modelUrl, { type: "graph" } as unknown as {
			size: number;
		});
	}

	const model = await modelPromise;

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
