#!/usr/bin/env deno -A --watch
import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";
import * as fs from "../shared/fs.ts";

import pkg from '../package.json' with { type: 'json' }

try {
	await fs.rm("./dist", { recursive: true });
} catch {
	//
}

const ctx = await esbuild.context({
	plugins: [...denoPlugins()],
	entryPoints: [
		"./index.ts",
		"./shared/api.ts",
		"./node/index.ts",
		"./node/register.ts",
	],
	bundle: true,
	outdir: "./dist",
	format: "esm",
	sourcemap: "inline",
	minify: true,
	treeShaking: true,
	splitting: true,
	banner: {
		js: `// ${pkg.name} ${pkg.version}`,
	},
});

await ctx.watch();
console.log('...watching')

// await ctx.rebuild();
// console.log(`Build Done`)
// await ctx.dispose()
