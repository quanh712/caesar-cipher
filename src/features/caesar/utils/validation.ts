import type { InputType } from "../types/cipher";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
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

  if (!file) return "Vui lòng chọn file.";
  if (!/\.txt$/i.test(file.name)) return "Chỉ chấp nhận file .txt.";
  if (file.size > MAX_FILE_BYTES) return "File vượt quá dung lượng tối đa 5 MB.";
  if (file.size === 0) return "File không được để trống.";
  return null;
}
