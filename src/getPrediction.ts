import * as tf from "@tensorflow/tfjs-node";
import { load as loadNsfwJs } from "nsfwjs";
import sharp from "sharp";

tf.enableProdMode();

// Using publicly hosted models. May fail some day because some random guy pulls down his s3 bucket
const model = await loadNsfwJs();

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

	let tfImage;
	try {
		tfImage = tf.node.decodeImage(jpeg, 3);
		const prediction = await model.classify(tfImage);
		console.log(prediction);
		return prediction;
	} finally {
		if (tfImage) {
			tfImage.dispose();
		}
	}
}
