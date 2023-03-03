import { isString, type Middleware, parseMediaType } from "./deps.ts";
import { Header } from "./constants.ts";
import { Minifier, withMinify } from "./downstream.ts";
export { type Minifier } from "./downstream.ts";

/** Media type and minifier map. */
export interface Manifest {
  readonly [mediaType: string]: Minifier;
}

/** HTTP body minification middleware factory.
 *
 * @example
 * ```ts
 * import minify from "https://deno.land/x/http_minify@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * interface Minifier {
 *   (contents: ArrayBuffer): string | ArrayBuffer | Promise<string | ArrayBuffer>;
 * }
 * declare const minifyJs: Minifier;
 * declare const minifyCss: Minifier;
 * declare const request: Request;
 *
 * const middleware = minify({
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
export default function minify(manifest: Manifest): Middleware {
  return async (request, next) => {
    const response = await next(request);
    const contentTypeValue = response.headers.get(Header.ContentType);

    if (!isString(contentTypeValue)) return response;

    const [mediaType] = parseMediaType(contentTypeValue);
    const minifier = manifest[mediaType];

    if (!minifier) return response;

    return withMinify(response, minifier);
  };
}
