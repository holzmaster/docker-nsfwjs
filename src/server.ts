import fastify from "fastify";
import multipart from "@fastify/multipart";
import config from "./config.js";

import { routes } from "./routes.js";

const fastifyServer = fastify({
	bodyLimit: 1048576 * 100,
});

fastifyServer.register(multipart, {
	addToBody: true,
	sharedSchemaId: "#mySharedSchema",
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
