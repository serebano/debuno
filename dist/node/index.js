// debuno 0.1.10
import {
  createClient,
  register,
  resolveMain
} from "../chunk-GJITRJDA.js";
import {
  isNodeModule,
  isNodeModulesResolution,
  parseNpmSpecifier,
  readFile
} from "../chunk-IZK6ENRE.js";
import "../chunk-JEKSUIAS.js";

// node/index.ts
import { isMainThread } from "node:worker_threads";

// node/hook/initialize.ts
var data = {};
var api = {};
function initialize(init) {
  Object.assign(data, init);
  Object.assign(api, createClient((req) => data.port.postMessage(req)));
  data.port.on("message", (res) => api.response(res));
}

// node/hook/resolve.ts
import { isBuiltin } from "node:module";
var internalResolve = async (specifier, context, nextResolve) => {
  if (!context.parentURL) {
    const res2 = resolveMain(specifier);
    specifier = res2.resolved;
  }
  if (isBuiltin(specifier) || isNodeModulesResolution({ path: specifier, importer: context.parentURL })) {
    return nextResolve(specifier, context);
  }
  const entry = await api.request("info", specifier, context.parentURL);
  switch (entry.kind) {
    case "esm": {
      if (!context.parentURL) {
        data.main = entry.specifier;
      }
      return {
        url: entry.specifier,
        shortCircuit: true,
        format: "module"
      };
    }
    case "npm": {
      const { name, path } = parseNpmSpecifier(new URL(entry.specifier));
      const npmSpecifier = [name, path].filter(Boolean).join("/");
      const res2 = await nextResolve(npmSpecifier, context);
      if (!context.parentURL) {
        data.main = res2.url;
      }
      return res2;
    }
  }
  const res = await nextResolve(entry.specifier, context);
  if (!context.parentURL) {
    data.main = res.url;
  }
  return res;
};
var resolve = async (specifier, context, nextResolve) => {
  try {
    const start = performance.now();
    if (data.eventNames.includes("resolve")) {
      await api.request("dispatchEvent", "resolve", { specifier, context });
    }
    const result = await internalResolve(specifier, context, nextResolve);
    const took = performance.now() - start;
    if (data.eventNames.includes("resolved")) {
      await api.request("dispatchEvent", "resolved", {
        specifier,
        context,
        result,
        took
      });
    }
    return result;
  } catch (e) {
    throw e;
  }
};

// node/hook/load.ts
import { isBuiltin as isBuiltin2 } from "node:module";
var internalLoad = async (url, context, nextLoad) => {
  if (isBuiltin2(url) || isNodeModule(url)) {
    return nextLoad(url, context);
  }
  try {
    const entry = await api.request("info", url);
    const isTS = entry.kind === "esm" && (entry.mediaType === "TypeScript" || entry.mediaType === "TSX");
    switch (entry.kind) {
      case "esm": {
        const source = await readFile(isTS ? entry.emit : entry.local);
        return {
          source,
          format: "module",
          shortCircuit: true
        };
      }
    }
  } catch (e) {
    console.error(e.message);
  }
  return nextLoad(url, context);
};
var load = async (url, context, nextLoad) => {
  try {
    const start = performance.now();
    if (data.eventNames.includes("load")) {
      await api.request("dispatchEvent", "load", { url, context });
    }
    const result = await internalLoad(url, context, nextLoad);
    const took = performance.now() - start;
    if (data.eventNames.includes("loaded")) {
      const { source, ...rest } = result;
      await api.request("dispatchEvent", "loaded", {
        url,
        context,
        result: rest,
        took
      });
    }
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
};

// node/index.ts
if (isMainThread && navigator.userAgent.includes("Node")) {
  register({
    // onResolved(e) {
    //     console.log('[resolved]', e.specifier, Number(e.took.toFixed(3)), e.result.url)
    // },
    // onLoaded(e) {
    //     console.log('[loaded]', e)
    // },
    // onResolve(e) {
    //     console.log('[resolve]', e)
    // },
    // onLoad(e) {
    //     console.log('[load]', e)
    // }
  });
}
export {
  initialize,
  load,
  resolve
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZS9pbmRleC50cyIsICIuLi8uLi9ub2RlL2hvb2svaW5pdGlhbGl6ZS50cyIsICIuLi8uLi9ub2RlL2hvb2svcmVzb2x2ZS50cyIsICIuLi8uLi9ub2RlL2hvb2svbG9hZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgaXNNYWluVGhyZWFkIH0gZnJvbSAnbm9kZTp3b3JrZXJfdGhyZWFkcyc7XG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gJy4vcmVnaXN0ZXIudHMnO1xuXG4vLyBMb2FkZWQgdmlhIC0taW1wb3J0IGZsYWdcbmlmIChpc01haW5UaHJlYWQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcyhcIk5vZGVcIikpIHtcbiAgICByZWdpc3Rlcih7XG4gICAgICAgIC8vIG9uUmVzb2x2ZWQoZSkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ1tyZXNvbHZlZF0nLCBlLnNwZWNpZmllciwgTnVtYmVyKGUudG9vay50b0ZpeGVkKDMpKSwgZS5yZXN1bHQudXJsKVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyBvbkxvYWRlZChlKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnW2xvYWRlZF0nLCBlKVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyBvblJlc29sdmUoZSkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ1tyZXNvbHZlXScsIGUpXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIG9uTG9hZChlKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnW2xvYWRdJywgZSlcbiAgICAgICAgLy8gfVxuICAgIH0pO1xufVxuXG5leHBvcnQgKiBmcm9tICcuL2hvb2svaW5kZXgudHMnIiwgImltcG9ydCB7IGNyZWF0ZUNsaWVudCwgdHlwZSBBcGlUeXBlIH0gZnJvbSBcIi4uL2FwaS50c1wiO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlUG9ydCB9IGZyb20gJ25vZGU6d29ya2VyX3RocmVhZHMnXG5cbmV4cG9ydCB0eXBlIERhdGEgPSB7XG4gICAgcG9ydDogTWVzc2FnZVBvcnQsXG4gICAgbWFpbjogc3RyaW5nLFxuICAgIGV2ZW50TmFtZXM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCB0eXBlIEFwaSA9IHR5cGVvZiBpbXBvcnQoJy4uLy4uL3NoYXJlZC9hcGkudHMnKS5kZWZhdWx0XG5cbmV4cG9ydCBjb25zdCBkYXRhOiBEYXRhID0ge30gYXMgRGF0YVxuZXhwb3J0IGNvbnN0IGFwaSA9IHt9IGFzIEFwaVR5cGU8QXBpPlxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZShpbml0OiBEYXRhKSB7XG4gICAgT2JqZWN0LmFzc2lnbihkYXRhLCBpbml0KVxuICAgIE9iamVjdC5hc3NpZ24oYXBpLCBjcmVhdGVDbGllbnQ8QXBpPihyZXEgPT4gZGF0YS5wb3J0LnBvc3RNZXNzYWdlKHJlcSkpKVxuXG4gICAgZGF0YS5wb3J0Lm9uKCdtZXNzYWdlJywgcmVzID0+IGFwaS5yZXNwb25zZShyZXMpKVxuICAgIC8vIGNvbnNvbGUubG9nKCdpbml0JywgZGF0YS5tYWluKVxufSIsICJpbXBvcnQgeyBpc0J1aWx0aW4sIHR5cGUgUmVzb2x2ZUhvb2ssIH0gZnJvbSAnbm9kZTptb2R1bGUnO1xuaW1wb3J0IHsgcGFyc2VOcG1TcGVjaWZpZXIsIGlzTm9kZU1vZHVsZXNSZXNvbHV0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRfY3Jvc3MudHNcIjtcbmltcG9ydCB7IHJlc29sdmVNYWluIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9yZXNvbHZlTWFpbi50c1wiO1xuaW1wb3J0IHsgZGF0YSwgYXBpIH0gZnJvbSAnLi9pbml0aWFsaXplLnRzJ1xuXG5jb25zdCBpbnRlcm5hbFJlc29sdmU6IFJlc29sdmVIb29rID0gYXN5bmMgKFxuICAgIHNwZWNpZmllcixcbiAgICBjb250ZXh0LFxuICAgIG5leHRSZXNvbHZlXG4pID0+IHtcblxuICAgIGlmICghY29udGV4dC5wYXJlbnRVUkwpIHtcbiAgICAgICAgY29uc3QgcmVzID0gcmVzb2x2ZU1haW4oc3BlY2lmaWVyKVxuICAgICAgICBzcGVjaWZpZXIgPSByZXMucmVzb2x2ZWRcbiAgICB9XG5cbiAgICBpZiAoaXNCdWlsdGluKHNwZWNpZmllcikgfHxcbiAgICAgICAgaXNOb2RlTW9kdWxlc1Jlc29sdXRpb24oeyBwYXRoOiBzcGVjaWZpZXIsIGltcG9ydGVyOiBjb250ZXh0LnBhcmVudFVSTCB9KSkge1xuXG4gICAgICAgIHJldHVybiBuZXh0UmVzb2x2ZShzcGVjaWZpZXIsIGNvbnRleHQpXG4gICAgfVxuXG4gICAgY29uc3QgZW50cnkgPSBhd2FpdCBhcGkucmVxdWVzdCgnaW5mbycsIHNwZWNpZmllciwgY29udGV4dC5wYXJlbnRVUkwpXG5cbiAgICBzd2l0Y2ggKGVudHJ5LmtpbmQpIHtcbiAgICAgICAgY2FzZSAnZXNtJzoge1xuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnBhcmVudFVSTCkge1xuICAgICAgICAgICAgICAgIGRhdGEubWFpbiA9IGVudHJ5LnNwZWNpZmllclxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVybDogZW50cnkuc3BlY2lmaWVyLFxuICAgICAgICAgICAgICAgIHNob3J0Q2lyY3VpdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IFwibW9kdWxlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ25wbSc6IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgcGF0aCB9ID0gcGFyc2VOcG1TcGVjaWZpZXIobmV3IFVSTChlbnRyeS5zcGVjaWZpZXIpKVxuICAgICAgICAgICAgY29uc3QgbnBtU3BlY2lmaWVyID0gW25hbWUsIHBhdGhdLmZpbHRlcihCb29sZWFuKS5qb2luKCcvJylcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG5leHRSZXNvbHZlKG5wbVNwZWNpZmllciwgY29udGV4dClcblxuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnBhcmVudFVSTCkge1xuICAgICAgICAgICAgICAgIGRhdGEubWFpbiA9IHJlcy51cmxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgbmV4dFJlc29sdmUoZW50cnkuc3BlY2lmaWVyLCBjb250ZXh0KVxuXG4gICAgaWYgKCFjb250ZXh0LnBhcmVudFVSTCkge1xuICAgICAgICBkYXRhLm1haW4gPSByZXMudXJsXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgY29uc3QgcmVzb2x2ZTogUmVzb2x2ZUhvb2sgPSBhc3luYyAoXG4gICAgc3BlY2lmaWVyLFxuICAgIGNvbnRleHQsXG4gICAgbmV4dFJlc29sdmVcbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KClcblxuICAgICAgICBpZiAoZGF0YS5ldmVudE5hbWVzLmluY2x1ZGVzKCdyZXNvbHZlJykpIHtcbiAgICAgICAgICAgIGF3YWl0IGFwaS5yZXF1ZXN0KCdkaXNwYXRjaEV2ZW50JywgJ3Jlc29sdmUnLCB7IHNwZWNpZmllciwgY29udGV4dCB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaW50ZXJuYWxSZXNvbHZlKHNwZWNpZmllciwgY29udGV4dCwgbmV4dFJlc29sdmUpXG4gICAgICAgIGNvbnN0IHRvb2sgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG5cbiAgICAgICAgaWYgKGRhdGEuZXZlbnROYW1lcy5pbmNsdWRlcygncmVzb2x2ZWQnKSkge1xuICAgICAgICAgICAgYXdhaXQgYXBpLnJlcXVlc3QoJ2Rpc3BhdGNoRXZlbnQnLCAncmVzb2x2ZWQnLCB7XG4gICAgICAgICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgIHRvb2tcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHRocm93IGVcbiAgICB9XG59IiwgIi8vIGRlbm8tbGludC1pZ25vcmUtZmlsZSBuby1leHBsaWNpdC1hbnkgbm8tdW51c2VkLXZhcnNcbmltcG9ydCB7IGlzQnVpbHRpbiwgdHlwZSBMb2FkSG9vayB9IGZyb20gJ25vZGU6bW9kdWxlJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJy4uLy4uL3NoYXJlZC9mcy50cydcbmltcG9ydCB7IGlzTm9kZU1vZHVsZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hhcmVkX2Nyb3NzLnRzXCI7XG5pbXBvcnQgeyBhcGksIGRhdGEgfSBmcm9tICcuL2luaXRpYWxpemUudHMnXG5cblxuY29uc3QgaW50ZXJuYWxMb2FkOiBMb2FkSG9vayA9IGFzeW5jICh1cmwsIGNvbnRleHQsIG5leHRMb2FkKSA9PiB7XG5cbiAgICBpZiAoaXNCdWlsdGluKHVybCkgfHwgaXNOb2RlTW9kdWxlKHVybCkpIHtcbiAgICAgICAgcmV0dXJuIG5leHRMb2FkKHVybCwgY29udGV4dClcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBlbnRyeSA9IGF3YWl0IGFwaS5yZXF1ZXN0KCdpbmZvJywgdXJsKVxuICAgICAgICBjb25zdCBpc1RTID0gZW50cnkua2luZCA9PT0gJ2VzbScgJiYgKGVudHJ5Lm1lZGlhVHlwZSA9PT0gJ1R5cGVTY3JpcHQnIHx8IGVudHJ5Lm1lZGlhVHlwZSA9PT0gJ1RTWCcpXG5cbiAgICAgICAgc3dpdGNoIChlbnRyeS5raW5kKSB7XG4gICAgICAgICAgICBjYXNlICdlc20nOiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc291cmNlID0gYXdhaXQgZnMucmVhZEZpbGUoaXNUUyA/IGVudHJ5LmVtaXQhIDogZW50cnkubG9jYWwhKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwibW9kdWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHNob3J0Q2lyY3VpdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dExvYWQodXJsLCBjb250ZXh0KTtcbn1cblxuZXhwb3J0IGNvbnN0IGxvYWQ6IExvYWRIb29rID0gYXN5bmMgKHVybCwgY29udGV4dCwgbmV4dExvYWQpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgICAgICAgaWYgKGRhdGEuZXZlbnROYW1lcy5pbmNsdWRlcygnbG9hZCcpKSB7XG4gICAgICAgICAgICBhd2FpdCBhcGkucmVxdWVzdCgnZGlzcGF0Y2hFdmVudCcsICdsb2FkJywgeyB1cmwsIGNvbnRleHQgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVybmFsTG9hZCh1cmwsIGNvbnRleHQsIG5leHRMb2FkKVxuICAgICAgICBjb25zdCB0b29rID0gcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuXG4gICAgICAgIGlmIChkYXRhLmV2ZW50TmFtZXMuaW5jbHVkZXMoJ2xvYWRlZCcpKSB7XG4gICAgICAgICAgICBjb25zdCB7IHNvdXJjZSwgLi4ucmVzdCB9ID0gcmVzdWx0XG4gICAgICAgICAgICBhd2FpdCBhcGkucmVxdWVzdCgnZGlzcGF0Y2hFdmVudCcsICdsb2FkZWQnLCB7XG4gICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgcmVzdWx0OiByZXN0LFxuICAgICAgICAgICAgICAgIHRvb2ssXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZS5tZXNzYWdlKVxuICAgIH1cbn0iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTLG9CQUFvQjs7O0FDV3RCLElBQU0sT0FBYSxDQUFDO0FBQ3BCLElBQU0sTUFBTSxDQUFDO0FBRWIsU0FBUyxXQUFXLE1BQVk7QUFDbkMsU0FBTyxPQUFPLE1BQU0sSUFBSTtBQUN4QixTQUFPLE9BQU8sS0FBSyxhQUFrQixTQUFPLEtBQUssS0FBSyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXZFLE9BQUssS0FBSyxHQUFHLFdBQVcsU0FBTyxJQUFJLFNBQVMsR0FBRyxDQUFDO0FBRXBEOzs7QUNwQkEsU0FBUyxpQkFBb0M7QUFLN0MsSUFBTSxrQkFBK0IsT0FDakMsV0FDQSxTQUNBLGdCQUNDO0FBRUQsTUFBSSxDQUFDLFFBQVEsV0FBVztBQUNwQixVQUFNQSxPQUFNLFlBQVksU0FBUztBQUNqQyxnQkFBWUEsS0FBSTtBQUFBLEVBQ3BCO0FBRUEsTUFBSSxVQUFVLFNBQVMsS0FDbkIsd0JBQXdCLEVBQUUsTUFBTSxXQUFXLFVBQVUsUUFBUSxVQUFVLENBQUMsR0FBRztBQUUzRSxXQUFPLFlBQVksV0FBVyxPQUFPO0FBQUEsRUFDekM7QUFFQSxRQUFNLFFBQVEsTUFBTSxJQUFJLFFBQVEsUUFBUSxXQUFXLFFBQVEsU0FBUztBQUVwRSxVQUFRLE1BQU0sTUFBTTtBQUFBLElBQ2hCLEtBQUssT0FBTztBQUNSLFVBQUksQ0FBQyxRQUFRLFdBQVc7QUFDcEIsYUFBSyxPQUFPLE1BQU07QUFBQSxNQUN0QjtBQUVBLGFBQU87QUFBQSxRQUNILEtBQUssTUFBTTtBQUFBLFFBQ1gsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1o7QUFBQSxJQUNKO0FBQUEsSUFFQSxLQUFLLE9BQU87QUFDUixZQUFNLEVBQUUsTUFBTSxLQUFLLElBQUksa0JBQWtCLElBQUksSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNqRSxZQUFNLGVBQWUsQ0FBQyxNQUFNLElBQUksRUFBRSxPQUFPLE9BQU8sRUFBRSxLQUFLLEdBQUc7QUFDMUQsWUFBTUEsT0FBTSxNQUFNLFlBQVksY0FBYyxPQUFPO0FBRW5ELFVBQUksQ0FBQyxRQUFRLFdBQVc7QUFDcEIsYUFBSyxPQUFPQSxLQUFJO0FBQUEsTUFDcEI7QUFFQSxhQUFPQTtBQUFBLElBQ1g7QUFBQSxFQUNKO0FBRUEsUUFBTSxNQUFNLE1BQU0sWUFBWSxNQUFNLFdBQVcsT0FBTztBQUV0RCxNQUFJLENBQUMsUUFBUSxXQUFXO0FBQ3BCLFNBQUssT0FBTyxJQUFJO0FBQUEsRUFDcEI7QUFFQSxTQUFPO0FBQ1g7QUFFTyxJQUFNLFVBQXVCLE9BQ2hDLFdBQ0EsU0FDQSxnQkFDQztBQUNELE1BQUk7QUFDQSxVQUFNLFFBQVEsWUFBWSxJQUFJO0FBRTlCLFFBQUksS0FBSyxXQUFXLFNBQVMsU0FBUyxHQUFHO0FBQ3JDLFlBQU0sSUFBSSxRQUFRLGlCQUFpQixXQUFXLEVBQUUsV0FBVyxRQUFRLENBQUM7QUFBQSxJQUN4RTtBQUVBLFVBQU0sU0FBUyxNQUFNLGdCQUFnQixXQUFXLFNBQVMsV0FBVztBQUNwRSxVQUFNLE9BQU8sWUFBWSxJQUFJLElBQUk7QUFFakMsUUFBSSxLQUFLLFdBQVcsU0FBUyxVQUFVLEdBQUc7QUFDdEMsWUFBTSxJQUFJLFFBQVEsaUJBQWlCLFlBQVk7QUFBQSxRQUMzQztBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0osQ0FBQztBQUFBLElBQ0w7QUFFQSxXQUFPO0FBQUEsRUFDWCxTQUFTLEdBQVE7QUFDYixVQUFNO0FBQUEsRUFDVjtBQUNKOzs7QUN0RkEsU0FBUyxhQUFBQyxrQkFBZ0M7QUFNekMsSUFBTSxlQUF5QixPQUFPLEtBQUssU0FBUyxhQUFhO0FBRTdELE1BQUlDLFdBQVUsR0FBRyxLQUFLLGFBQWEsR0FBRyxHQUFHO0FBQ3JDLFdBQU8sU0FBUyxLQUFLLE9BQU87QUFBQSxFQUNoQztBQUVBLE1BQUk7QUFDQSxVQUFNLFFBQVEsTUFBTSxJQUFJLFFBQVEsUUFBUSxHQUFHO0FBQzNDLFVBQU0sT0FBTyxNQUFNLFNBQVMsVUFBVSxNQUFNLGNBQWMsZ0JBQWdCLE1BQU0sY0FBYztBQUU5RixZQUFRLE1BQU0sTUFBTTtBQUFBLE1BQ2hCLEtBQUssT0FBTztBQUNSLGNBQU0sU0FBUyxNQUFTLFNBQVMsT0FBTyxNQUFNLE9BQVEsTUFBTSxLQUFNO0FBRWxFLGVBQU87QUFBQSxVQUNIO0FBQUEsVUFDQSxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsUUFDbEI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0osU0FBUyxHQUFRO0FBQ2IsWUFBUSxNQUFNLEVBQUUsT0FBTztBQUFBLEVBQzNCO0FBRUEsU0FBTyxTQUFTLEtBQUssT0FBTztBQUNoQztBQUVPLElBQU0sT0FBaUIsT0FBTyxLQUFLLFNBQVMsYUFBYTtBQUM1RCxNQUFJO0FBQ0EsVUFBTSxRQUFRLFlBQVksSUFBSTtBQUU5QixRQUFJLEtBQUssV0FBVyxTQUFTLE1BQU0sR0FBRztBQUNsQyxZQUFNLElBQUksUUFBUSxpQkFBaUIsUUFBUSxFQUFFLEtBQUssUUFBUSxDQUFDO0FBQUEsSUFDL0Q7QUFFQSxVQUFNLFNBQVMsTUFBTSxhQUFhLEtBQUssU0FBUyxRQUFRO0FBQ3hELFVBQU0sT0FBTyxZQUFZLElBQUksSUFBSTtBQUVqQyxRQUFJLEtBQUssV0FBVyxTQUFTLFFBQVEsR0FBRztBQUNwQyxZQUFNLEVBQUUsUUFBUSxHQUFHLEtBQUssSUFBSTtBQUM1QixZQUFNLElBQUksUUFBUSxpQkFBaUIsVUFBVTtBQUFBLFFBQ3pDO0FBQUEsUUFDQTtBQUFBLFFBQ0EsUUFBUTtBQUFBLFFBQ1I7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBRUEsV0FBTztBQUFBLEVBQ1gsU0FBUyxHQUFRO0FBQ2IsVUFBTSxJQUFJLE1BQU0sRUFBRSxPQUFPO0FBQUEsRUFDN0I7QUFDSjs7O0FIeERBLElBQUksZ0JBQWdCLFVBQVUsVUFBVSxTQUFTLE1BQU0sR0FBRztBQUN0RCxXQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFhVCxDQUFDO0FBQ0w7IiwKICAibmFtZXMiOiBbInJlcyIsICJpc0J1aWx0aW4iLCAiaXNCdWlsdGluIl0KfQo=
