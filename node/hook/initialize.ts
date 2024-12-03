import { createClient, type ApiType } from "../api.ts";
import type { MessagePort } from 'node:worker_threads'

export type Data = {
    port: MessagePort,
    main: string,
    eventNames: string[]
}

export type Api = typeof import('../../shared/api.ts').default

export const data: Data = {} as Data
export const api = {} as ApiType<Api>

export function initialize(init: Data) {
    Object.assign(data, init)
    Object.assign(api, createClient<Api>(req => data.port.postMessage(req)))

    data.port.on('message', res => api.response(res))
    // console.log('init', data.main)
}