import { describe, expect, it } from "vitest";
import { MAX_FILE_BYTES, parseKey, validateInput } from "./validation";

describe("validation", () => {
  it("accepts signed integer keys only", () => {
    expect(parseKey("-29")).toBe(-29);
    expect(parseKey("3.5")).toBeNull();
    expect(parseKey("abc")).toBeNull();
    expect(parseKey("9".repeat(400))).toBeNull();
  });

  it("rejects empty text", () => {
    expect(validateInput("text", "   ", null)).toBe("Văn bản không được để trống.");
  });

  it("rejects unsupported and oversized files", () => {
    expect(validateInput("file", "", new File(["data"], "data.csv"))).toBe("Chỉ hỗ trợ file .txt.");
    expect(
      validateInput("file", "", new File([new Uint8Array(MAX_FILE_BYTES + 1)], "large.txt")),
    ).toBe("File không được vượt quá 1 MB.");
  });
});
