import type { ServerInstance } from "./server.js";
import { getPrediction } from "./getPrediction.js";
import { Type } from "@fastify/type-provider-typebox";

type BodyEntry = {
	data: Buffer;
	filename: string;
	encoding: string;
	mimetype: string;
	limit: false;
};

const MultipartContent = Type.Unsafe({ $ref: "#sharedSchema" })

export async function routes(fastify: ServerInstance) {
	fastify.post(
		"/single/multipart-form",
		{
			schema: {
				body: Type.Object({
					content: Type.Array(MultipartContent),
				}),
			},
		},
		async (req, res) => {
			const image = (req.body as any).content[0] as BodyEntry;

			try {
				return res.send({
					prediction: await getPrediction(image.data),
				});
			} catch (err) {
				console.error(err);
				return res.status(500).send({ error: "Internal Server Error" });
			}
		},
	);

	fastify.post(
		"/multiple/multipart-form",
		{
			schema: {
				body: Type.Object({
					content: Type.Array(MultipartContent),
				}),
			},
		},
		async (req, res) => {
			const images = (req.body as any).contents as BodyEntry[];

			const predictions = await Promise.all(
				images.map(async (image) => getPrediction(image.data)),
			);

			try {
				return res.send({ predictions });
			} catch (err) {
				console.error(err);
				return res.status(500).send({ error: "Internal Server Error" });
			}
		},
	);
}
