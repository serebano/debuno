import { cmdSync } from "./cmd.ts";
import * as fs from "./fs.ts"
import * as path from "./path.ts"

export const denoVersion = '2' //new TextDecoder().decode(cmdSync(["-V"]).stdout).split(" ")[1]

export interface RootInfoOutput {
  denoDir: string;
  npmCache: string;
  modulesCache: string;
  typescriptCache: string;
  registryCache: string
}

let tmpDir: string | undefined;

export function rootInfo(): RootInfoOutput {
  const opts = {
    args: ["info", "--json"],
    cwd: tmpDir,
    env: { DENO_NO_PACKAGE_JSON: "true" } as Record<string, string>,
  };

  const { args, ...cmdOpts } = opts;
  const output = cmdSync(args, cmdOpts);

  if (!output.success) {
    throw new Error(`Failed to call 'deno info'`);
  }

  return JSON.parse(new TextDecoder().decode(output.stdout));
}

export let ROOT_INFO_OUTPUT: RootInfoOutput // = rootInfo();

// Lifted from https://raw.githubusercontent.com/denoland/deno_graph/89affe43c9d3d5c9165c8089687c107d53ed8fe1/lib/media_type.ts
export type MediaType =
  | "JavaScript"
  | "Mjs"
  | "Cjs"
  | "JSX"
  | "TypeScript"
  | "Mts"
  | "Cts"
  | "Dts"
  | "Dmts"
  | "Dcts"
  | "TSX"
  | "Json"
  | "Wasm"
  | "TsBuildInfo"
  | "SourceMap"
  | "Unknown";

interface InfoOutput {
  roots: string[];
  modules: ModuleEntry[];
  redirects: Record<string, string>;
  npmPackages?: Record<string, NpmPackage>;
}

export type ModuleEntry =
  | ModuleEntryError
  | ModuleEntryEsm
  | ModuleEntryJson
  | ModuleEntryNpm
  | ModuleEntryNode;

export interface ModuleEntryBase {
  specifier: string;
  dependencies?: {
    specifier: string,
    code?: {
      specifier: string,
      span: {
        start: {
          line: number,
          character: number
        },
        end: {
          line: number,
          character: number
        }
      }
    },
    type?: {
      specifier: string,
      span: {
        start: {
          line: number,
          character: number
        },
        end: {
          line: number,
          character: number
        }
      }
    }
  }[]
}

export interface ModuleEntryError extends ModuleEntryBase {
  error: string;
}

export interface ModuleEntryEsm extends ModuleEntryBase {
  kind: "esm";
  local: string | null;
  emit: string | null;
  map: string | null;
  mediaType: MediaType;
  size: number;
}

export interface ModuleEntryJson extends ModuleEntryBase {
  kind: "asserted" | "json";
  local: string | null;
  mediaType: MediaType;
  size: number;
}

export interface ModuleEntryNpm extends ModuleEntryBase {
  kind: "npm";
  npmPackage: string;
}

export interface ModuleEntryNode extends ModuleEntryBase {
  kind: "node";
  moduleName: string;
}

export interface NpmPackage {
  name: string;
  version: string;
  dependencies: string[];
  registryUrl?: string;
}

export interface InfoOptions {
  cwd?: string;
  config?: string;
  importMap?: string;
  lock?: string;
  nodeModulesDir?: "auto" | "manual" | "none";
}


export function info(
  specifier: string,
  options: InfoOptions,
): InfoOutput {
  return __info__cache__(specifier, options, ["info", "--json"]);
}

export function cache(
  specifier: string,
  options: InfoOptions,
): void {
  return __info__cache__(specifier, options, ["cache"]);
}

export function clear(
  options: InfoOptions,
) {
  return __info__cache__(undefined, options, ["clean"]);
}

function __info__cache__(
  specifier: string | undefined,
  options: InfoOptions,
  args: string[],
) {

  if (!denoVersion.startsWith("1.") && args.at(0) !== "clean") {
    args.push("--allow-import");
  }
  const opts = {
    args,
    cwd: undefined as string | undefined,
    env: { DENO_NO_PACKAGE_JSON: "true" } as Record<string, string>,
  };

  if (typeof options.config === "string") {
    opts.args.push("--config", options.config);
  }
  // else {
  //   if (args.at(0) !== "clean")
  //     opts.args.push("--no-config");
  // }
  if (options.importMap) {
    opts.args.push("--import-map", options.importMap);
  }
  if (typeof options.lock === "string") {
    opts.args.push("--lock", options.lock);
  } else if (!options.cwd) {
    opts.args.push("--no-lock");
  }
  if (options.nodeModulesDir !== undefined) {
    if (denoVersion.startsWith("1.")) {
      if (options.nodeModulesDir === "auto") {
        opts.args.push("--node-modules-dir");
      } else if (options.nodeModulesDir === "manual") {
        opts.args.push("--unstable-byonm");
      }
    } else {
      opts.args.push(`--node-modules-dir=${options.nodeModulesDir}`);
    }
  }
  if (options.cwd) {
    opts.cwd = options.cwd;
  } else {
    if (!tmpDir) tmpDir = fs.makeTempDirSync();
    opts.cwd = tmpDir;
  }

  if (specifier)
    opts.args.push(specifier);

  const { args: cmdArgs, ...cmdOpts } = opts;
  const output = cmdSync(cmdArgs, cmdOpts);

  if (!output.success) {
    throw new Error(`Failed to call '${args.join(" ")}': ${new TextDecoder().decode(output.stderr)}`);
  }

  const txt = new TextDecoder().decode(output.stdout);

  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

export class ModuleStore {
  #options: InfoOptions;

  #modules: Map<string, ModuleEntry> = new Map();
  #redirects: Map<string, string> = new Map();
  #npmPackages: Map<string, NpmPackage> = new Map();

  get modules() {
    return this.#modules
  }

  constructor(options: InfoOptions = {}) {
    this.#options = options;
  }

  clear(denoCache = false) {
    this.#modules.clear();
    this.#redirects.clear();
    this.#npmPackages.clear();
    if (denoCache)
      clear(this.#options);
  }

  keys(): IterableIterator<string> {
    return this.#modules.keys();
  }

  entries(): IterableIterator<[string, ModuleEntry]> {
    return this.#modules.entries();
  }

  set(specifier: string) {
    return cache(specifier, this.#options)
  }

  get(specifier: string): ModuleEntry {
    if (!specifier) throw new Error(`Invalid specifier: "${specifier}"`)
    let entry = this.#getCached(specifier);
    if (entry !== undefined) return entry;

    this.#queueLoad(specifier);

    entry = this.#getCached(specifier);
    if (entry === undefined) {
      throw new Error(`Unreachable: '${specifier}' loaded but not reachable`);
    }
    return entry;
  }

  getNpmPackage(id: string): NpmPackage | undefined {
    return this.#npmPackages.get(id);
  }

  #resolve(specifier: string): string {
    const original = specifier;
    let counter = 0;
    while (counter++ < 10) {
      const redirect = this.#redirects.get(specifier);
      if (redirect === undefined) return specifier;
      specifier = redirect;
    }
    throw new Error(`Too many redirects for '${original}'`);
  }

  #getCached(specifier: string): ModuleEntry | undefined {
    specifier = this.#resolve(specifier);
    return this.#modules.get(specifier);
  }

  #queueLoad(specifier: string) {
    this.#load([specifier]);
  }

  #load(specifiers: string[]): void {
    this.#populate(specifiers);
    for (let specifier of specifiers) {
      specifier = this.#resolve(specifier);
      const entry = this.#modules.get(specifier);
      if (entry === undefined && specifier.startsWith("npm:")) {
        // we hit https://github.com/denoland/deno/issues/18043, so we have to
        // perform another load to get the actual data of the redirected specifier
        this.#populate([specifier]);
      }
    }
  }

  #resolveEmit<T extends ModuleEntryEsm>(module: T): T {

    if (module.kind === 'esm' && (module.mediaType === 'TypeScript' || module.mediaType === 'TSX' || module.mediaType === 'JSX')) {
      if (module.emit) return module
      if (ROOT_INFO_OUTPUT === undefined)
        ROOT_INFO_OUTPUT = rootInfo()

      const typescriptCache = ROOT_INFO_OUTPUT?.typescriptCache!
      const url = new URL(module.specifier)

      if (url.protocol === "file:") {
        module.emit = path.join(typescriptCache, 'file', url.pathname) + '.js'
      } else {

        module.emit = module.local?.replace("/remote/", "/gen/") + ".js"
      }
    }

    return module
  }

  #populate(specifiers: string[]) {
    specifiers = specifiers.filter(Boolean)

    if (!specifiers.length)
      throw new Error(`Specifiers cannot be empty`)

    let specifier;
    if (specifiers.length === 1) {
      specifier = specifiers[0];
    } else {
      specifier = `data:application/javascript,${encodeURIComponent(specifiers.map((s) => `import ${JSON.stringify(s)};`).join(""))}`;
    }

    const { modules, redirects, npmPackages } = info(specifier, this.#options);

    for (const module of modules) {
      if (specifiers.length !== 1 && module.specifier === specifier) continue;

      this.#resolveEmit(module as ModuleEntryEsm)

      this.#modules.set(module.specifier, module);
    }
    for (const [from, to] of Object.entries(redirects)) {
      this.#redirects.set(from, to);
    }

    if (npmPackages !== undefined) {
      for (const [id, npmPackage] of Object.entries(npmPackages)) {
        this.#npmPackages.set(id, npmPackage);
      }
    }
  }
}
