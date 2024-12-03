// deno-lint-ignore-file no-explicit-any no-unused-vars
import { isBuiltin, type LoadHook } from 'node:module';
import * as fs from '../../shared/fs.ts'
import { isNodeModule } from "../../shared/shared_cross.ts";
import { api, data } from './initialize.ts'


const internalLoad: LoadHook = async (url, context, nextLoad) => {

    if (isBuiltin(url) || isNodeModule(url)) {
        return nextLoad(url, context)
    }

    try {
        const entry = await api.request('info', url)
        const isTS = entry.kind === 'esm' && (entry.mediaType === 'TypeScript' || entry.mediaType === 'TSX')

        switch (entry.kind) {
            case 'esm': {
                const source = await fs.readFile(isTS ? entry.emit! : entry.local!)

                return {
                    source,
                    format: "module",
                    shortCircuit: true
                }
            }
        }
    } catch (e: any) {
        console.error(e.message)
    }

    return nextLoad(url, context);
}

export const load: LoadHook = async (url, context, nextLoad) => {
    try {
        const start = performance.now()

        if (data.eventNames.includes('load')) {
            await api.request('dispatchEvent', 'load', { url, context })
        }

        const result = await internalLoad(url, context, nextLoad)
        const took = performance.now() - start

        if (data.eventNames.includes('loaded')) {
            const { source, ...rest } = result
            await api.request('dispatchEvent', 'loaded', {
                url,
                context,
                result: rest,
                took,
            })
        }

        return result
    } catch (e: any) {
        throw new Error(e.message)
    }
}