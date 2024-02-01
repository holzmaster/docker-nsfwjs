import { resolve } from "node:path";

import fastify from "fastify";
import multipart from "@fastify/multipart";
import serveStatic from "@fastify/static";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import config from "./config.js";
import routes from "./routes.js";

const server = fastify({
	bodyLimit: 1048576 * 100,
}).withTypeProvider<TypeBoxTypeProvider>();

export type ServerInstance = typeof server;

server.register(multipart, {
	attachFieldsToBody: true,
	sharedSchemaId: "#sharedSchema",
});

// Crappy but working solution. Loading models only seems to be stable when using HTTP, not file://
// https://github.com/infinitered/nsfwjs/discussions/738#discussioncomment-5792593
server.register(serveStatic, {
	root: resolve(config.modelDir),
	prefix: "/model/",
});

server.register(swagger, {
	mode: "dynamic",
	prefix: "/docs",
	openapi: {
		info: {
			title: "nsfwjs API",
			version: "3.0.0",
		},
	},
});

server.register(swaggerUi, {
	routePrefix: "/docs",
	uiConfig: {
		docExpansion: "full",
		deepLinking: false,
	},
});

server.register(routes);

await server.listen({ port: config.port, host: config.host });

function closeGracefully(signal: string) {
	console.log(`Received ${signal}. Closing gracefully...`);
	server.close().then(
		() => {
			console.log("Server closed gracefully.");
			process.kill(process.pid, signal);
		},
		(err) => {
			console.error("Error while closing server gracefully.", err);
			process.kill(process.pid, signal);
		},
	);
}

process.once("SIGINT", closeGracefully);
process.once("SIGTERM", closeGracefully);

await server.ready();

console.log("Server started 🚀");
