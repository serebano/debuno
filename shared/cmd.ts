import { spawnSync } from "node:child_process";
import process from "node:process";
import logger from "./logger.ts";

const runtime = (navigator.userAgent.includes("Deno")
    ? 'deno'
    : navigator.userAgent.includes("Bun")
        ? 'bun'
        : navigator.userAgent.includes("Node")
            ? 'node'
            : 'unknown') as
    | 'deno'
    | 'bun'
    | 'node'
    | 'unknown';

export function cmdSync(args: string[], opts: { cwd?: string, env?: Record<string, string> } = {}) {

    const execPath = 'deno'
    opts.env = { PATH: process.env.PATH!, ...opts.env }

    logger.log('$', ...args)

    switch (runtime) {
        case "deno": {
            const result = new Deno.Command(
                execPath,
                {
                    args,
                    cwd: opts.cwd,
                    env: opts.env,
                    stdout: "piped",
                    stderr: "piped"
                },
            ).outputSync()

            return { success: result.success, stdout: result.stdout, stderr: result.stderr }
        }
        case "node":
        case "bun": {
            const result = spawnSync(execPath, args, {
                cwd: opts.cwd,
                env: opts.env,
                stdio: ['inherit', 'pipe', 'pipe']
            })
            return { success: result.status === 0, stdout: result.stdout, stderr: result.stderr }
        }
        default:
            throw new Error(`Unsupported runtime: ${runtime}`);
    }
}