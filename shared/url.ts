import {
    pathToFileURL as _pathToFileURL,
    fileURLToPath as _fileURLToPath,
    type PathToFileUrlOptions,
    type FileUrlToPathOptions
} from "node:url"

export const pathToFileURL = (path: string, options?: PathToFileUrlOptions): URL => _pathToFileURL(path, options) as URL
export const fileURLToPath = (url: string | URL, options?: FileUrlToPathOptions): string => _fileURLToPath(url, options)