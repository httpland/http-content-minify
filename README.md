# http-body-minify

HTTP body minification middleware for standard `Request` and `Response`.

## What

Middleware for HTTP body minification.

Declaratively maps media types to transformers.

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware factory is exported by default.

You map media type to transformer using whatever you like. The map is called a
"manifest".

```ts
import bodyMinify from "https://deno.land/x/http_minify@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

interface Transformer {
  (contents: ArrayBuffer): BodyInit | Promise<BodyInit>;
}
declare const minifyJs: Transformer;
declare const minifyCss: Transformer;
declare const request: Request;

const middleware = bodyMinify({
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

## Conditions

For safety, middleware is executed only if the following conditions are met:

- The body text is readable
- The `Content-Type` header exists
- Media type matches the manifest
- The `Content-Encoding` header **does not exist**
- The `Content-Length` header **does not exist**
- The `ETag` header **does not exist**

Note that middleware will not execute if there are already headers that would be
affected by changes to the body.

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
