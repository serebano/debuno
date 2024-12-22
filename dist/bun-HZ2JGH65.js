// debuno 0.1.8
import {
  BUILTIN_NODE_MODULES,
  DEBUG,
  api_default,
  esbuildResolutionToURL,
  fs_exports,
  isHttpOrHttps,
  isNodeModulesResolution,
  log,
  pathToFileURL,
  path_exports,
  urlToEsbuildResolution
} from "./chunk-WRT3CKST.js";
import "./chunk-YW64QGXT.js";

// bun/plugin.ts
import process from "node:process";
function patchBuilder(builder, api) {
  const { onResolve, onLoad } = builder;
  let resolveIndex = 0;
  builder.onResolve = (constraints, callback) => onResolve(constraints, (args) => {
    args = { ...args };
    if (constraints.namespace)
      args.namespace = constraints.namespace;
    if (api.before) api.before("resolve", { args });
    const result = callback(args, builder);
    resolveIndex++;
    if (api.after && result) {
      api.after("resolve", {
        index: resolveIndex,
        specifier: (args.namespace !== "file" ? args.namespace + ":" : "") + args.path,
        resolved: result,
        //esbuildResolutionToURL(result).href,
        importer: args.importer
      });
    }
    return result;
  });
  let loadIndex = 0;
  builder.onLoad = (constraints, callback) => onLoad(constraints, async (args) => {
    args = { ...args };
    if (constraints.namespace)
      args.namespace = constraints.namespace;
    if (api.before) api.before("load", { args });
    const result = await callback(args, builder);
    loadIndex++;
    if (api.after) {
      api.after("load", {
        index: loadIndex,
        specifier: esbuildResolutionToURL(args).href,
        ...result
      });
    }
    return result;
  });
}
var modulesMap = /* @__PURE__ */ new Map();
function pluginImportResoltion({ generated } = {}) {
  return {
    name: "debuno-import-resolution",
    // target: "bun",
    setup(builder) {
      patchBuilder(builder, {
        before(type, { args }) {
          if (!DEBUG) return;
          switch (type) {
            case "resolve":
              log(type, args.namespace, args.path, args.importer);
              break;
            case "load":
              log(type, args.namespace, args.path);
              break;
          }
        },
        after(type, obj) {
          if (!DEBUG) return;
          const path = `./preload.${type}.json`;
          const json = fs_exports.readJSONFileSync(path, []);
          switch (type) {
            case "resolve":
              {
                log(type, obj);
                json.push(obj);
              }
              break;
            case "load":
              {
                log(type, { ...obj, contents: "" });
                json.push({ ...obj, contents: obj?.contents?.toString() });
              }
              break;
          }
          fs_exports.writeJSONFileSync(`./preload.${type}.json`, json);
        }
      });
      const isRelOrAbs = (path) => path.startsWith(".") || path.startsWith("/");
      const packageIdByNodeModules = /* @__PURE__ */ new Map();
      const nodeModulesDirOpt = api_default.nodeModulesDir;
      let nodeModulesDir = null;
      if (nodeModulesDirOpt === "auto" || nodeModulesDirOpt === "manual") {
        nodeModulesDir = path_exports.join(api_default.options.cwd, "node_modules");
      }
      function mapModule(specifier, resolved) {
        if (modulesMap.has(specifier) || specifier === "bun")
          return;
        modulesMap.set(specifier, resolved);
        builder.module(specifier, () => ({
          loader: "js",
          contents: `export * from "${resolved}"`
        }));
      }
      function resolve(args) {
        if (args.importer === "bun:main" || args.importer === process.argv[1]) {
          api_default.cacheSync(args.path);
        }
        if (isNodeModulesResolution(args)) {
          if (BUILTIN_NODE_MODULES.has(args.path) || BUILTIN_NODE_MODULES.has("node:" + args.path)) {
            return {
              path: args.path,
              external: true
            };
          }
          if (nodeModulesDir !== null) {
            return void 0;
          }
        }
        if (args.namespace === "file" && isHttpOrHttps(args.importer)) {
          return urlToEsbuildResolution(new URL(args.path, args.importer));
        }
        if (args.namespace === "file" && isRelOrAbs(args.path)) {
          try {
            const importer = args.importer;
            const referrer = importer === "bun:main" ? pathToFileURL(api_default.options.cwd).href : pathToFileURL(importer).href;
            const info = api_default.info(args.path, referrer);
            if (info.dependencies) {
              const map = info.dependencies.filter((i) => !isRelOrAbs(i.specifier) && i.specifier !== i.code?.specifier && i.specifier !== i.type?.specifier).map((i) => [i.specifier, i.code?.specifier || i.type?.specifier]);
              map.forEach((i) => mapModule.apply(null, i));
            }
          } catch (e) {
            console.log("	map", args, e.message);
          }
        }
        if (!args.namespace || args.namespace === "file") {
          return void 0;
        }
        try {
          const specifier = esbuildResolutionToURL(args);
          const resolved = api_default.loader.resolve(specifier);
          switch (resolved.kind) {
            case "npm": {
              let resolveDir;
              if (nodeModulesDir !== null) {
                resolveDir = nodeModulesDir;
              } else {
                resolveDir = api_default.loader.nodeModulesDirForPackage(resolved.packageId);
                packageIdByNodeModules.set(resolveDir, resolved.packageId);
              }
              const path = `${resolved.packageName}${resolved.path ?? ""}`;
              const resolvedPath = Bun.resolveSync(path, resolveDir);
              console.log("RR", { path, resolvedPath });
              return void 0;
              return {
                path: resolvedPath,
                namespace: "file",
                external: true
              };
            }
            case "esm": {
              return urlToEsbuildResolution(resolved.specifier);
            }
            case "node": {
              return {
                path: resolved.path,
                external: true
              };
            }
          }
        } catch (e) {
          console.error(e.message);
          return void 0;
        }
      }
      async function load(args, _builder) {
        const specifier = esbuildResolutionToURL(args);
        const result = await api_default.loader.loadEsm(specifier, generated);
        return result || null;
      }
      builder.onResolve({ filter: /.*/, namespace: "jsr" }, resolve);
      builder.onResolve({ filter: /.*/, namespace: "npm" }, resolve);
      builder.onResolve({ filter: /.*/, namespace: "node" }, resolve);
      builder.onResolve({ filter: /.*/, namespace: "file" }, resolve);
      builder.onLoad({ filter: /.*/, namespace: "http" }, load);
      builder.onLoad({ filter: /.*/, namespace: "https" }, load);
      builder.onLoad({ filter: /.*/, namespace: "npm" }, load);
    }
  };
}

// bun/register.ts
function register() {
  Bun.plugin(pluginImportResoltion());
}

// bun/index.ts
if (navigator.userAgent.includes("Bun")) {
  register();
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vYnVuL3BsdWdpbi50cyIsICIuLi9idW4vcmVnaXN0ZXIudHMiLCAiLi4vYnVuL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2J1bi10eXBlcy9pbmRleC5kLnRzXCIgLz5cbi8vIGRlbm8tbGludC1pZ25vcmUtZmlsZSBuby1leHBsaWNpdC1hbnlcblxuaW1wb3J0IHR5cGUgeyBCdW5QbHVnaW4sIFBsdWdpbkJ1aWxkZXIgfSBmcm9tIFwiYnVuXCI7XG5pbXBvcnQgYXBpLCB7IEJVSUxUSU5fTk9ERV9NT0RVTEVTLCBlc2J1aWxkUmVzb2x1dGlvblRvVVJMLCBpc0h0dHBPckh0dHBzLCBpc05vZGVNb2R1bGVzUmVzb2x1dGlvbiwgdXJsVG9Fc2J1aWxkUmVzb2x1dGlvbiwgZnMsIHBhdGgsIGxvZywgdXJsLCBpc0luTm9kZU1vZHVsZXMgfSBmcm9tIFwiLi4vc2hhcmVkL2FwaS50c1wiO1xuaW1wb3J0IHsgcGF0aFRvRmlsZVVSTCB9IGZyb20gXCIuLi9zaGFyZWQvdXJsLnRzXCI7XG5pbXBvcnQgcHJvY2VzcyBmcm9tIFwibm9kZTpwcm9jZXNzXCI7XG5pbXBvcnQgeyBERUJVRyB9IGZyb20gXCIuLi9zaGFyZWQvZGVidWcudHNcIjtcblxuXG5mdW5jdGlvbiBwYXRjaEJ1aWxkZXIoYnVpbGRlcjogUGx1Z2luQnVpbGRlciwgYXBpOiB7IGJlZm9yZTogKHR5cGU6ICdyZXNvbHZlJyB8ICdsb2FkJywgb2JqOiBhbnkpID0+IHZvaWQsIGFmdGVyOiAodHlwZTogJ3Jlc29sdmUnIHwgJ2xvYWQnLCBvYmo6IGFueSkgPT4gdm9pZCB9KSB7XG5cdGNvbnN0IHsgb25SZXNvbHZlLCBvbkxvYWQgfSA9IGJ1aWxkZXI7XG5cblx0bGV0IHJlc29sdmVJbmRleCA9IDBcblx0YnVpbGRlci5vblJlc29sdmUgPSAoY29uc3RyYWludHM6IGFueSwgY2FsbGJhY2s6IGFueSkgPT4gb25SZXNvbHZlKGNvbnN0cmFpbnRzLCAoYXJncykgPT4ge1xuXHRcdGFyZ3MgPSB7IC4uLmFyZ3MgfVxuXHRcdGlmIChjb25zdHJhaW50cy5uYW1lc3BhY2UpXG5cdFx0XHRhcmdzLm5hbWVzcGFjZSA9IGNvbnN0cmFpbnRzLm5hbWVzcGFjZVxuXG5cdFx0aWYgKGFwaS5iZWZvcmUpIGFwaS5iZWZvcmUoJ3Jlc29sdmUnLCB7IGFyZ3MgfSlcblx0XHRjb25zdCByZXN1bHQgPSBjYWxsYmFjayhhcmdzLCBidWlsZGVyKVxuXHRcdHJlc29sdmVJbmRleCsrXG5cdFx0aWYgKGFwaS5hZnRlciAmJiByZXN1bHQpIHtcblx0XHRcdGFwaS5hZnRlcigncmVzb2x2ZScsIHtcblx0XHRcdFx0aW5kZXg6IHJlc29sdmVJbmRleCxcblx0XHRcdFx0c3BlY2lmaWVyOiAoYXJncy5uYW1lc3BhY2UgIT09ICdmaWxlJyA/IGFyZ3MubmFtZXNwYWNlICsgXCI6XCIgOiBcIlwiKSArIGFyZ3MucGF0aCxcblx0XHRcdFx0cmVzb2x2ZWQ6IHJlc3VsdCwgLy9lc2J1aWxkUmVzb2x1dGlvblRvVVJMKHJlc3VsdCkuaHJlZixcblx0XHRcdFx0aW1wb3J0ZXI6IGFyZ3MuaW1wb3J0ZXJcblx0XHRcdH0pXG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRcblx0fSk7XG5cblx0bGV0IGxvYWRJbmRleCA9IDBcblx0YnVpbGRlci5vbkxvYWQgPSAoY29uc3RyYWludHM6IGFueSwgY2FsbGJhY2s6IGFueSkgPT4gb25Mb2FkKGNvbnN0cmFpbnRzLCBhc3luYyAoYXJncykgPT4ge1xuXHRcdGFyZ3MgPSB7IC4uLmFyZ3MgfVxuXG5cdFx0aWYgKGNvbnN0cmFpbnRzLm5hbWVzcGFjZSlcblx0XHRcdGFyZ3MubmFtZXNwYWNlID0gY29uc3RyYWludHMubmFtZXNwYWNlXG5cblx0XHRpZiAoYXBpLmJlZm9yZSkgYXBpLmJlZm9yZSgnbG9hZCcsIHsgYXJncyB9KVxuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrKGFyZ3MsIGJ1aWxkZXIpXG5cdFx0bG9hZEluZGV4Kytcblx0XHRpZiAoYXBpLmFmdGVyKSB7XG5cdFx0XHRhcGkuYWZ0ZXIoJ2xvYWQnLCB7XG5cdFx0XHRcdGluZGV4OiBsb2FkSW5kZXgsXG5cdFx0XHRcdHNwZWNpZmllcjogZXNidWlsZFJlc29sdXRpb25Ub1VSTChhcmdzKS5ocmVmLFxuXHRcdFx0XHQuLi5yZXN1bHRcblx0XHRcdH0pXG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRcblx0fSk7XG5cbn1cbmV4cG9ydCBjb25zdCBtb2R1bGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbHVnaW5JbXBvcnRSZXNvbHRpb24oeyBnZW5lcmF0ZWQgfTogeyBnZW5lcmF0ZWQ/OiBib29sZWFuIH0gPSB7fSk6IEJ1blBsdWdpbiB7XG5cdHJldHVybiB7XG5cdFx0bmFtZTogXCJkZWJ1bm8taW1wb3J0LXJlc29sdXRpb25cIixcblx0XHQvLyB0YXJnZXQ6IFwiYnVuXCIsXG5cdFx0c2V0dXAoYnVpbGRlcikge1xuXHRcdFx0Ly8gaWYgKERFQlVHKSB7XG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdwbHVnaW5JbXBvcnRSZXNvbHRpb24nLCB7IERFQlVHIH0pXG5cblx0XHRcdC8vIFx0ZnMud3JpdGVKU09ORmlsZVN5bmMoJy4vcHJlbG9hZC5qc29uJywgW10pXG5cdFx0XHQvLyBcdGZzLndyaXRlSlNPTkZpbGVTeW5jKCcuL3Jlc29sdmVkLmpzb24nLCB7fSlcblx0XHRcdC8vIFx0ZnMud3JpdGVKU09ORmlsZVN5bmMoYC4vcHJlbG9hZC5yZXNvbHZlLmpzb25gLCBbXSlcblx0XHRcdC8vIFx0ZnMud3JpdGVKU09ORmlsZVN5bmMoYC4vcHJlbG9hZC5sb2FkLmpzb25gLCBbXSlcblx0XHRcdC8vIH1cblxuXHRcdFx0cGF0Y2hCdWlsZGVyKGJ1aWxkZXIsIHtcblx0XHRcdFx0YmVmb3JlKHR5cGUsIHsgYXJncyB9KSB7XG5cdFx0XHRcdFx0aWYgKCFERUJVRykgcmV0dXJuXG5cdFx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdyZXNvbHZlJzpcblx0XHRcdFx0XHRcdFx0bG9nKHR5cGUsIGFyZ3MubmFtZXNwYWNlLCBhcmdzLnBhdGgsIGFyZ3MuaW1wb3J0ZXIpXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbG9hZCc6XG5cdFx0XHRcdFx0XHRcdGxvZyh0eXBlLCBhcmdzLm5hbWVzcGFjZSwgYXJncy5wYXRoKVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFmdGVyKHR5cGUsIG9iaikge1xuXHRcdFx0XHRcdGlmICghREVCVUcpIHJldHVybjtcblx0XHRcdFx0XHRjb25zdCBwYXRoID0gYC4vcHJlbG9hZC4ke3R5cGV9Lmpzb25gIGFzIGNvbnN0XG5cdFx0XHRcdFx0Y29uc3QganNvbiA9IGZzLnJlYWRKU09ORmlsZVN5bmMocGF0aCwgW10gYXMgYW55W10pXG5cdFx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdyZXNvbHZlJzoge1xuXHRcdFx0XHRcdFx0XHRsb2codHlwZSwgb2JqKVxuXHRcdFx0XHRcdFx0XHRqc29uLnB1c2gob2JqKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgJ2xvYWQnOiB7XG5cdFx0XHRcdFx0XHRcdGxvZyh0eXBlLCB7IC4uLm9iaiwgY29udGVudHM6ICcnIH0pXG5cdFx0XHRcdFx0XHRcdGpzb24ucHVzaCh7IC4uLm9iaiwgY29udGVudHM6IG9iaj8uY29udGVudHM/LnRvU3RyaW5nKCkgfSkgLy8geyAuLi5vYmosIGNvbnRlbnRzOiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUob2JqLmNvbnRlbnRzKSB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmcy53cml0ZUpTT05GaWxlU3luYyhgLi9wcmVsb2FkLiR7dHlwZX0uanNvbmAsIGpzb24pXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBpc1JlbE9yQWJzID0gKHBhdGg6IHN0cmluZykgPT4gcGF0aC5zdGFydHNXaXRoKCcuJykgfHwgcGF0aC5zdGFydHNXaXRoKCcvJylcblxuXHRcdFx0Y29uc3QgcGFja2FnZUlkQnlOb2RlTW9kdWxlcyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdFx0XHRjb25zdCBub2RlTW9kdWxlc0Rpck9wdCA9IGFwaS5ub2RlTW9kdWxlc0RpclxuXHRcdFx0bGV0IG5vZGVNb2R1bGVzRGlyOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuXHRcdFx0aWYgKG5vZGVNb2R1bGVzRGlyT3B0ID09PSBcImF1dG9cIiB8fCBub2RlTW9kdWxlc0Rpck9wdCA9PT0gXCJtYW51YWxcIikge1xuXHRcdFx0XHRub2RlTW9kdWxlc0RpciA9IHBhdGguam9pbihhcGkub3B0aW9ucy5jd2QsIFwibm9kZV9tb2R1bGVzXCIpO1xuXHRcdFx0fVxuXG5cblx0XHRcdGZ1bmN0aW9uIG1hcE1vZHVsZShzcGVjaWZpZXI6IHN0cmluZywgcmVzb2x2ZWQ6IHN0cmluZykge1xuXHRcdFx0XHRpZiAobW9kdWxlc01hcC5oYXMoc3BlY2lmaWVyKSB8fCBzcGVjaWZpZXIgPT09ICdidW4nKVxuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdG1vZHVsZXNNYXAuc2V0KHNwZWNpZmllciwgcmVzb2x2ZWQpXG5cblx0XHRcdFx0YnVpbGRlci5tb2R1bGUoc3BlY2lmaWVyLCAoKSA9PiAoe1xuXHRcdFx0XHRcdGxvYWRlcjogJ2pzJyxcblx0XHRcdFx0XHRjb250ZW50czogYGV4cG9ydCAqIGZyb20gXCIke3Jlc29sdmVkfVwiYFxuXHRcdFx0XHR9KSlcblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVzb2x2ZVxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZShhcmdzOiB7XG5cdFx0XHRcdHBhdGg6IHN0cmluZyxcblx0XHRcdFx0bmFtZXNwYWNlOiBzdHJpbmcsXG5cdFx0XHRcdGltcG9ydGVyOiBzdHJpbmcsXG5cdFx0XHR9KSB7XG5cdFx0XHRcdC8vIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShhcmdzKSlcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ34gcmVzb2x2ZScsIGFyZ3MpXG5cdFx0XHRcdGlmIChhcmdzLmltcG9ydGVyID09PSAnYnVuOm1haW4nIHx8IGFyZ3MuaW1wb3J0ZXIgPT09IHByb2Nlc3MuYXJndlsxXSkge1xuXHRcdFx0XHRcdGFwaS5jYWNoZVN5bmMoYXJncy5wYXRoKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzTm9kZU1vZHVsZXNSZXNvbHV0aW9uKGFyZ3MpKSB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0QlVJTFRJTl9OT0RFX01PRFVMRVMuaGFzKGFyZ3MucGF0aCkgfHxcblx0XHRcdFx0XHRcdEJVSUxUSU5fTk9ERV9NT0RVTEVTLmhhcyhcIm5vZGU6XCIgKyBhcmdzLnBhdGgpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRwYXRoOiBhcmdzLnBhdGgsXG5cdFx0XHRcdFx0XHRcdGV4dGVybmFsOiB0cnVlLFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAobm9kZU1vZHVsZXNEaXIgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFyZ3MubmFtZXNwYWNlID09PSAnZmlsZScgJiYgaXNIdHRwT3JIdHRwcyhhcmdzLmltcG9ydGVyKSkge1xuXHRcdFx0XHRcdHJldHVybiB1cmxUb0VzYnVpbGRSZXNvbHV0aW9uKG5ldyBVUkwoYXJncy5wYXRoLCBhcmdzLmltcG9ydGVyKSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhcmdzLm5hbWVzcGFjZSA9PT0gJ2ZpbGUnICYmIGlzUmVsT3JBYnMoYXJncy5wYXRoKSkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbXBvcnRlciA9IGFyZ3MuaW1wb3J0ZXJcblx0XHRcdFx0XHRcdGNvbnN0IHJlZmVycmVyID0gaW1wb3J0ZXIgPT09ICdidW46bWFpbidcblx0XHRcdFx0XHRcdFx0PyBwYXRoVG9GaWxlVVJMKGFwaS5vcHRpb25zLmN3ZCkuaHJlZlxuXHRcdFx0XHRcdFx0XHQ6IHBhdGhUb0ZpbGVVUkwoaW1wb3J0ZXIpLmhyZWZcblxuXHRcdFx0XHRcdFx0Y29uc3QgaW5mbyA9IGFwaS5pbmZvKGFyZ3MucGF0aCwgcmVmZXJyZXIpXG5cblx0XHRcdFx0XHRcdGlmIChpbmZvLmRlcGVuZGVuY2llcykge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBtYXAgPSBpbmZvLmRlcGVuZGVuY2llc1xuXHRcdFx0XHRcdFx0XHRcdC5maWx0ZXIoaSA9PiAhaXNSZWxPckFicyhpLnNwZWNpZmllcikgJiYgKGkuc3BlY2lmaWVyICE9PSBpLmNvZGU/LnNwZWNpZmllcikgJiYgaS5zcGVjaWZpZXIgIT09IGkudHlwZT8uc3BlY2lmaWVyKVxuXHRcdFx0XHRcdFx0XHRcdC5tYXAoaSA9PiBbaS5zcGVjaWZpZXIsIGkuY29kZT8uc3BlY2lmaWVyIHx8IGkudHlwZT8uc3BlY2lmaWVyXSlcblxuXHRcdFx0XHRcdFx0XHRtYXAuZm9yRWFjaCgoaTogYW55KSA9PiBtYXBNb2R1bGUuYXBwbHkobnVsbCwgaSkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBjYXRjaCAoZTogYW55KSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnXHRtYXAnLCBhcmdzLCBlLm1lc3NhZ2UpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFhcmdzLm5hbWVzcGFjZSB8fCBhcmdzLm5hbWVzcGFjZSA9PT0gJ2ZpbGUnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCBzcGVjaWZpZXIgPSBlc2J1aWxkUmVzb2x1dGlvblRvVVJMKGFyZ3MpO1xuXHRcdFx0XHRcdGNvbnN0IHJlc29sdmVkID0gYXBpLmxvYWRlci5yZXNvbHZlKHNwZWNpZmllcik7XG5cblx0XHRcdFx0XHRzd2l0Y2ggKHJlc29sdmVkLmtpbmQpIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJucG1cIjoge1xuXHRcdFx0XHRcdFx0XHRsZXQgcmVzb2x2ZURpcjogc3RyaW5nO1xuXHRcdFx0XHRcdFx0XHRpZiAobm9kZU1vZHVsZXNEaXIgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlRGlyID0gbm9kZU1vZHVsZXNEaXI7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZURpciA9IGFwaS5sb2FkZXIubm9kZU1vZHVsZXNEaXJGb3JQYWNrYWdlKHJlc29sdmVkLnBhY2thZ2VJZCk7XG5cdFx0XHRcdFx0XHRcdFx0cGFja2FnZUlkQnlOb2RlTW9kdWxlcy5zZXQocmVzb2x2ZURpciwgcmVzb2x2ZWQucGFja2FnZUlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjb25zdCBwYXRoID0gYCR7cmVzb2x2ZWQucGFja2FnZU5hbWV9JHtyZXNvbHZlZC5wYXRoID8/IFwiXCJ9YDtcblx0XHRcdFx0XHRcdFx0Y29uc3QgcmVzb2x2ZWRQYXRoID0gKEJ1bi5yZXNvbHZlU3luYyhwYXRoLCByZXNvbHZlRGlyKSlcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJSUlwiLCB7IHBhdGgsIHJlc29sdmVkUGF0aCB9KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRwYXRoOiByZXNvbHZlZFBhdGgsXG5cdFx0XHRcdFx0XHRcdFx0bmFtZXNwYWNlOiAnZmlsZScsXG5cdFx0XHRcdFx0XHRcdFx0ZXh0ZXJuYWw6IHRydWVcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y2FzZSBcImVzbVwiOiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1cmxUb0VzYnVpbGRSZXNvbHV0aW9uKHJlc29sdmVkLnNwZWNpZmllcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjYXNlIFwibm9kZVwiOiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0cGF0aDogcmVzb2x2ZWQucGF0aCxcblx0XHRcdFx0XHRcdFx0XHRleHRlcm5hbDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGU6IGFueSkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKVxuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhc3luYyBmdW5jdGlvbiBsb2FkKGFyZ3M6IHsgbmFtZXNwYWNlOiBzdHJpbmcsIHBhdGg6IHN0cmluZyB9LCBfYnVpbGRlcjogUGx1Z2luQnVpbGRlcikge1xuXHRcdFx0XHQvLyBpZiAoYXJncy5uYW1lc3BhY2UgPT09IFwiZmlsZVwiICYmIGlzSW5Ob2RlTW9kdWxlcyhhcmdzLnBhdGgpKSB7XG5cdFx0XHRcdC8vIFx0cmV0dXJuIHtcblx0XHRcdFx0Ly8gXHRcdGNvbnRlbnRzOiBhd2FpdCBmcy5yZWFkRmlsZShhcmdzLnBhdGgpLFxuXHRcdFx0XHQvLyBcdFx0bG9hZGVyOiBcImpzXCJcblx0XHRcdFx0Ly8gXHR9O1xuXHRcdFx0XHQvLyB9XG5cblx0XHRcdFx0Ly8gaWYgKGFyZ3MubmFtZXNwYWNlID09PSAnZmlsZScpIHtcblx0XHRcdFx0Ly8gXHRjb25zdCBjb250ZW50cyA9IHJlcGxhY2VJbXBvcnRzKGF3YWl0IGZzLnJlYWRUZXh0RmlsZShhcmdzLnBhdGgpKVxuXHRcdFx0XHQvLyBcdC8vIGNvbnNvbGUubG9nKCdcXG5cXG4nLCBhcmdzLnBhdGgsICdcXG5cXG4nLCBjb250ZW50cywgJ1xcblxcbicpXG5cdFx0XHRcdC8vIFx0cmV0dXJuIHtcblx0XHRcdFx0Ly8gXHRcdGNvbnRlbnRzLFxuXHRcdFx0XHQvLyBcdFx0bG9hZGVyOiAndHN4JyxcblxuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gfVxuXG5cdFx0XHRcdGNvbnN0IHNwZWNpZmllciA9IGVzYnVpbGRSZXNvbHV0aW9uVG9VUkwoYXJncyk7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaS5sb2FkZXIubG9hZEVzbShzcGVjaWZpZXIsIGdlbmVyYXRlZCk7XG5cblx0XHRcdFx0Ly8gaWYgKHJlc3VsdD8ubG9hZGVyID09PSAndHN4JyAmJiBhcmdzLm5hbWVzcGFjZSA9PT0gJ2ZpbGVzJykge1xuXHRcdFx0XHQvLyBcdGNvbnN0IGNvbnRlbnRzID0gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKHJlc3VsdC5jb250ZW50cyBhcyBCdWZmZXJTb3VyY2UpXG5cdFx0XHRcdC8vIFx0Y29uc29sZS5sb2coJ3JlcGxhY2VJbXBvcnRzJywgYXJncy5wYXRoKVxuXHRcdFx0XHQvLyBcdHJldHVybiB7XG5cdFx0XHRcdC8vIFx0XHRjb250ZW50czogcmVwbGFjZUltcG9ydHMoY29udGVudHMpLFxuXHRcdFx0XHQvLyBcdFx0bG9hZGVyOiAndHN4J1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gfVxuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgfHwgbnVsbFxuXHRcdFx0fVxuXG5cdFx0XHQvLyByZXNvbHZlXG5cdFx0XHRidWlsZGVyLm9uUmVzb2x2ZSh7IGZpbHRlcjogLy4qLywgbmFtZXNwYWNlOiAnanNyJyB9LCByZXNvbHZlKTtcblx0XHRcdGJ1aWxkZXIub25SZXNvbHZlKHsgZmlsdGVyOiAvLiovLCBuYW1lc3BhY2U6ICducG0nIH0sIHJlc29sdmUpO1xuXHRcdFx0YnVpbGRlci5vblJlc29sdmUoeyBmaWx0ZXI6IC8uKi8sIG5hbWVzcGFjZTogJ25vZGUnIH0sIHJlc29sdmUpO1xuXHRcdFx0YnVpbGRlci5vblJlc29sdmUoeyBmaWx0ZXI6IC8uKi8sIG5hbWVzcGFjZTogJ2ZpbGUnIH0sIHJlc29sdmUpO1xuXHRcdFx0Ly8gYnVpbGRlci5vblJlc29sdmUoeyBmaWx0ZXI6IC8uKi8gfSwgcmVzb2x2ZSk7XG5cblxuXHRcdFx0Ly8gbG9hZFxuXHRcdFx0YnVpbGRlci5vbkxvYWQoeyBmaWx0ZXI6IC8uKi8sIG5hbWVzcGFjZTogJ2h0dHAnIH0sIGxvYWQgYXMgYW55KTtcblx0XHRcdGJ1aWxkZXIub25Mb2FkKHsgZmlsdGVyOiAvLiovLCBuYW1lc3BhY2U6ICdodHRwcycgfSwgbG9hZCBhcyBhbnkpO1xuXHRcdFx0YnVpbGRlci5vbkxvYWQoeyBmaWx0ZXI6IC8uKi8sIG5hbWVzcGFjZTogJ25wbScgfSwgbG9hZCBhcyBhbnkpO1xuXG5cdFx0fSxcblx0fVxufVxuIiwgImltcG9ydCBwbHVnaW4gZnJvbSBcIi4vcGx1Z2luLnRzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuICAgIEJ1bi5wbHVnaW4ocGx1Z2luKCkpXG59IiwgImltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSBcIi4vcmVnaXN0ZXIudHNcIlxuXG5pZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcIkJ1blwiKSkge1xuICAgIHJlZ2lzdGVyKClcbn0iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLE9BQU8sYUFBYTtBQUlwQixTQUFTLGFBQWEsU0FBd0IsS0FBb0g7QUFDakssUUFBTSxFQUFFLFdBQVcsT0FBTyxJQUFJO0FBRTlCLE1BQUksZUFBZTtBQUNuQixVQUFRLFlBQVksQ0FBQyxhQUFrQixhQUFrQixVQUFVLGFBQWEsQ0FBQyxTQUFTO0FBQ3pGLFdBQU8sRUFBRSxHQUFHLEtBQUs7QUFDakIsUUFBSSxZQUFZO0FBQ2YsV0FBSyxZQUFZLFlBQVk7QUFFOUIsUUFBSSxJQUFJLE9BQVEsS0FBSSxP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
