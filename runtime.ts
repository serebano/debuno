
import process from "node:process";
export enum Runtime {
    Deno = "deno",
    Bun = "bun",
    Node = "node",
    Unknown = "unknown",
}

export function getRuntime(): Runtime {
    return (navigator.userAgent.includes("Deno")
        ? Runtime.Deno
        : navigator.userAgent.includes("Bun")
            ? Runtime.Bun
            : navigator.userAgent.includes("Node")
                ? Runtime.Node
                : Runtime.Unknown);
}

export function getGlobal(): typeof Deno | typeof Bun | { process: NodeJS.Process } | null {
    const runtime = getRuntime();
    switch (runtime) {
        case Runtime.Deno:
            return globalThis.Deno;
        case Runtime.Bun:
            return globalThis.Bun;
        case Runtime.Node:
            return { process: globalThis.process };
        default:
            return null;
    }
}

export function getVersions() {
    return process.versions;
}

export function getVersion() {
    return getVersions()[getRuntime()]
}

export default {
    name: getRuntime(),
    version: getVersion(),
}
