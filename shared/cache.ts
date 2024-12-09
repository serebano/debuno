import { utimesSync, closeSync, openSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import process from "node:process";
import logger from "./logger.ts";

export function cache(specifier: string) {
	return new Promise((resolve, reject) => {
		const start = Date.now();

		const args = ["cache", "--no-lock", "--allow-import"]
		const argv = process.argv.splice(2)
		if (argv.length) {
			args.push(...argv)
		}

		const res = spawn("deno", [...args, specifier], {
			stdio: "inherit",
		});

		res.on("close", (code) => {
			const took = Date.now() - start;
			logger.log("$", ...args, specifier, took, "ms");
			resolve(code);
		});

		res.on("error", (err) => {
			const took = Date.now() - start;
			logger.error("$", ...args, specifier, took, "ms");
			reject(err);
		});
	});
}

export function cacheSync(specifier: string) {
	const start = Date.now();

	const args = ["cache", "--no-lock", "--allow-import"]
	const argv = process.argv.splice(2)
	if (argv.length) {
		args.push(...argv)
	}

	const res = spawnSync("deno", [...args, specifier], {
		stdio: "inherit",
	});

	const took = Date.now() - start;

	logger.log("$", ...args, specifier, took, "ms");

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
	const time = new Date()
	try {
		utimesSync(filename, time, time);
	} catch (err) {
		logger.log("touch error", err);
		closeSync(openSync(filename, "w"));
	}
}
