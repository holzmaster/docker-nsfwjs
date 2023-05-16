import { resolve } from "node:path";

import fastify from "fastify";
import multipart from "@fastify/multipart";
import serveStatic from "@fastify/static";

import config from "./config.js";
import { routes } from "./routes.js";

const fastifyServer = fastify({
	bodyLimit: 1048576 * 100,
});

fastifyServer.register(multipart, {
	addToBody: true,
	sharedSchemaId: "#sharedSchema",
});

// Crappy but working solution. Loading models only seems to be stable when using HTTP, not file://
// https://github.com/infinitered/nsfwjs/discussions/738#discussioncomment-5792593
fastifyServer.register(serveStatic, {
	root: resolve(config.modelDir),
	prefix: "/model/",
});

fastifyServer.register(routes);

await fastifyServer.listen({ port: config.port, host: config.host });

function closeGracefully(signal: string) {
	console.log(`Received ${signal}. Closing gracefully...`);
	fastifyServer.close().then(
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

await fastifyServer.ready();

console.log("Server started 🚀");
