// debuno 0.1.9
import "./chunk-2XR4RRTH.js";

// package.json
var name = "debuno";
var version = "0.1.9";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gICAgXCJuYW1lXCI6IFwiZGVidW5vXCIsXG4gICAgXCJ2ZXJzaW9uXCI6IFwiMC4xLjlcIixcbiAgICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgICBcInJlcG9zaXRvcnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICAgICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vc2VyZWJhbm8vZGVidW5vLmdpdFwiXG4gICAgfSxcbiAgICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3NlcmViYW5vL2RlYnVub1wiLFxuICAgIFwiZGVzY3JpcHRpb25cIjogXCJCcmluZyBEZW5vIG1vZHVsZSByZXNvbHV0aW9uIHRvIEJ1biAmIE5vZGVcIixcbiAgICBcInNjcmlwdHNcIjoge1xuICAgICAgICBcImJ1aWxkXCI6IFwiLi9idWlsZC50cyAmJiAuL3ZlcnNpb24udHNcIixcbiAgICAgICAgXCJwcmVwdWJsaXNoT25seVwiOiBcImJ1biBydW4gYnVpbGRcIixcbiAgICAgICAgXCJkZXY6bm9kZVwiOiBcIm5vZGUgLS1pbXBvcnQgZGVidW5vIC0td2F0Y2ggZXhhbXBsZS9hcHAudHNcIixcbiAgICAgICAgXCJkZXY6YnVuXCI6IFwiYnVuIC0tcHJlbG9hZCBkZWJ1bm8gLS13YXRjaCBleGFtcGxlL2FwcC50c1wiXG4gICAgfSxcbiAgICBcImJpblwiOiBcIi4vY2xpLnRzXCIsXG4gICAgXCJleHBvcnRzXCI6IHtcbiAgICAgICAgXCIuXCI6IHtcbiAgICAgICAgICAgIFwiYnVuXCI6IFwiLi9idW4vaW5kZXgudHNcIixcbiAgICAgICAgICAgIFwibm9kZVwiOiBcIi4vbm9kZS9pbmRleC5qc1wiXG4gICAgICAgIH0sXG4gICAgICAgIFwiLi9yZWdpc3RlclwiOiB7XG4gICAgICAgICAgICBcImJ1blwiOiBcIi4vYnVuL3JlZ2lzdGVyLnRzXCIsXG4gICAgICAgICAgICBcIm5vZGVcIjogXCIuL25vZGUvcmVnaXN0ZXIuanNcIlxuICAgICAgICB9LFxuICAgICAgICBcIi4vYXBpXCI6IHtcbiAgICAgICAgICAgIFwiYnVuXCI6IFwiLi9zaGFyZWQvYXBpLnRzXCIsXG4gICAgICAgICAgICBcImRlbm9cIjogXCIuL3NoYXJlZC9hcGkudHNcIixcbiAgICAgICAgICAgIFwidHlwZXNcIjogXCIuL3NoYXJlZC9hcGkudHNcIixcbiAgICAgICAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L3NoYXJlZC9hcGkuanNcIlxuICAgICAgICB9LFxuICAgICAgICBcIi4vcGFja2FnZS5qc29uXCI6IFwiLi9wYWNrYWdlLmpzb25cIlxuICAgIH0sXG4gICAgXCJlbmdpbmVzXCI6IHtcbiAgICAgICAgXCJkZW5vXCI6IFwiMi4xLjRcIixcbiAgICAgICAgXCJidW5cIjogXCIxLjEuNDBcIixcbiAgICAgICAgXCJub2RlXCI6IFwiMjIuOS4wXCJcbiAgICB9LFxuICAgIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICAgICAgXCJidW4tdHlwZXNcIjogXCJeMS4xLjQyXCJcbiAgICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjs7OztBQUNJLFdBQVE7QUFDUixjQUFXO0FBQ1gsV0FBUTtBQUNSLGlCQUFjO0FBQUEsRUFDVixNQUFRO0FBQUEsRUFDUixLQUFPO0FBQ1g7QUFDQSxlQUFZO0FBQ1osa0JBQWU7QUFDZixjQUFXO0FBQUEsRUFDUCxPQUFTO0FBQUEsRUFDVCxnQkFBa0I7QUFBQSxFQUNsQixZQUFZO0FBQUEsRUFDWixXQUFXO0FBQ2Y7QUFDQSxVQUFPO0FBQ1AsY0FBVztBQUFBLEVBQ1AsS0FBSztBQUFBLElBQ0QsS0FBTztBQUFBLElBQ1AsTUFBUTtBQUFBLEVBQ1o7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLEtBQU87QUFBQSxJQUNQLE1BQVE7QUFBQSxFQUNaO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxLQUFPO0FBQUEsSUFDUCxNQUFRO0FBQUEsSUFDUixPQUFTO0FBQUEsSUFDVCxRQUFVO0FBQUEsRUFDZDtBQUFBLEVBQ0Esa0JBQWtCO0FBQ3RCO0FBQ0EsY0FBVztBQUFBLEVBQ1AsTUFBUTtBQUFBLEVBQ1IsS0FBTztBQUFBLEVBQ1AsTUFBUTtBQUNaO0FBQ0EsbUJBQWdCO0FBQUEsRUFDWixhQUFhO0FBQ2pCO0FBekNKO0FBQUEsRUFDSTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBSUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBTUE7QUFBQSxFQUNBO0FBQUEsRUFpQkE7QUFBQSxFQUtBO0FBR0o7IiwKICAibmFtZXMiOiBbXQp9Cg==
