import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { getJwtSecret } from "./jwtSecret.js";

const originalSecret = process.env.JWT_SECRET;

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

describe("getJwtSecret", () => {
  it("rejects a missing secret", () => {
    delete process.env.JWT_SECRET;
    assert.throws(getJwtSecret, /unique random value of at least 32 characters/);
  });

  it("rejects known insecure defaults", () => {
    process.env.JWT_SECRET = "dev_secret";
    assert.throws(getJwtSecret, /unique random value of at least 32 characters/);
  });

  it("rejects short secrets", () => {
    process.env.JWT_SECRET = "too-short";
    assert.throws(getJwtSecret, /unique random value of at least 32 characters/);
  });

  it("accepts a configured secret with at least 32 characters", () => {
    const secret = "runtime-validation-only-secret-key-123456";
    process.env.JWT_SECRET = secret;
    assert.equal(getJwtSecret(), secret);
  });
});
