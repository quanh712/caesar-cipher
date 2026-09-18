export const MAX_TEXT_FILE_BYTES = 5 * 1024 * 1024;

export function validateTextFile(file: File | null): string | null {
  if (!file) return "Vui lòng chọn file.";
  if (!/\.txt$/i.test(file.name)) return "Chỉ chấp nhận file .txt.";
  if (file.size > MAX_TEXT_FILE_BYTES) return "File vượt quá dung lượng tối đa 5 MB.";
  if (file.size === 0) return "File không được để trống.";
  return null;
}

export async function readTextFile(file: File): Promise<string> {
  if (typeof file.text === "function") return file.text();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
