import { type Static, Type } from "@fastify/type-provider-typebox";

import type { ServerInstance } from "./server.js";
import { getPrediction } from "./prediction.js";

const MultipartContent = Type.Unsafe({ $ref: "#sharedSchema" })
type BodyEntry = {
	data: Buffer;
	filename: string;
	encoding: string;
	mimetype: string;
	limit: false;
};

const PredictionType = Type.Object({
	neutral: Type.Number(),
	drawing: Type.Number(),
	porn: Type.Number(),
	sexy: Type.Number(),
	hentai: Type.Number(),
});

export type Prediction = Static<typeof PredictionType>;

const ErrorResponseType = Type.Object({
	error: Type.String(),
});

export default async function routes(fastify: ServerInstance) {
	fastify.get("/_health", async () => {
		return { status: "ok" };
	});

	fastify.post(
		"/classify",
		{
			schema: {
				body: Type.Object({
					content: Type.Array(MultipartContent),
				}),
				response: {
					200: Type.Object({
						prediction: PredictionType,
					}),
					500: ErrorResponseType,
				},
			},
		},
		async (req, res) => {
			const image = req.body.content[0] as BodyEntry;

			try {
				const prediction = await getPrediction(image.data);
				return res.send({ prediction });
			} catch (err) {
				console.error(err);
				return res.status(500).send({ error: "Internal Server Error" });
			}
		},
	);
}
