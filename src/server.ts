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

console.log("Server started 🚀");

process.on("SIGINT", () => handleOnSignal("SIGINT"));
process.on("SIGHUP", () => handleOnSignal("SIGHUP"));
function handleOnSignal(signal: NodeJS.Signals) {
	console.log(`closing due to ${signal} signal`);
	fastifyServer.close().then(() => process.exit());
}
