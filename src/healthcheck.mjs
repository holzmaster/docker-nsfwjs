#!/usr/bin/env node

const port = Number(process.env.API_PORT ?? 8080);

let res;
try {
	res = await fetch(`http://127.0.0.1:${port}/_health`);
} catch (e) {
	console.error("Service is down");
	console.error(e);
	process.exit(1);
}
if (!res.ok) {
	console.error("Service is down");
	console.error(res);
	process.exit(1);
}
process.exit(0);
