// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isString } from "./deps.ts";
import { Header } from "./constants.ts";

export function calcLength(input: string | ArrayBuffer): number {
  input = isString(input) ? new TextEncoder().encode(input) : input;

  return input.byteLength;
}

/** Content minifier API. */
export interface Minifier {
  (contents: ArrayBuffer): string | ArrayBuffer | Promise<string | ArrayBuffer>;
}

export function withMinify(
  response: Response,
  minify: Minifier,
): Response | Promise<Response> {
  if (
    response.bodyUsed ||
    response.headers.has(Header.ContentEncoding)
  ) return response;

  return response
    .clone()
    .arrayBuffer()
    .then(minify)
    .then((body) => {
      const headers = new Headers(response.headers);

      if (headers.has(Header.ContentLength)) {
        const length = calcLength(body);

        headers.set(Header.ContentLength, length.toString());
      }

      return [body, { ...response, headers }] as const;
    }).then((v) => new Response(...v));
}
