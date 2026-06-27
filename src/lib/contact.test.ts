import { describe, expect, it } from "vitest";

import { validateContactPayload } from "./contact";

describe("validateContactPayload", () => {
  it("accepts valid input", () => {
    const result = validateContactPayload({
      name: "Jane Doe",
      email: "jane@example.com",
      context: "Need help with a backend project.",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Jane Doe",
        email: "jane@example.com",
        context: "Need help with a backend project.",
      });
    }
  });

  it("rejects missing name and invalid email", () => {
    const result = validateContactPayload({
      name: "   ",
      email: "not-an-email",
      context: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toBeDefined();
      expect(result.fieldErrors.email).toBeDefined();
    }
  });

  it("trims and enforces max lengths", () => {
    const result = validateContactPayload({
      name: `  ${"a".repeat(120)}  `,
      email: "user@example.com",
      context: "b".repeat(6000),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toHaveLength(100);
      expect(result.data.context).toHaveLength(5000);
    }
  });
});
