import type { InputType } from "../types/cipher";

export const MAX_FILE_BYTES = 1024 * 1024;

export function parseKey(value: string): number | null {
  const trimmedValue = value.trim();
  if (!/^-?\d+$/.test(trimmedValue)) return null;

  const parsedValue = Number(trimmedValue);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

export function validateInput(
  inputType: InputType,
  text: string,
  file: File | null,
): string | null {
  if (inputType === "text") {
    return text.trim() ? null : "Văn bản không được để trống.";
  }

  if (!file) return "Vui lòng chọn file.";
  if (!/\.txt$/i.test(file.name)) return "Chỉ hỗ trợ file .txt.";
  if (file.size === 0) return "File không được để trống.";
  if (file.size > MAX_FILE_BYTES) return "File không được vượt quá 1 MB.";
  return null;
}
