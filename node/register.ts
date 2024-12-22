// deno-lint-ignore-file no-explicit-any
import module from "node:module";
import process from "node:process";
import { MessageChannel } from 'node:worker_threads';
import { resolveMain } from "../shared/resolveMain.ts";
import { pathToFileURL } from "../shared/url.ts";
import { createServer } from "./api.ts";
import api from '../shared/api.ts'
import type { RegisterOptions } from "./types.ts";

export function register(options?: RegisterOptions) {
    process.setSourceMapsEnabled(true);

    const {
        port1,
        port2
    } = new MessageChannel();

    const { handleRequest } = createServer(api, (res) => port1.postMessage(res))
    port1.on('message', handleRequest);

    port1.unref();

    if (options?.onResolve) {
        api.addEventListener('resolve', options.onResolve)
    }

    if (options?.onResolved) {
        api.addEventListener('resolved', options.onResolved)
    }

    if (options?.onLoad) {
        api.addEventListener('load', options.onLoad)
    }

    if (options?.onLoaded) {
        api.addEventListener('loaded', options.onLoaded)
    }


    let main = null;
    if (process.argv[1]) {
        console.log('process.argv[1]', process.argv[1])

        main = process.argv[1].startsWith('-')
            ? null
            : resolveMain(pathToFileURL(process.argv[1]).href).resolved

        if (main) {
            try {
                api.cacheSync(main)
            } catch (e: any) {
                console.log(e.message)
            }
        }
    }

    module.register("./node/index.js", {
        parentURL: import.meta.url,
        data: {
            main,
            port: port2,
            eventNames: api.eventNames
        },
        transferList: [port2],
    });

}