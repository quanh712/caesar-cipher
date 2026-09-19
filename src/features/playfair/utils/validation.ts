import type { CipherMode, InputType } from "../../../shared/types/cipher";
import { validateTextFile } from "../../../shared/utils/textFileValidation";

export function normalizePlayfairLetters(value: string): string {
  return Array.from(value)
    .filter((character) => /[A-Za-z]/.test(character))
    .map((character) => (character.toUpperCase() === "J" ? "I" : character.toUpperCase()))
    .join("");
}

export function validatePlayfairInput(
  mode: CipherMode,
  inputType: InputType,
  text: string,
  file: File | null,
): string | null {
  if (inputType === "file") return validateTextFile(file);
  if (text.length === 0) return "Văn bản không được để trống.";

  const normalized = normalizePlayfairLetters(text);
  if (normalized.length === 0) {
    return "Văn bản Playfair phải chứa ít nhất một chữ cái A-Z hoặc a-z.";
  }
  if (mode === "decrypt" && normalized.length % 2 !== 0) {
    return "Bản mã Playfair phải chứa số lượng chữ cái chẵn.";
  }
  if (
    mode === "decrypt" &&
    Array.from({ length: normalized.length / 2 }, (_, index) => index * 2).some(
      (index) => normalized[index] === normalized[index + 1],
    )
  ) {
    return "Bản mã Playfair không được chứa cặp hai chữ cái giống nhau.";
  }
  return null;
}

export function validatePlayfairKey(key: string): string | null {
  if (key.length === 0) return "Thiếu khóa.";
  return normalizePlayfairLetters(key).length > 0
    ? null
    : "Khóa Playfair phải chứa ít nhất một chữ cái A-Z hoặc a-z.";
}
