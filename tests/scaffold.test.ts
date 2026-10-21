import { describe, it, expect } from "vitest";
import { hello, OLF_VERSION } from "../src/index.js";

describe("scaffold baseline", () => {
  it("returns ready message", () => {
    expect(hello()).toBe("OLF scaffold ready");
  });
  it("has a version", () => {
    expect(OLF_VERSION).toBe("0.1.0");
  });
});
