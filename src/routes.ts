import {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyRegisterOptions,
} from "fastify";

import { getPrediction } from "./getPrediction.js";

type BodyEntry = {
	data: Buffer;
	filename: string;
	encoding: string;
	mimetype: string;
	limit: false;
};

export async function routes(
	fastify: FastifyInstance,
	_opts: FastifyRegisterOptions<FastifyPluginOptions> | undefined,
) {
	fastify.post(
		"/single/multipart-form",
		{
			schema: {
				body: {
					type: "object",
					properties: {
						content: {
							type: "array",
							items: {
								$ref: "#sharedSchema",
							},
						},
					},
					required: ["content"],
				},
			},
		},
		async (req, res) => {
			const image = (req.body as any).content[0] as BodyEntry;

			return res.send({
				prediction: await getPrediction(image.data),
			});
		},
	);

	fastify.post(
		"/multiple/multipart-form",
		{
			schema: {
				body: {
					type: "object",
					properties: {
						contents: {
							type: "array",
							items: {
								$ref: "#sharedSchema",
							},
						},
					},
					required: ["contents"],
				},
			},
		},
		async (req, res) => {
			const images = (req.body as any).contents as BodyEntry[];

			const predictions = await Promise.all(
				images.map(async (image) => getPrediction(image.data)),
			);

			return res.send({ predictions });
		},
	);
}
