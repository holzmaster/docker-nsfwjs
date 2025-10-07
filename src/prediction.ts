import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";
import type { PredictionType } from "nsfwjs";
import sharp from "sharp";

tf.enableProdMode();

// Using publicly hosted models. May fail some day because some random guy pulls down his s3 bucket
const model = await nsfwjs.load();

export async function getPrediction(
	imageBuffer: Buffer,
): Promise<PrettyPrediction> {
	const jpeg = await sharp(imageBuffer)
		.jpeg({ quality: 100 })
		.resize({
			width: 1080,
			height: 1080,
			fit: "cover",
			withoutEnlargement: true,
		})
		.toBuffer();

	let tfImage: tf.Tensor3D | tf.Tensor4D | undefined;
	try {
		tfImage = tf.node.decodeImage(jpeg, 3);
		const prediction = await model.classify(tfImage as any);
		return simplifyPrediction(prediction);
	} finally {
		tfImage?.dispose();
	}
}

type Prediction = PredictionType[];

export interface PrettyPrediction {
	neutral: number;
	drawing: number;
	porn: number;
	sexy: number;
	hentai: number;
}

function simplifyPrediction(prediction: Prediction): PrettyPrediction {
	// using undefined instead of -1 because this will omit unset fields in JSON responses
	const result: Partial<PrettyPrediction> = {
		neutral: undefined,
		drawing: undefined,
		porn: undefined,
		sexy: undefined,
		hentai: undefined,
	};

	for (const p of prediction) {
		const key = p.className.toLowerCase() as keyof PrettyPrediction;
		result[key] = p.probability;
	}

	return result as PrettyPrediction;
}
