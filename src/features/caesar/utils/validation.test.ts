import { describe, expect, it } from "vitest";
import { MAX_TEXT_FILE_BYTES } from "../../../shared/utils/textFileValidation";
import { parseKey, validateInput } from "./validation";

describe("validation", () => {
  it("accepts signed integer keys only", () => {
    expect(parseKey("-29")).toBe(-29n);
    expect(parseKey("+29")).toBe(29n);
    expect(parseKey("3.5")).toBeNull();
    expect(parseKey("abc")).toBeNull();
    expect(parseKey("9".repeat(400))).not.toBeNull();
    expect(parseKey("9".repeat(33), "file")).toBeNull();
  });

  it("accepts whitespace-only text and rejects an empty string", () => {
    expect(validateInput("text", "   ", null)).toBeNull();
    expect(validateInput("text", "", null)).toBe("Văn bản không được để trống.");
  });

  it("rejects unsupported and oversized files", () => {
    expect(validateInput("file", "", new File(["data"], "data.csv"))).toBe(
      "Chỉ chấp nhận file .txt.",
    );
    expect(
      validateInput("file", "", new File([new Uint8Array(MAX_TEXT_FILE_BYTES + 1)], "large.txt")),
    ).toBe("File vượt quá dung lượng tối đa 5 MB.");
    expect(
      validateInput("file", "", new File([new Uint8Array(MAX_TEXT_FILE_BYTES)], "limit.TXT")),
    ).toBeNull();
  });
});
