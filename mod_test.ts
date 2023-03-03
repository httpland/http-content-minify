import minify from "./mod.ts";
import {
  assert,
  assertExists,
  assertSpyCalls,
  describe,
  equalsResponse,
  it,
  spy,
} from "./_dev_deps.ts";

describe("default export", () => {
  it("should exists", () => {
    assertExists(minify);
  });

  it("should minify by css minifier", async () => {
    const minifyCss = spy(() => "test");
    const body = "abcdef";

    const middleware = minify({
      "text/css": minifyCss,
    });

    const response = await middleware(
      new Request("test:"),
      () =>
        new Response(body, {
          headers: { "content-type": "text/css;utf=8" },
        }),
    );

    assertSpyCalls(minifyCss, 1);
    assert(
      await equalsResponse(
        response,
        new Response("test", {
          headers: {
            "content-type": "text/css;utf=8",
          },
        }),
        true,
      ),
    );
  });

  it("should return same response if the response does not include content-type header", async () => {
    const minifyCss = spy(() => "test");

    const middleware = minify({
      "text/css": minifyCss,
    });

    const response = new Response();

    const newResponse = await middleware(
      new Request("test:"),
      () => response,
    );

    assertSpyCalls(minifyCss, 0);
    assert(
      await equalsResponse(
        newResponse,
        newResponse,
        true,
      ),
    );
  });

  it("should return same response if the response does not match media type", async () => {
    const minifyCss = spy(() => "test");
    const body = "abcdef";

    const middleware = minify({
      "text/css": minifyCss,
    });

    const response = new Response(body);

    const newResponse = await middleware(
      new Request("test:"),
      () => response,
    );

    assertSpyCalls(minifyCss, 0);
    assert(
      await equalsResponse(
        newResponse,
        newResponse,
        true,
      ),
    );
  });
});
