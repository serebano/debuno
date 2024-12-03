import { pathToFileURL } from "node:url";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { esbuildResolutionToURL } from "./shared_cross.ts";

export const getMain = () => pathToFileURL(process.argv[1]).href

export function resolveMain(url: string) {

    const namespaces = ["http", "https", "jsr", "npm"];
    const resolveDir = pathToFileURL(process.cwd() + "/").href;
    const specifier = url.replace(resolveDir, "");

    const namespace = namespaces.find((namespace) =>
        specifier.startsWith(`${namespace}:`)
    );

    if (namespace) {
        const path = specifier.replace(`${namespace}:`, "");
        const resolved = esbuildResolutionToURL({ namespace, path }).href

        return {
            url,
            resolveDir,
            namespace,
            path,
            resolved
        };
    }

    const path = fileURLToPath(url)
    const resolved = esbuildResolutionToURL({ namespace: 'file', path }).href

    return {
        url,
        resolveDir,
        namespace: 'file',
        path,
        resolved
    }
}