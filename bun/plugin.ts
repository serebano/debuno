/// <reference path="../node_modules/bun-types/index.d.ts" />
// deno-lint-ignore-file no-explicit-any

import type { BunPlugin, PluginBuilder } from "bun";
import api, { BUILTIN_NODE_MODULES, esbuildResolutionToURL, isHttpOrHttps, isNodeModulesResolution, urlToEsbuildResolution, fs, path, log, url, isInNodeModules } from "../shared/api.ts";
import { pathToFileURL } from "../shared/url.ts";
import process from "node:process";
import { DEBUG } from "../shared/debug.ts";


function patchBuilder(builder: PluginBuilder, api: { before: (type: 'resolve' | 'load', obj: any) => void, after: (type: 'resolve' | 'load', obj: any) => void }) {
	const { onResolve, onLoad } = builder;

	let resolveIndex = 0
	builder.onResolve = (constraints: any, callback: any) => onResolve(constraints, (args) => {
		args = { ...args }
		if (constraints.namespace)
			args.namespace = constraints.namespace

		if (api.before) api.before('resolve', { args })
		const result = callback(args, builder)
		resolveIndex++
		if (api.after && result) {
			api.after('resolve', {
				index: resolveIndex,
				specifier: (args.namespace !== 'file' ? args.namespace + ":" : "") + args.path,
				resolved: result, //esbuildResolutionToURL(result).href,
				importer: args.importer
			})
		}
		return result
	});

	let loadIndex = 0
	builder.onLoad = (constraints: any, callback: any) => onLoad(constraints, async (args) => {
		args = { ...args }

		if (constraints.namespace)
			args.namespace = constraints.namespace

		if (api.before) api.before('load', { args })
		const result = await callback(args, builder)
		loadIndex++
		if (api.after) {
			api.after('load', {
				index: loadIndex,
				specifier: esbuildResolutionToURL(args).href,
				...result
			})
		}
		return result
	});

}
export const modulesMap = new Map<string, string>()

export default function pluginImportResoltion({ generated }: { generated?: boolean } = {}): BunPlugin {
	return {
		name: "debuno-import-resolution",
		// target: "bun",
		setup(builder) {
			// if (DEBUG) {
			// 	console.log('pluginImportResoltion', { DEBUG })

			// 	fs.writeJSONFileSync('./preload.json', [])
			// 	fs.writeJSONFileSync('./resolved.json', {})
			// 	fs.writeJSONFileSync(`./preload.resolve.json`, [])
			// 	fs.writeJSONFileSync(`./preload.load.json`, [])
			// }

			patchBuilder(builder, {
				before(type, { args }) {
					if (!DEBUG) return
					switch (type) {
						case 'resolve':
							log(type, args.namespace, args.path, args.importer)
							break;
						case 'load':
							log(type, args.namespace, args.path)
							break;
					}
				},
				after(type, obj) {
					if (!DEBUG) return;
					const path = `./preload.${type}.json` as const
					const json = fs.readJSONFileSync(path, [] as any[])
					switch (type) {
						case 'resolve': {
							log(type, obj)
							json.push(obj)
						}
							break;
						case 'load': {
							log(type, { ...obj, contents: '' })
							json.push({ ...obj, contents: obj?.contents?.toString() }) // { ...obj, contents: new TextDecoder().decode(obj.contents) }
						}
							break;
					}
					fs.writeJSONFileSync(`./preload.${type}.json`, json)
				}
			});

			const isRelOrAbs = (path: string) => path.startsWith('.') || path.startsWith('/')

			const packageIdByNodeModules = new Map<string, string>();
			const nodeModulesDirOpt = api.nodeModulesDir
			let nodeModulesDir: string | null = null;

			if (nodeModulesDirOpt === "auto" || nodeModulesDirOpt === "manual") {
				nodeModulesDir = path.join(api.options.cwd, "node_modules");
			}


			function mapModule(specifier: string, resolved: string) {
				if (modulesMap.has(specifier) || specifier === 'bun')
					return

				modulesMap.set(specifier, resolved)

				builder.module(specifier, () => ({
					loader: 'js',
					contents: `export * from "${resolved}"`
				}))
			}

			// resolve
			function resolve(args: {
				path: string,
				namespace: string,
				importer: string,
			}) {
				// throw new Error(JSON.stringify(args))
				// console.log('~ resolve', args)
				if (args.importer === 'bun:main' || args.importer === process.argv[1]) {
					api.cacheSync(args.path)
				}

				if (isNodeModulesResolution(args)) {
					if (
						BUILTIN_NODE_MODULES.has(args.path) ||
						BUILTIN_NODE_MODULES.has("node:" + args.path)
					) {
						return {
							path: args.path,
							external: true,
						};
					}

					if (nodeModulesDir !== null) {
						return undefined;
					}
				}

				if (args.namespace === 'file' && isHttpOrHttps(args.importer)) {
					return urlToEsbuildResolution(new URL(args.path, args.importer))
				}

				if (args.namespace === 'file' && isRelOrAbs(args.path)) {
					try {
						const importer = args.importer
						const referrer = importer === 'bun:main'
							? pathToFileURL(api.options.cwd).href
							: pathToFileURL(importer).href

						const info = api.info(args.path, referrer)

						if (info.dependencies) {
							const map = info.dependencies
								.filter(i => !isRelOrAbs(i.specifier) && (i.specifier !== i.code?.specifier) && i.specifier !== i.type?.specifier)
								.map(i => [i.specifier, i.code?.specifier || i.type?.specifier])

							map.forEach((i: any) => mapModule.apply(null, i))
						}
					} catch (e: any) {
						console.log('	map', args, e.message)
					}
				}

				if (!args.namespace || args.namespace === 'file') {
					return undefined
				}

				try {
					const specifier = esbuildResolutionToURL(args);
					const resolved = api.loader.resolve(specifier);

					switch (resolved.kind) {
						case "npm": {
							let resolveDir: string;
							if (nodeModulesDir !== null) {
								resolveDir = nodeModulesDir;
							} else {
								resolveDir = api.loader.nodeModulesDirForPackage(resolved.packageId);
								packageIdByNodeModules.set(resolveDir, resolved.packageId);
							}
							const path = `${resolved.packageName}${resolved.path ?? ""}`;
							const resolvedPath = (Bun.resolveSync(path, resolveDir))
							console.log("RR", { path, resolvedPath })
							return undefined

							return {
								path: resolvedPath,
								namespace: 'file',
								external: true
							}
						}
						case "esm": {
							return urlToEsbuildResolution(resolved.specifier);
						}
						case "node": {
							return {
								path: resolved.path,
								external: true,
							};
						}
					}
				} catch (e: any) {
					console.error(e.message)
					return undefined
				}
			}

			async function load(args: { namespace: string, path: string }, _builder: PluginBuilder) {
				// if (args.namespace === "file" && isInNodeModules(args.path)) {
				// 	return {
				// 		contents: await fs.readFile(args.path),
				// 		loader: "js"
				// 	};
				// }

				// if (args.namespace === 'file') {
				// 	const contents = replaceImports(await fs.readTextFile(args.path))
				// 	// console.log('\n\n', args.path, '\n\n', contents, '\n\n')
				// 	return {
				// 		contents,
				// 		loader: 'tsx',

				// 	}
				// }

				const specifier = esbuildResolutionToURL(args);
				const result = await api.loader.loadEsm(specifier, generated);

				// if (result?.loader === 'tsx' && args.namespace === 'files') {
				// 	const contents = new TextDecoder().decode(result.contents as BufferSource)
				// 	console.log('replaceImports', args.path)
				// 	return {
				// 		contents: replaceImports(contents),
				// 		loader: 'tsx'
				// 	}
				// }

				return result || null
			}

			// resolve
			builder.onResolve({ filter: /.*/, namespace: 'jsr' }, resolve);
			builder.onResolve({ filter: /.*/, namespace: 'npm' }, resolve);
			builder.onResolve({ filter: /.*/, namespace: 'node' }, resolve);
			builder.onResolve({ filter: /.*/, namespace: 'file' }, resolve);
			// builder.onResolve({ filter: /.*/ }, resolve);


			// load
			builder.onLoad({ filter: /.*/, namespace: 'http' }, load as any);
			builder.onLoad({ filter: /.*/, namespace: 'https' }, load as any);
			builder.onLoad({ filter: /.*/, namespace: 'npm' }, load as any);

		},
	}
}
