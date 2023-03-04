import { transformBody } from "./transform.ts";
import {
  assert,
  assertSpyCalls,
  describe,
  equalsResponse,
  it,
  RepresentationHeader,
  spy,
} from "./_dev_deps.ts";

describe("transformBody", () => {
  it("should change response body", async () => {
    const transform = spy(() => "test");

    const response = await transformBody(
      new Response(""),
      transform,
    );

    assertSpyCalls(transform, 1);
    assert(
      await equalsResponse(
        response,
        new Response("test"),
        true,
      ),
    );
  });

  it("should same response if the response body has been read", async () => {
    const minify = spy(() => "");
    const response = new Response("");

    await response.text();

    const newResponse = await transformBody(
      response,
      minify,
    );

    assert(response.bodyUsed);
    assertSpyCalls(minify, 0);
    assert(
      equalsResponse(
        response,
        newResponse,
      ),
    );
  });

  it("should same response if the response has content-encoding header", async () => {
    const transform = spy(() => "");
    const response = new Response(null, {
      headers: { [RepresentationHeader.ContentEncoding]: "" },
    });

    const newResponse = await transformBody(
      response,
      transform,
    );

    assertSpyCalls(transform, 0);
    assert(
      await equalsResponse(
        response,
        newResponse,
        true,
      ),
    );
  });

  it("should same response if the response has content-length header", async () => {
    const transform = spy(() => "");
    const response = new Response(null, {
      headers: { [RepresentationHeader.ContentLength]: "" },
    });

    const newResponse = await transformBody(
      response,
      transform,
    );

    assertSpyCalls(transform, 0);
    assert(
      await equalsResponse(
        response,
        newResponse,
        true,
      ),
    );
  });

  it("should same response if the response has etag header", async () => {
    const transform = spy(() => "");
    const response = new Response(null, {
      headers: { [RepresentationHeader.ETag]: "" },
    });

    const newResponse = await transformBody(
      response,
      transform,
    );

    assertSpyCalls(transform, 0);
    assert(
      await equalsResponse(
        response,
        newResponse,
        true,
      ),
    );
  });
});
