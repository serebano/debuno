// debuno 0.1.10
import "./chunk-JEKSUIAS.js";

// package.json
var name = "debuno";
var version = "0.1.10";
var type = "module";
var repository = {
  type: "git",
  url: "https://github.com/serebano/debuno.git"
};
var homepage = "https://github.com/serebano/debuno";
var description = "Bring Deno module resolution to Bun & Node";
var scripts = {
  build: "./build.ts && ./version.ts",
  prepublishOnly: "bun run build",
  "dev:node": "node --import debuno --watch example/app.ts",
  "dev:bun": "bun --preload debuno --watch example/app.ts"
};
var bin = "./cli.ts";
var exports = {
  ".": {
    bun: "./bun/index.ts",
    node: "./node/index.js"
  },
  "./register": {
    bun: "./bun/register.ts",
    node: "./node/register.js"
  },
  "./api": {
    bun: "./shared/api.ts",
    deno: "./shared/api.ts",
    types: "./shared/api.ts",
    import: "./dist/shared/api.js"
  },
  "./package.json": "./package.json"
};
var engines = {
  deno: "2.1.4",
  bun: "1.1.40",
  node: "22.9.0"
};
var dependencies = {
  "bun-types": "^1.1.42"
};
var package_default = {
  name,
  version,
  type,
  repository,
  homepage,
  description,
  scripts,
  bin,
  exports,
  engines,
  dependencies
};
export {
  bin,
  package_default as default,
  dependencies,
  description,
  engines,
  exports,
  homepage,
  name,
  repository,
  scripts,
  type,
  version
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gICAgXCJuYW1lXCI6IFwiZGVidW5vXCIsXG4gICAgXCJ2ZXJzaW9uXCI6IFwiMC4xLjEwXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gICAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3NlcmViYW5vL2RlYnVuby5naXRcIlxuICAgIH0sXG4gICAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9zZXJlYmFuby9kZWJ1bm9cIixcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiQnJpbmcgRGVubyBtb2R1bGUgcmVzb2x1dGlvbiB0byBCdW4gJiBOb2RlXCIsXG4gICAgXCJzY3JpcHRzXCI6IHtcbiAgICAgICAgXCJidWlsZFwiOiBcIi4vYnVpbGQudHMgJiYgLi92ZXJzaW9uLnRzXCIsXG4gICAgICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJidW4gcnVuIGJ1aWxkXCIsXG4gICAgICAgIFwiZGV2Om5vZGVcIjogXCJub2RlIC0taW1wb3J0IGRlYnVubyAtLXdhdGNoIGV4YW1wbGUvYXBwLnRzXCIsXG4gICAgICAgIFwiZGV2OmJ1blwiOiBcImJ1biAtLXByZWxvYWQgZGVidW5vIC0td2F0Y2ggZXhhbXBsZS9hcHAudHNcIlxuICAgIH0sXG4gICAgXCJiaW5cIjogXCIuL2NsaS50c1wiLFxuICAgIFwiZXhwb3J0c1wiOiB7XG4gICAgICAgIFwiLlwiOiB7XG4gICAgICAgICAgICBcImJ1blwiOiBcIi4vYnVuL2luZGV4LnRzXCIsXG4gICAgICAgICAgICBcIm5vZGVcIjogXCIuL25vZGUvaW5kZXguanNcIlxuICAgICAgICB9LFxuICAgICAgICBcIi4vcmVnaXN0ZXJcIjoge1xuICAgICAgICAgICAgXCJidW5cIjogXCIuL2J1bi9yZWdpc3Rlci50c1wiLFxuICAgICAgICAgICAgXCJub2RlXCI6IFwiLi9ub2RlL3JlZ2lzdGVyLmpzXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIuL2FwaVwiOiB7XG4gICAgICAgICAgICBcImJ1blwiOiBcIi4vc2hhcmVkL2FwaS50c1wiLFxuICAgICAgICAgICAgXCJkZW5vXCI6IFwiLi9zaGFyZWQvYXBpLnRzXCIsXG4gICAgICAgICAgICBcInR5cGVzXCI6IFwiLi9zaGFyZWQvYXBpLnRzXCIsXG4gICAgICAgICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9zaGFyZWQvYXBpLmpzXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIuL3BhY2thZ2UuanNvblwiOiBcIi4vcGFja2FnZS5qc29uXCJcbiAgICB9LFxuICAgIFwiZW5naW5lc1wiOiB7XG4gICAgICAgIFwiZGVub1wiOiBcIjIuMS40XCIsXG4gICAgICAgIFwiYnVuXCI6IFwiMS4xLjQwXCIsXG4gICAgICAgIFwibm9kZVwiOiBcIjIyLjkuMFwiXG4gICAgfSxcbiAgICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgICAgIFwiYnVuLXR5cGVzXCI6IFwiXjEuMS40MlwiXG4gICAgfVxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7QUFDSSxXQUFRO0FBQ1IsY0FBVztBQUNYLFdBQVE7QUFDUixpQkFBYztBQUFBLEVBQ1YsTUFBUTtBQUFBLEVBQ1IsS0FBTztBQUNYO0FBQ0EsZUFBWTtBQUNaLGtCQUFlO0FBQ2YsY0FBVztBQUFBLEVBQ1AsT0FBUztBQUFBLEVBQ1QsZ0JBQWtCO0FBQUEsRUFDbEIsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUNmO0FBQ0EsVUFBTztBQUNQLGNBQVc7QUFBQSxFQUNQLEtBQUs7QUFBQSxJQUNELEtBQU87QUFBQSxJQUNQLE1BQVE7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDVixLQUFPO0FBQUEsSUFDUCxNQUFRO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsS0FBTztBQUFBLElBQ1AsTUFBUTtBQUFBLElBQ1IsT0FBUztBQUFBLElBQ1QsUUFBVTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLGtCQUFrQjtBQUN0QjtBQUNBLGNBQVc7QUFBQSxFQUNQLE1BQVE7QUFBQSxFQUNSLEtBQU87QUFBQSxFQUNQLE1BQVE7QUFDWjtBQUNBLG1CQUFnQjtBQUFBLEVBQ1osYUFBYTtBQUNqQjtBQXpDSjtBQUFBLEVBQ0k7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUlBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQU1BO0FBQUEsRUFDQTtBQUFBLEVBaUJBO0FBQUEsRUFLQTtBQUdKOyIsCiAgIm5hbWVzIjogW10KfQo=
