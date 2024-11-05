import process from "node:process";
import pkg from "./package.json" with { type: "json" };

export enum Runtime {
    Deno = "deno",
    Bun = "bun",
    Node = "node",
    Unknown = "unknown",
}

export function getGlobal(): typeof Deno | typeof Bun | NodeJS.Process | null {
    const runtime = getRuntime();
    switch (runtime) {
        case Runtime.Deno:
            return globalThis.Deno;
        case Runtime.Bun:
            return globalThis.Bun;
        case Runtime.Node:
            return process;
        default:
            return null;
    }
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

export function getVersions(): NodeJS.ProcessVersions {
    return process.versions;
}

export function getVersion(): string | undefined {
    return getVersions()[getRuntime()]
}

const runtime = {
    name: getRuntime(),
    version: getVersion(),
}

export function info(): { cwd: string; url: string; name: string; version: string; runtime: { name: Runtime; version: string | undefined; }; } {
    const { name, version } = pkg;
    const cwd = process.cwd();
    const url = import.meta.url;

    return {
        cwd,
        url,
        name,
        version,
        runtime
    };
}