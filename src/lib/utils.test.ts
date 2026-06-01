import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("combines and deduplicates classes", () => {
    expect(cn("p-2", "p-4", "text-sm", "text-sm")).toBe("p-4 text-sm");
  });
});
