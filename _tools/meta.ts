import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/http-minify",
    version,
    description:
      "HTTP body minification middleware for standard request and response",
    keywords: [
      "http",
      "body",
      "content-type",
      "middleware",
      "minify",
      "minification",
      "request",
      "response",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/http-minify",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/http-minify.git",
    },
    bugs: {
      url: "https://github.com/httpland/http-minify/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
});
