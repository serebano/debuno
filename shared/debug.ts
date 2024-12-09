import process from "node:process";

const DEBUG_KEY = 'DEBUNO_DEBUG'

export const DEBUG = process.env[DEBUG_KEY] === "1" || process.env[DEBUG_KEY] === "true";
