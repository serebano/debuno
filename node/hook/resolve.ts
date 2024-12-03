import { isBuiltin, type ResolveHook, } from 'node:module';
import { parseNpmSpecifier, isNodeModulesResolution } from "../../shared/shared_cross.ts";
import { resolveMain } from "../../shared/resolveMain.ts";
import { data, api } from './initialize.ts'

const internalResolve: ResolveHook = async (
    specifier,
    context,
    nextResolve
) => {

    if (!context.parentURL) {
        const res = resolveMain(specifier)
        specifier = res.resolved
    }

    if (isBuiltin(specifier) ||
        isNodeModulesResolution({ path: specifier, importer: context.parentURL })) {

        return nextResolve(specifier, context)
    }

    const entry = await api.request('info', specifier, context.parentURL)

    switch (entry.kind) {
        case 'esm': {
            if (!context.parentURL) {
                data.main = entry.specifier
            }

            return {
                url: entry.specifier,
                shortCircuit: true,
                format: "module"
            }
        }

        case 'npm': {
            const { name, path } = parseNpmSpecifier(new URL(entry.specifier))
            const npmSpecifier = [name, path].filter(Boolean).join('/')
            const res = await nextResolve(npmSpecifier, context)

            if (!context.parentURL) {
                data.main = res.url
            }

            return res
        }
    }

    const res = await nextResolve(entry.specifier, context)

    if (!context.parentURL) {
        data.main = res.url
    }

    return res
}

export const resolve: ResolveHook = async (
    specifier,
    context,
    nextResolve
) => {
    try {
        const start = performance.now()

        if (data.eventNames.includes('resolve')) {
            await api.request('dispatchEvent', 'resolve', { specifier, context })
        }

        const result = await internalResolve(specifier, context, nextResolve)
        const took = performance.now() - start

        if (data.eventNames.includes('resolved')) {
            await api.request('dispatchEvent', 'resolved', {
                specifier,
                context,
                result,
                took
            })
        }

        return result
    } catch (e: any) {
        throw new Error(e.message)
    }
}