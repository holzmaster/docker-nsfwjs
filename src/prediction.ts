import * as tf from "@tensorflow/tfjs-node";
import { load as loadNsfwJs, type predictionType } from "nsfwjs";
import sharp from "sharp";

tf.enableProdMode();

// Using publicly hosted models. May fail some day because some random guy pulls down his s3 bucket
const model = await loadNsfwJs();

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

	let tfImage;
	try {
		tfImage = tf.node.decodeImage(jpeg, 3);
		const prediction = await model.classify(tfImage as any);
		return simplifyPrediction(prediction);
	} finally {
		tfImage?.dispose();
	}
}

type Prediction = predictionType[];

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
