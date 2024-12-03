import { utimesSync, closeSync, openSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";

export function cache(specifier: string) {
	return new Promise((resolve, reject) => {
		const start = Date.now();

		const res = spawn("deno", ["cache", "--allow-import", specifier], {
			stdio: "inherit",
		});

		res.on("close", (code) => {
			const took = Date.now() - start;
			console.log("$", "cache", specifier, took, "ms");
			resolve(code);
		});

		res.on("error", (err) => {
			const took = Date.now() - start;
			console.error("$", "cache", specifier, took, "ms");
			reject(err);
		});
	});
}

export function cacheSync(specifier: string) {
	const start = Date.now();

	const res = spawnSync("deno", ["cache", "--allow-import", specifier], {
		stdio: "inherit",
	});

	const took = Date.now() - start;
	console.log("$", "cacheSync", specifier, took, "ms");

	if (res.status !== 0) {
		throw new Error(res.stderr.toString());
	}
}

export function clean() {
	return new Promise((resolve, reject) => {
		const res = spawn("deno", ["clean"], {
			stdio: "inherit",
		});
		res.on("close", (code) => {
			resolve(code);
		});
		res.on("error", (err) => {
			reject(err);
		});
	});
}

export function touch(filename: string) {
	const time = new Date();

	try {
		utimesSync(filename, time, time);
	} catch (err) {
		console.log("touch error", err);
		closeSync(openSync(filename, "w"));
	}
}
