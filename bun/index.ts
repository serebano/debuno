import { register } from "./register.ts"

if (navigator.userAgent.includes("Bun")) {
    register()
}