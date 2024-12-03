import plugin from "./plugin.ts"

export function register() {
    Bun.plugin(plugin())
}