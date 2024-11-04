import runtime from "./runtime.ts";
import pkg from "./package.json" with { type: "json" };

export function info() {
    const { name, version } = pkg;
    const cwd = process.cwd();
    const url = import.meta.url;

    return {
        cwd,
        url,
        name,
        version,
        runtime,
    };
}

console.log(info());