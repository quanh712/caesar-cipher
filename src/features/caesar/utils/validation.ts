import type { InputType } from "../types/cipher";
import { validateTextFile } from "../../../shared/utils/textFileValidation";

export const MAX_FILE_KEY_LENGTH = 32;

export function parseKey(value: string, inputType: InputType = "text"): bigint | null {
  const trimmedValue = value.trim();
  if (!/^[+-]?\d+$/.test(trimmedValue)) return null;
  if (inputType === "file" && trimmedValue.length > MAX_FILE_KEY_LENGTH) return null;

  try {
    return BigInt(trimmedValue);
  } catch {
    return null;
  }
}

export function validateInput(
  inputType: InputType,
  text: string,
  file: File | null,
): string | null {
  if (inputType === "text") {
    return text.length > 0 ? null : "Văn bản không được để trống.";
  }

  return validateTextFile(file);
}
