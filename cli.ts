#!/usr/bin/env bun
// deno-lint-ignore-file no-explicit-any

import process from "node:process";
const $ = Bun.$

const pkg = (await import("./package.json")).default;
const [subcmd, ...args] = process.argv.slice(2);

console.log("")
console.log(`  ${pkg.name} ${pkg.version}`)
console.log("")
console.log(`  pkg: ${import.meta.dirname}`)
console.log(`  cwd: ${process.cwd()}`)
console.log(`  bin: ${await $`which debuno`.text()}`)

// console.log(`  ${pkg.homepage}`)
// console.log(`  ${pkg.description}`)
console.log("  ------------------------------------------")
console.log("")


if (subcmd === 'check') {
	await $`sh ${import.meta.dirname}/scripts/check.sh`
	process.exit()
}

if (subcmd === 'reinstall') {
	await $`sh ${import.meta.dirname}/scripts/reinstall.sh`.cwd(`${import.meta.dirname}/scripts`)
	process.exit()
}

if (subcmd === 'init') {
	const dest  = args[0] || "debuno-dev"
	await $`bun create debuno-dev ${dest}`.env({
		BUN_CREATE_DIR: `${import.meta.dirname}/.bun-create`
	})
	await $`sh ${import.meta.dirname}/scripts/link.sh`.cwd(dest)
	process.exit()
}

if (subcmd === 'link') {
	await $`sh ${import.meta.dirname}/scripts/link.sh`
	process.exit()
}

if (subcmd === 'unlink') {
	await $`sh ${import.meta.dirname}/scripts/unlink.sh`
	process.exit()
}

if (subcmd === 'dev') {
	await $`bun run dev`.nothrow()
	process.exit()
}

if (subcmd === 'start') {
	await $`bun run start`.nothrow()
	process.exit()
}

if (subcmd === '--version' || args[0] === '-v') {
	console.log(pkg.version)
	process.exit()
}

if (!args.length) {
	console.log(`	Usage: debuno [runtime] [...options]`)
	console.log(`	Example: debuno node --watch index.ts`)
	process.exit()
}

await $`sh ${import.meta.dirname}/scripts/run.sh ${subcmd} ${args.join(" ")}`.cwd(`${import.meta.dirname}/scripts`)
process.exit()



const deno = (await $`deno -V`.text()).slice(5).trim();
const bun = Bun.version;
const node = (await $`node --version`.text()).slice(1).trim();

const versions: any = {
	deno,
	bun,
	node
}

const validRuntimes = ['deno', 'bun', 'node']
const runtime = validRuntimes.includes(subcmd) ? subcmd : null
const rest = args

if (!args.length) {
	console.log(`	Usage: debuno [runtime] [...options]`)
	console.log(`	Example: debuno node --watch index.ts`)
	process.exit()
}

// if (validRuntimes.includes(runtime) === false) {
// 	console.log(`	Usage: debuno [runtime] [...options]`)
// 	console.log(`	Example: debuno node --watch index.ts`)
// 	process.exit()
// }

const runtimeVersion = versions[runtime as any]
console.log(`${runtime} ${runtimeVersion}`)
console.log(rest)

try {
	switch(runtime) {
		case 'deno':
			await $`deno -A ${rest.join(" ")}`
			break
		case 'bun':
			// await $`bun --preload ${import.meta.resolve("./bun/index.ts")} ${rest.join(" ")}`
			break
		case 'node':
			await $`node --import ${import.meta.resolve("./node/index.js")} ${rest.join(" ")}`
			break
		default:
			throw new Error(`Invalid runtime!!: ${runtime}`)
	}

} catch (e: any) {
	console.log(e)
	// console.log(e.info.stderr.toString())
}