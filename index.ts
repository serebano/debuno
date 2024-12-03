if (navigator.userAgent.includes("Bun")) {
    await import("./bun/index.ts")
} else if (navigator.userAgent.includes("Node")) {
    await import("./node/index.ts")
}