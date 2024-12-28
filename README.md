# debuno
Bring Deno module resolution to Bun & Node

## Install
```sh
curl -fsSL https://debuno.dev/install | sh
```

## Usage
```sh
debuno init foo
cd foo
```


## Deno

```sh
deno index.ts
# or
debuno deno index.ts
```

## Bun

```sh
bun --preload debuno index.ts
# or
debuno bun index.ts
```

## Node

```sh
node --import debuno index.ts
# or
debuno node index.ts
```
