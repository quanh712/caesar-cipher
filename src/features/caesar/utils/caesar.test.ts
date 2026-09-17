import { describe, expect, it } from "vitest";
import { normalizeKey, shiftText } from "./caesar";

describe("Caesar utilities", () => {
  it.each([
    [3n, 3],
    [29n, 3],
    [-3n, 23],
    [26n, 0],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeKey(input)).toBe(expected);
  });

  it("shifts ASCII letters and preserves other characters", () => {
    expect(shiftText("Xin chào 2026!", 3)).toBe("Alq fkàr 2026!");
  });

  it("decrypts by accepting a negative key", () => {
    expect(shiftText("Khoor Zruog", -3)).toBe("Hello World");
  });
});
