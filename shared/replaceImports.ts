interface Span {
    start: { line: number; character: number };
    end: { line: number; character: number };
}

interface Code {
    specifier: string;
    span: Span;
}

interface Input {
    specifier: string;
    code: Code;
}

/**
 * Replaces a string at the specified line and character position in the input code.
 * 
 * @param input - Object containing specifier and code to be modified.
 * @param replacement - The new string to replace at the specified location.
 * @returns - The modified code with the replacement made.
 */
export function replaceAtLocation(code: string, input: Input): string {
    if (input.specifier === input.code.specifier) {
        return code
    }

    const span = input.code.span;
    const replacement = input.code.specifier



    // Convert the code into an array of lines
    const lines = code.split('\n');

    // Get the line that will be modified
    const lineToModify = lines[span.start.line];

    // Replace the substring from the start character to the end character
    const modifiedLine = lineToModify.substring(0, span.start.character) + `"${replacement}"` + lineToModify.substring(span.end.character);

    // Update the line in the array of lines
    lines[span.start.line] = modifiedLine;

    // Join the lines back into a single string and return it
    return lines.join('\n');
}

export function replaceImports(code: string): string {
    return code
        .replaceAll(`from "`, `from "xxx:`)
        .replaceAll(`from '`, `from 'xxx:`)
        .replaceAll(`import(`, `import("xxx:"+`)
        .replaceAll(`resolve(`, `resolve("xxx:"+`)
}

// async function handleImportMap({ path }: { path: string }) {
// 	const contents = await fs.readFile(path)
// 	const imports = transpiler.scanImports(contents);
// 	let textContents: string | undefined = undefined

// 	for (const i of imports) {
// 		if (!api.mappedImports[i.path]) {
// 			const resolved = api.resolver.resolve(i.path, url.pathToFileURL(path).href)

// 			if (resolved !== i.path) {
// 				if (!textContents) {
// 					textContents = new TextDecoder().decode(contents)
// 				}

// 				textContents = textContents
// 					.replace(`"${i.path}"`, `"${resolved}"`)
// 					.replace(`'${i.path}'`, `'${resolved}'`)
// 				api.mappedImports[i.path] = resolved;
// 			}
// 		}
// 	}

// 	return {
// 		contents: textContents || contents,

// 	}
// }