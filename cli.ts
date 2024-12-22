#!/usr/bin/env bun
const $ = Bun.$
const deno = (await $`deno -V`.text()).slice(5).trim();
const bun = Bun.version;
const node = (await $`node --version`.text()).slice(1).trim();
const pkg = (await import("./package.json")).default;
const args = process.argv.slice(2);
if (args[0] === '--version' || args[0] === '-v') {
	console.log(pkg.version)
	process.exit()
}
const [runtime, ...rest] = args;
const versions: any = {
	deno,
	bun,
	node
}
const validRuntimes = ['deno', 'bun', 'node']
const debunoMod = './index.js' // debuno

if (!args.length) {
	console.log({
		version: pkg.version,
		runtime: {
			deno: [pkg.engines.deno, deno],
			bun: [pkg.engines.bun, bun],
			node: [pkg.engines.node, node],
		},

	});
	process.exit()
}

if (validRuntimes.includes(runtime) === false) {
	console.log(`	Usage: debuno [runtime] [...options]`)
	console.log(`	Example: debuno node --watch index.ts`)
	process.exit()
}

const runtimeVersion = versions[runtime]

console.log(`${runtime} ${runtimeVersion}`)
console.log(rest)

//  rest.map((arg, idx, arr) => {
// 	if (arg.startsWith('-')) {
// 		return arg
// 	} else if (typeof arg === 'string') {
// 		if (arr[idx - 1] === '-e')
// 			return `"${arg}"`
// 		return arg
// 	}
// })


try {
	if (runtime === "node") {
		// rest.unshift("--import", "debuno");
		await $`node "${rest.join(" ")}"`

	} else if (runtime === "bun") {
		// rest.unshift("--preload", "debuno");
		await $`bun --preload ${debunoMod} ${rest.join(" ")}`

	} else if (runtime === "deno") {
		// rest.unshift("-A");
		await $`deno -A ${rest.join(" ")}`

	} else {
		throw new Error(`Invalid runtime!!: ${runtime}`)
	}

} catch (e: any) {
	console.log(`debuno error`)
	// console.log(e.info.stderr.toString())
}

// const cmd = `${runtime} ${rest.join(" ")}`.trim()
// await $`${runtime} ${rest.join(" ")}`;



// await $`$(${cmd})`
