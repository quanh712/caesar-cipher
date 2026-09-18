import { describe, expect, it } from "vitest";
import { analyzeVigenere, VIGENERE_ANALYSIS_LIMIT } from "./analysis";

describe("Vigenère analysis", () => {
  it("does not advance the key for non-ASCII characters", () => {
    const analysis = analyzeVigenere("Aé-A", "bc");
    expect(analysis.keyStream).toBe("B··C");
    expect(analysis.transformedCharacters).toBe(2);
    expect(analysis.unchangedCharacters).toBe(2);
  });

  it("caps the visualization without truncating totals", () => {
    const analysis = analyzeVigenere("A".repeat(VIGENERE_ANALYSIS_LIMIT + 5), "KEY");
    expect(analysis.shownCharacters).toBe(VIGENERE_ANALYSIS_LIMIT);
    expect(analysis.totalCharacters).toBe(VIGENERE_ANALYSIS_LIMIT + 5);
    expect(analysis.truncated).toBe(true);
  });
});
