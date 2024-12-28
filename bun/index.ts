import { register } from "./register.ts"

if (navigator.userAgent.includes("Bun")) {
    // console.log('REGISTER')
    register()
}