// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { RepresentationHeader } from "./deps.ts";

/** Contents transformer API. */
export interface Transformer {
  (contents: ArrayBuffer): BodyInit | Promise<BodyInit>;
}

export function transformBody(
  response: Response,
  transformer: Transformer,
): Response | Promise<Response> {
  if (
    response.bodyUsed ||
    response.headers.has(RepresentationHeader.ContentEncoding) ||
    response.headers.has(RepresentationHeader.ContentLength) ||
    response.headers.has(RepresentationHeader.ETag)
  ) return response;

  return response
    .clone()
    .arrayBuffer()
    .then(transformer)
    .then((body) => new Response(body, response));
}
