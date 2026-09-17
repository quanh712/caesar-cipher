import type {
  CaesarRequest,
  CaesarSuccessResponse,
  CipherMode,
  DownloadResponse,
  FileRequest,
} from "../types/cipher";
import { shiftText } from "../utils/caesar";
import { MAX_FILE_BYTES, parseKey } from "../utils/validation";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
const SYSTEM_ERROR = "Đã xảy ra lỗi hệ thống.";

const mockDelay = () => new Promise((resolve) => window.setTimeout(resolve, 50));

export class CaesarApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CaesarApiError";
  }
}

function apiError(message: string, status: number): never {
  throw new CaesarApiError(message, status);
}

async function readJsonEnvelope(response: Response): Promise<CaesarSuccessResponse> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    apiError(SYSTEM_ERROR, response.status);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    apiError(SYSTEM_ERROR, response.status);
  }

  if (!response.ok || !isSuccessEnvelope(body)) {
    const message = isErrorEnvelope(body) ? body.message : SYSTEM_ERROR;
    apiError(message, response.status);
  }

  return body;
}

function isSuccessEnvelope(value: unknown): value is CaesarSuccessResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Record<string, unknown>).success === true &&
    typeof (value as Record<string, unknown>).result === "string"
  );
}

function isErrorEnvelope(value: unknown): value is { success: false; message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Record<string, unknown>).success === false &&
    typeof (value as Record<string, unknown>).message === "string"
  );
}

function createFileForm(request: FileRequest, responseMode: "content" | "file") {
  const data = new FormData();
  data.append("file", request.file);
  data.append("key", request.rawKey.trim());
  data.append("action", request.action);
  data.append("response_mode", responseMode);
  return data;
}

function attachmentFilename(disposition: string): string | null {
  const utf8 = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1]);
    } catch {
      return null;
    }
  }

  const quoted = disposition.match(/filename="((?:\\.|[^"])*)"/i);
  return quoted ? quoted[1].replace(/\\([\\"])/g, "$1") : null;
}

function resultFilename(filename: string, mode: CipherMode) {
  return `${filename.replace(/\.txt$/i, "")}.${mode === "encrypt" ? "encrypted" : "decrypted"}.txt`;
}

function validateMockFile(request: FileRequest) {
  if (!/\.txt$/i.test(request.file.name)) apiError("Chỉ chấp nhận file .txt.", 415);
  if (request.file.size > MAX_FILE_BYTES) apiError("File vượt quá dung lượng tối đa 5 MB.", 413);
  if (request.file.size === 0) apiError("File không được để trống.", 422);
  if (parseKey(request.rawKey, "file") === null) apiError("Khóa phải là số nguyên.", 422);
}

async function readMockFile(file: File) {
  const buffer =
    typeof file.arrayBuffer === "function"
      ? await file.arrayBuffer()
      : await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
  const bytes = new Uint8Array(buffer);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  try {
    return {
      text: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      hasBom,
    };
  } catch {
    return apiError("File phải sử dụng UTF-8.", 415);
  }
}

async function mockFileResult(request: FileRequest) {
  validateMockFile(request);
  const decoded = await readMockFile(request.file);
  const key = parseKey(request.rawKey, "file")!;
  const normalized = Number(((key % 26n) + 26n) % 26n);
  return {
    result: shiftText(decoded.text, request.action === "encrypt" ? normalized : -normalized),
    hasBom: decoded.hasBom,
  };
}

async function mockText(mode: CipherMode, request: CaesarRequest): Promise<CaesarSuccessResponse> {
  await mockDelay();
  if (request.text.length === 0) apiError("Văn bản không được để trống.", 422);
  const key = parseKey(request.keyToken);
  if (key === null) apiError("Khóa phải là số nguyên.", 422);
  const normalized = Number(((key % 26n) + 26n) % 26n);
  return {
    success: true,
    result: shiftText(request.text, mode === "encrypt" ? normalized : -normalized),
  };
}

async function mockDownload(request: FileRequest): Promise<DownloadResponse> {
  await mockDelay();
  const { result, hasBom } = await mockFileResult(request);
  const content = new TextEncoder().encode(result);
  const bytes = hasBom ? new Uint8Array(content.length + 3) : content;
  if (hasBom) {
    bytes.set([0xef, 0xbb, 0xbf]);
    bytes.set(content, 3);
  }
  return {
    blob: new Blob([bytes], { type: "text/plain;charset=utf-8" }),
    filename: resultFilename(request.file.name, request.action),
  };
}

export const isMockApiEnabled = USE_MOCK_API;

export const caesarApi = {
  async processText(mode: CipherMode, request: CaesarRequest): Promise<CaesarSuccessResponse> {
    if (USE_MOCK_API) return mockText(mode, request);

    const body = `{"text":${JSON.stringify(request.text)},"key":${request.keyToken}}`;
    const response = await fetch(`/api/caesar/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    return readJsonEnvelope(response);
  },

  async previewFile(request: FileRequest): Promise<CaesarSuccessResponse> {
    if (USE_MOCK_API) {
      await mockDelay();
      const { result } = await mockFileResult(request);
      return { success: true, result };
    }

    const response = await fetch("/api/caesar/file", {
      method: "POST",
      body: createFileForm(request, "content"),
    });
    return readJsonEnvelope(response);
  },

  async downloadFile(request: FileRequest): Promise<DownloadResponse> {
    if (USE_MOCK_API) return mockDownload(request);

    const response = await fetch("/api/caesar/file", {
      method: "POST",
      body: createFileForm(request, "file"),
    });
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || contentType.toLowerCase().includes("application/json")) {
      await readJsonEnvelope(response);
      apiError("Không thể tải kết quả. Vui lòng thử lại.", response.status);
    }
    if (!contentType.toLowerCase().startsWith("text/plain")) {
      apiError(SYSTEM_ERROR, response.status);
    }

    const filename = attachmentFilename(response.headers.get("content-disposition") ?? "");
    if (!filename) apiError(SYSTEM_ERROR, response.status);
    return { blob: await response.blob(), filename };
  },
};
