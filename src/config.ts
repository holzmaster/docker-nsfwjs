export default {
	modelDir:
		process.env.MODEL_DIR ?? "node_modules/nsfwjs/dist/models/inception_v3",
	port: Number(process.env.API_PORT ?? "8080"),
	host: process.env.API_HOST ?? "0.0.0.0",
};
