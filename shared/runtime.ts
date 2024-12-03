export const isDeno = navigator.userAgent.includes("Deno")
export const isBun = navigator.userAgent.includes("Bun")
export const isNode = navigator.userAgent.includes("Node.js")

export type RUNTIME = "deno" | "bun" | "node" | "unknown"
export const RUNTIME = isDeno ? "deno" : isBun ? "bun" : isNode ? "node" : "unknown"
