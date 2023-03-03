# http-minify

HTTP body minification middleware for standard `Request` and `Response`.

## What

Middleware for HTTP body minification.

Declaratively maps media types to minifiers.

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware factory is exported by default.

You map media type to minifier using whatever you like. The map is called a
"manifest".

```ts
import minify from "https://deno.land/x/http_minify@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

interface Minifier {
  (contents: ArrayBuffer): string | ArrayBuffer | Promise<string | ArrayBuffer>;
}
declare const minifyJs: Minifier;
declare const minifyCss: Minifier;
declare const request: Request;

const middleware = minify({
  "text/javascript": minifyJs,
  "text/css": minifyCss,
});
const dirtyBody = `

console.log("hello");

`;
const handler = () =>
  new Response(dirtyBody, {
    headers: { "content-type": "text/javascript;utf=8" },
  });

const response = await middleware(request, handler);

assertEquals(
  await response.text(),
  `console.log("hello");`,
);
```

## Effects

Middleware will effect following:

- HTTP Body
- HTTP Headers
  - `Content-Length`

## Conditions

For safety, middleware is executed only if the following conditions are met

- The body text is readable
- The `Content-type` header is present
- The `Content-Encoding` header is **not present**
- Media type matches the manifest

Note that if the body is already compressed, it does nothing.

In addition to changes to the body text due to minimization, the following
effects are also present

- The `Content-Length` header, if present, is set to a recalculated value.

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
