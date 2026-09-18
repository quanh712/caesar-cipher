import { describe, expect, it } from "vitest";
import { MAX_TEXT_FILE_BYTES } from "../../../shared/utils/textFileValidation";
import { validateVigenereInput, validateVigenereKey } from "./validation";

describe("Vigenère validation", () => {
  it.each(["LEMON", "lemon", "AbCd"])("accepts ASCII-letter key %s", (key) => {
    expect(validateVigenereKey(key)).toBeNull();
  });

  it.each(["", "LE MON", "KEY1", "KHÓA", " LEMON"])("rejects key %j", (key) => {
    expect(validateVigenereKey(key)).not.toBeNull();
  });

  it("accepts whitespace-only text", () => {
    expect(validateVigenereInput("text", " \n\t", null)).toBeNull();
  });

  it("enforces the exact file boundaries", () => {
    expect(validateVigenereInput("file", "", new File(["x"], "DATA.TXT"))).toBeNull();
    expect(
      validateVigenereInput(
        "file",
        "",
        new File([new Uint8Array(MAX_TEXT_FILE_BYTES + 1)], "large.txt"),
      ),
    ).toBe("File vượt quá dung lượng tối đa 5 MB.");
  });
});
