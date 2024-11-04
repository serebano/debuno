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
                : Runtime.Unknown)
}

export default getRuntime()
