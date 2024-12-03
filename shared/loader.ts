// deno-lint-ignore-file no-explicit-any
import type * as bun from "bun";
import { join } from "node:path";
import { lastIndexOfNeedle } from "./bytes.ts";
import { rootInfo, InfoOptions, ModuleStore, NpmPackage, type RootInfoOutput } from "./ModuleStore.ts";
import {
  type Loader,
  type LoaderResolution,
  mapContentType,
  mediaTypeFromSpecifier,
  mediaTypeToLoader,
  parseNpmSpecifier,
} from "./shared_cross.ts";
import * as fs from "./fs.ts"

export let ROOT_INFO_OUTPUT: RootInfoOutput | undefined;

export const DENO_CACHE_METADATA = new TextEncoder()
  .encode("\n// denoCacheMetadata=");

export interface NativeLoaderOptions {
  infoOptions?: InfoOptions;
}

export class NativeLoader implements Loader {
  #nodeModulesDirManual: boolean;
  #moduleStore: ModuleStore;
  #linkDirCache: Map<string, string> = new Map(); // mapping from package id -> link dir

  constructor(options: NativeLoaderOptions) {
    this.#nodeModulesDirManual = options.infoOptions?.nodeModulesDir === "manual";
    this.#moduleStore = new ModuleStore(options.infoOptions);
  }

  resolve(specifier: URL): LoaderResolution {
    // Workaround for https://github.com/denoland/deno/issues/25903
    if (this.#nodeModulesDirManual && specifier.protocol === "npm:") {
      const npmSpecifier = parseNpmSpecifier(specifier);
      return {
        kind: "npm",
        packageId: "",
        packageName: npmSpecifier.name,
        path: npmSpecifier.path ?? "",
        specifier: specifier
      };
    }

    const entry = this.#moduleStore.get(specifier.href);

    if ("error" in entry) {
      if (
        specifier.protocol === "file:" &&
        mediaTypeFromSpecifier(specifier) === "Unknown"
      ) {
        // @ts-ignore .
        return { kind: "esm", specifier: new URL(entry.specifier), local: entry.local };
      }
      throw new Error(entry.error);
    }

    if (entry.kind === "npm") {
      // TODO(lucacasonato): remove parsing once https://github.com/denoland/deno/issues/18043 is resolved
      const parsed = parseNpmSpecifier(new URL(entry.specifier));
      const nodeModulesDirForPackage = this.nodeModulesDirForPackage.bind(this)

      return {
        kind: "npm",
        packageId: entry.npmPackage,
        packageName: parsed.name,
        path: parsed.path ?? "",
        // @ts-ignore .
        get specifier() {
          try {
            const resolvedDir = nodeModulesDirForPackage(entry.npmPackage)
            // @ts-ignore .
            return typeof Deno === 'undefined'
              // @ts-ignore .
              ? new URL(import.meta.resolve([parsed.name, parsed.path ?? ""].join(''), resolvedDir))
              : new URL(import.meta.resolve(entry.specifier))
          } catch (e: any) {
            console.log(e.message)
            //
          }
        }
      };

    } else if (entry.kind === "node") {
      return {
        kind: "node",
        path: entry.specifier,
      };
    }
    // @ts-ignore .
    return { kind: "esm", specifier: new URL(entry.specifier), local: entry.local };
  }

  get moduleStore() {
    return this.#moduleStore;
  }

  clear() {
    return this.#moduleStore.clear();
  }

  info(specifier: string) {
    return this.#moduleStore.get(specifier);
  }

  cache(specifier: string) {
    return this.#moduleStore.set(specifier);
  }

  loadNpm(specifier: string) {
    return this.#moduleStore.getNpmPackage(specifier)
  }

  async loadEsm(specifier: URL, generated: boolean = false): Promise<bun.OnLoadResult | undefined> {
    // console.log('loadEsm', specifier.href)
    if (specifier.protocol === "data:") {
      const resp = await fetch(specifier);
      const contents = new Uint8Array(await resp.arrayBuffer());
      const contentType = resp.headers.get("content-type");
      const mediaType = mapContentType(specifier, contentType);
      const loader = mediaTypeToLoader(mediaType);
      // if (loader === null) return undefined;
      return { contents, loader: loader || undefined };
    }
    const entry = this.#moduleStore.get(specifier.href);
    if (
      "error" in entry && specifier.protocol !== "file:" &&
      mediaTypeFromSpecifier(specifier) !== "Unknown"
    ) throw new Error(entry.error);

    if (!("local" in entry)) {
      throw new Error("[unreachable] Not an ESM module.");
    }
    if (!entry.local) throw new Error("Module not downloaded yet.");
    // if (generated && !("emit" in entry)) throw new Error("Module not generated yet. " + specifier.href);

    const loader = generated ? 'js' : mediaTypeToLoader(entry.mediaType);
    if (loader === null) return undefined;
    // @ts-ignore .
    let contents = await fs.readFile(generated ? entry.emit : entry.local) // await Bun.file(entry.local).bytes()
    const denoCacheMetadata = lastIndexOfNeedle(contents, DENO_CACHE_METADATA);
    if (denoCacheMetadata !== -1) {
      contents = contents.subarray(0, denoCacheMetadata);
    }
    const res: bun.OnLoadResult = { contents, loader };
    // if (specifier.protocol === "file:") {
    //   res.watchFiles = [fileURLToPath(specifier)];
    // }
    return res;
  }

  nodeModulesDirForPackage(npmPackageId: string): string {
    const npmPackage = this.#moduleStore.getNpmPackage(npmPackageId);
    if (!npmPackage) throw new Error("NPM package (" + npmPackageId + ") not found.");

    let linkDir = this.#linkDirCache.get(npmPackageId);
    if (!linkDir) {
      linkDir = this.#nodeModulesDirForPackageInner(
        npmPackageId,
        npmPackage,
      );
      this.#linkDirCache.set(npmPackageId, linkDir);
    }
    return linkDir;
  }

  #nodeModulesDirForPackageInner(
    npmPackageId: string,
    npmPackage: NpmPackage,
  ): string {
    let name = npmPackage.name;
    if (name.toLowerCase() !== name) {
      // ???????
      // name = `_${encodeBase32(new TextEncoder().encode(name))}`;
    }
    if (ROOT_INFO_OUTPUT === undefined) {
      ROOT_INFO_OUTPUT = rootInfo();
    }
    // if (ROOT_INFO_OUTPUT instanceof Promise) {
    //   ROOT_INFO_OUTPUT = await ROOT_INFO_OUTPUT;
    // }
    const { denoDir, npmCache } = ROOT_INFO_OUTPUT;
    const registryUrl = npmPackage.registryUrl ?? "https://registry.npmjs.org";
    const registry = new URL(registryUrl);

    const packageDir = join(
      npmCache,
      registry.hostname,
      name,
      npmPackage.version,
    );

    return packageDir

    // const linkDir = join(
    //   denoDir,
    //   "deno_bun",
    //   registry.hostname,
    //   npmPackageId,
    //   "node_modules",
    //   name,
    // );
    // const linkDirParent = dirname(linkDir);
    // const tmpDirParent = join(denoDir, "deno_bun_tmp");

    // // check if the package is already linked, if so, return the link and skip
    // // a bunch of work
    // try {
    //   fs.statSync(linkDir);
    //   this.#linkDirCache.set(npmPackageId, linkDir);
    //   return linkDir;
    // } catch {
    //   // directory does not yet exist
    // }

    // // create a temporary directory, recursively hardlink the package contents
    // // into it, and then rename it to the final location
    // fs.mkdirSync(tmpDirParent, { recursive: true });
    // const tmpDir = fs.makeTempDirSync({ dir: tmpDirParent });
    // linkRecursive(packageDir, tmpDir);
    // try {
    //   fs.mkdirSync(linkDirParent, { recursive: true });
    //   fs.renameSync(tmpDir, linkDir);
    // } catch (err) {
    //   // the directory may already have been created by someone else - check if so
    //   try {
    //     fs.statSync(linkDir);
    //   } catch {
    //     throw err;
    //   }
    // }

    // return linkDir;
  }

  packageIdFromNameInPackage(
    name: string,
    parentPackageId: string,
  ): string | null {
    const parentPackage = this.#moduleStore.getNpmPackage(parentPackageId);
    if (!parentPackage) throw new Error("NPM package not found.");
    if (parentPackage.name === name) return parentPackageId;
    for (const dep of parentPackage.dependencies) {
      const depPackage = this.#moduleStore.getNpmPackage(dep);
      if (!depPackage) throw new Error("NPM package not found.");
      if (depPackage.name === name) return dep;
    }
    return null;
  }
}

function linkRecursive(from: string, to: string) {
  const fromStat = fs.statSync(from);
  if (fromStat.isDirectory) {
    fs.mkdirSync(to, { recursive: true });

    for (const entry of fs.readDirSync(from)) {
      linkRecursive(join(from, entry.name), join(to, entry.name));
    }

  } else {
    fs.linkSync(from, to);
  }
}
