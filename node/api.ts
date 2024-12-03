// deno-lint-ignore-file no-explicit-any
export type ApiType<T> = ReturnType<typeof createClient<T>>

type Res = { id: number, result?: any, error?: any }

export function createServer<Api>(api: Api, sendResponse: (res: Res) => void) {

    type Req = { id: number, prop: keyof Api, args?: any[] }

    async function handleRequest(req: Req) {
        if (!req.prop || !req.id)
            throw new TypeError(`Invalid request: \n${JSON.stringify(req, null, 4)}`)

        const { id, prop, args } = req
        const res: Res = { id }

        try {
            res.result = typeof api[prop] === 'function'
                // @ts-ignore ...
                ? await api[prop].apply(api, args)
                : api[prop]
        } catch (error: any) {
            res.error = error
        }

        sendResponse(res)
        // port1.postMessage(res)
    }

    return { handleRequest }
}

export function createClient<Api>(sendRequest: (req: { id: number, prop: keyof Api, args?: any[] }) => void) {
    type Req = { id: number, prop: keyof Api, args?: any[] }
    type Res = { id: number, result?: any, error?: any }

    type ResType<K extends keyof Api> = Api[K] extends ((...args: any) => any) ? ReturnType<Api[K]> : Api[K]
    type ReqType<K extends keyof Api> = Api[K] extends ((...args: any) => any) ? Parameters<Api[K]> : []

    let requestId = 0

    const promises: {
        [id: number]: {
            resolve: (value: any | PromiseLike<any>) => void;
            reject: (reason?: any) => void;
        }
    } = {}

    function request<K extends keyof Api>(prop: K, ...args: ReqType<K>): Promise<ResType<K>> {
        const req: Req = { id: ++requestId, prop, args }
        const { promise, resolve, reject } = Promise.withResolvers<ResType<K>>()

        sendRequest(req)
        promises[req.id] = { resolve, reject }

        return promise
    }

    function response(res: Res) {
        if (res.error)
            promises[res.id].reject(res.error)
        else
            promises[res.id].resolve(res.result)

        delete promises[res.id]
    }

    return {
        request,
        response,
        promises
    }
}