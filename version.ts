#!/usr/bin/env bun
import { $ } from "bun";

const deno = (await $`deno -V`.text()).slice(5).trim();
const bun = Bun.version;
const node = (await $`node --version`.text()).slice(1).trim();

const pkg = (await import("./package.json")).default;

Bun.write("./package.json", JSON.stringify({ ...pkg, engines: { deno, bun, node } }, null, 4));

console.log({
    version: pkg.version,
    engines: { deno, bun, node }
});
