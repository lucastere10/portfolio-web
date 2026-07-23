import { describe, expect, it } from "vitest";
import { collectMessageKeyParityIssues } from "../../scripts/validate-locales";
import en from "../../messages/en.json";
import ptBR from "../../messages/pt-BR.json";

describe("message key parity", () => {
  it("en.json and pt-BR.json share the same key tree", () => {
    expect(collectMessageKeyParityIssues(en, ptBR)).toEqual([]);
  });

  it("detects missing keys", () => {
    const issues = collectMessageKeyParityIssues(
      { a: { b: "x" } },
      { a: {} },
    );
    expect(issues).toContain("pt missing: a.b");
  });
});
