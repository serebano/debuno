import fs from "node:fs";

/** @param {string} path */
export function stat_sync(path) {
	const stat = fs.statSync(path);

	return {
		is_file: stat.isFile(),
		is_directory: stat.isDirectory(),
		is_symlink: stat.isSymbolicLink(),
	};
}

/** @param {string} path */
export function read_to_string_lossy(path) {
	return fs.readFileSync(path, "utf8");
}

/** @param {string} path */
export function read_dir(path) {
	return fs.readdirSync(path, { withFileTypes: true }).map((entry) => {
		return {
			name: entry.name,
			is_file: entry.isFile(),
			is_directory: entry.isDirectory(),
			is_symlink: entry.isSymbolicLink(),
		};
	});
}
