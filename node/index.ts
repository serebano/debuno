import { isMainThread } from 'node:worker_threads';
import { register } from './register.ts';

// Loaded via --import flag
if (isMainThread && navigator.userAgent.includes("Node")) {
    register({
        // onResolved(e) {
        //     console.log('[resolved]', e.specifier, Number(e.took.toFixed(3)), e.result.url)
        // },
        // onLoaded(e) {
        //     console.log('[loaded]', e)
        // },
        // onResolve(e) {
        //     console.log('[resolve]', e)
        // },
        // onLoad(e) {
        //     console.log('[load]', e)
        // }
    });
}

export * from './hook/index.ts'