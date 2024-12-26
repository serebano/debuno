# debuno

## Install
```sh
curl -o- https://debuno.dev/install | sh
```

```ts
// app.ts

import "https://docs.deno.com/examples/hello-world.ts";

// import hono from "https://esm.sh/hono";
// import hono from "jsr:@hono/hono";
// import hono from "npm:hono";
```

## Deno

```sh
deno --watch app.ts
```

## Bun

```sh
bun --preload debuno --watch app.ts
```

## Node

```sh
node --import debuno --watch app.ts
```
