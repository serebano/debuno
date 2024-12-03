// deno-lint-ignore-file no-explicit-any
import fsp from "node:fs/promises";
import fs from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export async function rm(path: string, options?: { recursive?: boolean }) {
    return await fsp.rm(path, options)
}

export function rmSync(path: string, options?: { recursive?: boolean }) {
    return fs.rmSync(path, options)
}

export async function link(src: string, dest: string) {
    return await fsp.symlink(src, dest);
}

export function linkSync(src: string, dest: string) {
    return fs.symlinkSync(src, dest);
}

export function makeTempDirSync(options?: { prefix?: string, dir?: string }) {
    options = options || {};
    options.dir = options?.dir || tmpdir();

    const path = options?.prefix ? join(options.dir, options?.prefix) : options.dir;

    return fs.mkdtempSync(path);
}

export async function makeTempDir(options?: { prefix?: string, dir?: string }) {
    options = options || {};
    options.dir = options?.dir || tmpdir();

    const path = options?.prefix ? join(options.dir, options?.prefix) : options.dir;

    return await fsp.mkdtemp(path);
}

export async function rename(oldPath: string, newPath: string) {
    return await fsp.rename(oldPath, newPath);
}

export function renameSync(oldPath: string, newPath: string) {
    return fs.renameSync(oldPath, newPath);
}

export async function mkdir(path: string, options?: fs.MakeDirectoryOptions) {
    return await fsp.mkdir(path, options);
}

export function mkdirSync(path: string, options?: fs.MakeDirectoryOptions) {
    return fs.mkdirSync(path, options);
}

export async function stat(path: string) {
    const stat = await fsp.stat(path);

    return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        isSymbolicLink: stat.isSymbolicLink(),
    };
}

export function statSync(path: string) {
    const stat = fs.statSync(path);

    return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        isSymbolicLink: stat.isSymbolicLink(),
    };
}

export async function readFile(path: string) {
    return (await fsp.readFile(path))
}


export function readTextFile(path: string) {
    return fsp.readFile(path, "utf8");
}

export function readTextFileSync(path: string) {
    return fs.readFileSync(path, "utf8");
}

export async function readJSONFile<T = null>(path: string, defaultValue = null as T): Promise<T> {
    try {
        const text = await fsp.readFile(path, "utf8");

        return JSON.parse(text)
    } catch {
        return defaultValue
    }
}

export function readJSONFileSync<T = null>(path: string, defaultValue = null as T): T {
    try {
        return JSON.parse(fs.readFileSync(path, "utf8"))
    } catch {
        return defaultValue
    }
}

export async function writeJSONFile<T>(path: string, json: T): Promise<void> {
    await fsp.writeFile(path, JSON.stringify(json, null, 4));
}

export function writeJSONFileSync<T>(path: string, json: T) {
    fs.writeFileSync(path, JSON.stringify(json, null, 4));
}

export async function readDir(path: string, options?: { recursive?: boolean }) {
    return (await fsp.readdir(path, { withFileTypes: true, recursive: options?.recursive }))
        .map((entry) => {
            return {
                name: entry.name,
                isFile: entry.isFile(),
                isDirectory: entry.isDirectory(),
                isSymbolicLink: entry.isSymbolicLink(),
            };
        });
}

export function readDirSync(path: string) {
    return fs.readdirSync(path, { withFileTypes: true }).map((entry) => {
        return {
            name: entry.name,
            is_file: entry.isFile(),
            is_directory: entry.isDirectory(),
            is_symlink: entry.isSymbolicLink(),
        };
    });
}
