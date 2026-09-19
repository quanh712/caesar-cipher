import { describe, expect, it } from "vitest";
import { validatePlayfairInput, validatePlayfairKey } from "./validation";

describe("Playfair validation", () => {
  it.each(["MONARCHY", "PLAYFAIR EXAMPLE", "khóa-KEY-123"])("accepts key %j", (key) => {
    expect(validatePlayfairKey(key)).toBeNull();
  });

  it.each(["", "   123", "độ"])("rejects key without ASCII letters %j", (key) => {
    expect(validatePlayfairKey(key)).not.toBeNull();
  });

  it("enforces decrypt digraph rules", () => {
    expect(validatePlayfairInput("decrypt", "text", "ABC", null)).toMatch(/chẵn/);
    expect(validatePlayfairInput("decrypt", "text", "AABC", null)).toMatch(/giống nhau/);
    expect(validatePlayfairInput("decrypt", "text", "BMOD", null)).toBeNull();
  });
});
