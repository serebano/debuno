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
  "dev:bun": "bun --preload debuno --watch example/app.ts",
  prepare: "husky"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gIFwibmFtZVwiOiBcImRlYnVub1wiLFxuICBcInZlcnNpb25cIjogXCIwLjEuMTBcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vc2VyZWJhbm8vZGVidW5vLmdpdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vc2VyZWJhbm8vZGVidW5vXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJCcmluZyBEZW5vIG1vZHVsZSByZXNvbHV0aW9uIHRvIEJ1biAmIE5vZGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiLi9idWlsZC50cyAmJiAuL3ZlcnNpb24udHNcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiYnVuIHJ1biBidWlsZFwiLFxuICAgIFwiZGV2Om5vZGVcIjogXCJub2RlIC0taW1wb3J0IGRlYnVubyAtLXdhdGNoIGV4YW1wbGUvYXBwLnRzXCIsXG4gICAgXCJkZXY6YnVuXCI6IFwiYnVuIC0tcHJlbG9hZCBkZWJ1bm8gLS13YXRjaCBleGFtcGxlL2FwcC50c1wiLFxuICAgIFwicHJlcGFyZVwiOiBcImh1c2t5XCJcbiAgfSxcbiAgXCJiaW5cIjogXCIuL2NsaS50c1wiLFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLlwiOiB7XG4gICAgICBcImJ1blwiOiBcIi4vYnVuL2luZGV4LnRzXCIsXG4gICAgICBcIm5vZGVcIjogXCIuL25vZGUvaW5kZXguanNcIlxuICAgIH0sXG4gICAgXCIuL3JlZ2lzdGVyXCI6IHtcbiAgICAgIFwiYnVuXCI6IFwiLi9idW4vcmVnaXN0ZXIudHNcIixcbiAgICAgIFwibm9kZVwiOiBcIi4vbm9kZS9yZWdpc3Rlci5qc1wiXG4gICAgfSxcbiAgICBcIi4vYXBpXCI6IHtcbiAgICAgIFwiYnVuXCI6IFwiLi9zaGFyZWQvYXBpLnRzXCIsXG4gICAgICBcImRlbm9cIjogXCIuL3NoYXJlZC9hcGkudHNcIixcbiAgICAgIFwidHlwZXNcIjogXCIuL3NoYXJlZC9hcGkudHNcIixcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L3NoYXJlZC9hcGkuanNcIlxuICAgIH0sXG4gICAgXCIuL3BhY2thZ2UuanNvblwiOiBcIi4vcGFja2FnZS5qc29uXCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcImRlbm9cIjogXCIyLjEuNFwiLFxuICAgIFwiYnVuXCI6IFwiMS4xLjQwXCIsXG4gICAgXCJub2RlXCI6IFwiMjIuOS4wXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYnVuLXR5cGVzXCI6IFwiXjEuMS40MlwiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7QUFDRSxXQUFRO0FBQ1IsY0FBVztBQUNYLFdBQVE7QUFDUixpQkFBYztBQUFBLEVBQ1osTUFBUTtBQUFBLEVBQ1IsS0FBTztBQUNUO0FBQ0EsZUFBWTtBQUNaLGtCQUFlO0FBQ2YsY0FBVztBQUFBLEVBQ1QsT0FBUztBQUFBLEVBQ1QsZ0JBQWtCO0FBQUEsRUFDbEIsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsU0FBVztBQUNiO0FBQ0EsVUFBTztBQUNQLGNBQVc7QUFBQSxFQUNULEtBQUs7QUFBQSxJQUNILEtBQU87QUFBQSxJQUNQLE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixLQUFPO0FBQUEsSUFDUCxNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsS0FBTztBQUFBLElBQ1AsTUFBUTtBQUFBLElBQ1IsT0FBUztBQUFBLElBQ1QsUUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLGtCQUFrQjtBQUNwQjtBQUNBLGNBQVc7QUFBQSxFQUNULE1BQVE7QUFBQSxFQUNSLEtBQU87QUFBQSxFQUNQLE1BQVE7QUFDVjtBQUNBLG1CQUFnQjtBQUFBLEVBQ2QsYUFBYTtBQUNmO0FBMUNGO0FBQUEsRUFDRTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBSUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBT0E7QUFBQSxFQUNBO0FBQUEsRUFpQkE7QUFBQSxFQUtBO0FBR0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
