import type { InputType } from "../../../shared/types/cipher";
import { validateTextFile } from "../../../shared/utils/textFileValidation";

export function validateVigenereInput(
  inputType: InputType,
  text: string,
  file: File | null,
): string | null {
  if (inputType === "text") return text.length === 0 ? "Văn bản không được để trống." : null;
  return validateTextFile(file);
}

export function validateVigenereKey(key: string): string | null {
  if (key.length === 0) return "Thiếu khóa.";
  return /^[A-Za-z]+$/.test(key) ? null : "Khóa Vigenère chỉ được chứa chữ cái A-Z hoặc a-z.";
}
