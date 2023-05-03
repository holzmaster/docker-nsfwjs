import {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyRegisterOptions,
} from "fastify";

import {
	SingleMultipartForm,
	singleMultipartFormBodySchema,
} from "./useCases/single/multipartForm.js";
import {
	MultipleMultipartForm,
	multipleMultipartFormBodySchema,
} from "./useCases/multiple/multipartForm.js";

export async function routes(
	fastify: FastifyInstance,
	_opts: FastifyRegisterOptions<FastifyPluginOptions> | undefined,
) {
	fastify.post(
		"/single/multipart-form",
		{ schema: { body: singleMultipartFormBodySchema } },
		SingleMultipartForm,
	);

	fastify.post(
		"/multiple/multipart-form",
		{ schema: { body: multipleMultipartFormBodySchema } },
		MultipleMultipartForm,
	);
}
