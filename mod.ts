// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isString, type Middleware, parseMediaType } from "./deps.ts";
import { Header } from "./constants.ts";
import { transformBody, type Transformer } from "./transform.ts";

/** Media type and transformer map. */
export interface Manifest {
  readonly [mediaType: string]: Transformer;
}

/** HTTP message content transform middleware factory.
 *
 * @example
 * ```ts
 * import contentMinify from "https://deno.land/x/http_content_minify@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * interface Minifier {
 *   (contents: ArrayBuffer): string | ArrayBuffer | Promise<string | ArrayBuffer>;
 * }
 * declare const minifyJs: Minifier;
 * declare const minifyCss: Minifier;
 * declare const request: Request;
 *
 * const middleware = contentMinify({
 *   "text/javascript": minifyJs,
 *   "text/css": minifyCss,
 * });
 * const dirtyBody = `
 *
 * console.log("hello");
 *
 * `;
 * const handler = () =>
 *   new Response(dirtyBody, {
 *     headers: { "content-type": "text/javascript;utf=8" },
 *   });
 *
 * const response = await middleware(request, handler);
 *
 * assertEquals(
 *   await response.text(),
 *   `console.log("hello");`,
 * );
 * ```
 */
export default function transform(manifest: Manifest): Middleware {
  return async (request, next) => {
    const response = await next(request);
    const contentTypeValue = response.headers.get(Header.ContentType);

    if (!isString(contentTypeValue)) return response;

    const [mediaType] = parseMediaType(contentTypeValue);
    const transformer = manifest[mediaType];

    if (!transformer) return response;

    return transformBody(response, transformer);
  };
}
