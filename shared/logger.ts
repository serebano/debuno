import { DEBUG } from "./debug.ts";

export function log(...args: any[]) {
    if (DEBUG)
        console.log('(debuno)', ...args)
}

export function error(...args: any[]) {
    console.error('(debuno)', ...args)
}

export default { log, error }