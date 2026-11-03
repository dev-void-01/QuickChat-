import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { formatMessageTime, readFileAsDataURL } from "./lib.js";

const originalFileReader = globalThis.FileReader;

afterEach(() => {
  if (originalFileReader) {
    globalThis.FileReader = originalFileReader;
  } else {
    delete globalThis.FileReader;
  }
});

describe("formatMessageTime", () => {
  it("formats a local time with two-digit hours and minutes", () => {
    assert.equal(formatMessageTime(new Date(2024, 0, 1, 7, 5)), "07:05");
  });
});

describe("readFileAsDataURL", () => {
  it("resolves with the file reader result", async () => {
    globalThis.FileReader = class {
      readAsDataURL(file) {
        this.result = file.dataURL;
        queueMicrotask(() => this.onload());
      }
    };

    assert.equal(
      await readFileAsDataURL({ dataURL: "data:image/png;base64,abc" }),
      "data:image/png;base64,abc"
    );
  });

  it("rejects when the file reader fails", async () => {
    globalThis.FileReader = class {
      readAsDataURL() {
        queueMicrotask(() => this.onerror(new Error("read failed")));
      }
    };

    await assert.rejects(readFileAsDataURL({}), /read failed/);
  });
});
