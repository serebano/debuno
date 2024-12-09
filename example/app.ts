// deno-lint-ignore-file no-explicit-any
import { Hono } from "jsr:@hono/hono"
import { RUNTIME } from '../shared/runtime.ts'

export const app = new Hono()

app.get('/', (c) => {
    const userAgent = c.req.header('User-Agent')

    return c.text(`Hello World\n\nServer: ${navigator.userAgent}\n\nClient: ${userAgent}`)
})

export const PORTS = {
    deno: 3031,
    bun: 3032,
    node: 3033,
    unknown: 3030
}


export async function serve({ fetch, onListen }: { fetch: (request: Request) => Promise<Response> | Response, onListen: (addr: any) => void }) {

    switch (RUNTIME) {
        case "deno":
            return Deno.serve({
                port: PORTS[RUNTIME],
                onListen
            }, fetch)

        case "bun": {
            const server = Bun.serve({ port: PORTS[RUNTIME], fetch })
            onListen({ port: server.port, hostname: server.hostname })
            return server
        }

        case "node":
            return (await import('npm:@hono/node-server'))
                .serve({
                    port: PORTS[RUNTIME],
                    fetch,
                }, onListen)

        case "unknown":
            throw new Error(`Unknown runtime`)
    }

}

export async function start(onListen: any) {
    return await serve({
        fetch: app.fetch,
        onListen
    })
}

await start((info: { port: number }) => {
    console.log('-'.repeat(40), '\n')

    console.log(`\t${navigator.userAgent}`)
    console.log(`\thttp://localhost:${info.port}\n`)

    console.log('-'.repeat(40), '\n')
})
