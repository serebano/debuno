// deno-lint-ignore-file no-explicit-any
import process from "node:process";

import * as fs from "./fs.ts";
// import * as url from "./url.ts";
// import * as path from "./path.ts";

import { NativeLoader } from "./loader.ts";
import { findWorkspace } from "./shared_cross.ts";
import type { WasmWorkspace, WasmWorkspaceResolver } from "../wasm/loader.generated.js";
import { type InfoOptions, type ModuleEntryEsm, type ModuleEntryJson, type ModuleEntryNode, type ModuleEntryNpm } from './ModuleStore.ts'
import { statSync } from "node:fs";
import { cache, cacheSync } from "./cache.ts";
import { DEBUG } from "./debug.ts";

export {
    esbuildResolutionToURL,
    urlToEsbuildResolution,
    isInNodeModules,
    isNodeModulesResolution,
    isHttpOrHttps,
    isLocal,
    BUILTIN_NODE_MODULES,
    isBun,
    isDeno,
    isNode,
    RUNTIME
} from "./shared_cross.ts";

export * as fs from "./fs.ts";
export * as url from "./url.ts";
export * as path from "./path.ts";


// console.log({
//     yellow: Bun.color("yellow", "ansi"),
//     cyan: Bun.color("cyan", "ansi"),
//     gray: Bun.color("gray", "ansi"),
//     white: Bun.color("white", "ansi"),
// })
export const log = (...args: any[]) => {
    const DEBUG = process.env.DEBUG === "1" || process.env.DEBUG === "true";
    if (!DEBUG) return
    const color = log.color
    switch (args.length) {
        case 2: {
            const [a, b] = args
            console.log(
                `${color.yellow}[${a}]${color.gray}`,
                b
            )
            break
        }
        case 3: {
            const [a, b, c] = args
            console.log(
                `${color.yellow}[${a}]`,
                `${color.cyan}[${b}]${color.gray}`,
                c
            )
            break
        }
        case 4: {
            const [a, b, c, d] = args
            console.log(
                `${color.yellow}[${a}]`,
                `${color.cyan}[${b}]`,
                `${color.white}${c}${color.gray}`,
                d
            )
            break
        }
        default: {
            console.log(...args)
        }

    }

}

log.color = {
    yellow: "\u001B[38;2;255;255;0m",
    cyan: "\u001B[38;2;0;255;255m",
    gray: "\u001B[38;2;128;128;128m",
    white: "\u001B[38;2;255;255;255m",
}

log("DEBUG", DEBUG)


export class InitOptions {
    static cwd: string = process.cwd();
    static config: string | undefined;
    static lock: string | undefined;
    static entryPoints: string[] | string | undefined;
    static nodeModulesDir: "auto" | "manual" | "none" | undefined = 'auto';
    static importMap: string | undefined;
}

export default createApi()

export function createApi(options = InitOptions) {
    options = Object.assign(InitOptions, options);

    const { cwd, config, lock, entryPoints, importMap } = options

    const importMapValue: unknown | undefined = importMap
        ? fs.readJSONFileSync(importMap)
        : undefined;

    const workspace: WasmWorkspace = findWorkspace(cwd, entryPoints, config);
    const nodeModulesDir = options.nodeModulesDir || workspace.node_modules_dir() as "auto" | "manual" | "none";
    const resolver: WasmWorkspaceResolver = workspace.resolver(importMap, importMapValue);
    const infoOptions: InfoOptions = { cwd, config, lock, importMap, nodeModulesDir }
    const loader = new NativeLoader({ infoOptions });

    // workspace.free() 
    // resolver.free()
    const mappedImports: Record<string, string> = {}
    const trackedImports: Record<string, number> = {}
    const eventListeners: Record<string, ((e: any) => void)[]> = {}

    const api = {
        options,
        workspace,
        resolver,
        loader,
        mappedImports,
        trackedImports,
        nodeModulesDir,
        async dispatchEvent(eventName: string, data: any) {
            const listeners = eventListeners[eventName]
            if (!listeners) return
            for (const listener of listeners) {
                await listener(data)
            }
        },
        addEventListener(type: string, listener: (e: any) => void) {
            if (!eventListeners[type])
                eventListeners[type] = []
            eventListeners[type].push(listener)
        },
        get eventNames() {
            return Object.keys(eventListeners)
        },
        get lockPath() {
            return workspace.lock_path()
        },
        resolve(specifier: string, importer: string) {
            return resolver.resolve(specifier, importer)
        },
        clear() {
            return loader.clear()
        },
        getJSFile(specifier: string) {
            const entry = loader.moduleStore.get(specifier)
            if ('error' in entry) {
                throw new Error(entry.error)
            }
            const isJS = entry.kind === 'esm' && (entry.mediaType === 'JavaScript' || entry.mediaType === 'Mjs')
            const isTS = entry.kind === 'esm' && (entry.mediaType === 'TypeScript' || entry.mediaType === 'TSX' || entry.mediaType === 'JSX')
            let result: string

            if (isTS) {
                if (!entry.local) throw new Error(`No local file for ${specifier}`)
                if (!entry.emit) throw new Error(`No emit file for ${specifier}`)

                const srcStat = statSync(entry.local);
                const targetStat = statSync(entry.emit, {
                    throwIfNoEntry: false,
                });
                const changed = srcStat.mtimeMs > (targetStat?.mtimeMs || 0);

                if (changed) {
                    loader.cache(specifier)
                }

                result = entry.emit
            } else if (isJS) {
                result = entry.local!
            } else {
                throw new Error(`Cannot get JS file for: ${specifier}`)
            }

            return result
        },
        info(specifier: string, importer?: string): ModuleEntryEsm | ModuleEntryJson | ModuleEntryNpm | ModuleEntryNode {
            const info = loader.info(importer ? resolver.resolve(specifier, importer) : specifier)

            if ('error' in info) {
                throw new Error(info.error)
            }

            return info
        },
        cache(specifier: string) {
            return cache(specifier)
        },
        cacheSync(specifier: string) {
            return cacheSync(specifier)
        },
        log(...args: any[]) {
            console.log(...args)
        }
        // load(specifier: string, importer: string) {
        //     const resolved = loader.resolve(new URL(api.resolve(specifier, importer)))

        //     switch (resolved.kind) {
        //         case 'esm':
        //             return loader.loadEsm(resolved.specifier)
        //         case 'npm':
        //             return loader.loadNpm(resolved.packageId)
        //         case 'node':
        //             return resolved.path
        //     }
        // },
    }


    return api
}



