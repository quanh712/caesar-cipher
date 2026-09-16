import type { CaesarRequest, CaesarResponse, CipherMode, FileRequest } from "../types/cipher";
import { shiftText } from "../utils/caesar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

async function parseResponse(response: Response): Promise<CaesarResponse> {
  if (!response.ok) {
    throw new Error(`Máy chủ phản hồi lỗi ${response.status}.`);
  }

  return response.json() as Promise<CaesarResponse>;
}

async function processMock(mode: CipherMode, request: CaesarRequest): Promise<CaesarResponse> {
  await wait(350);
  return {
    success: true,
    result: shiftText(request.text, mode === "encrypt" ? request.key : -request.key),
  };
}

export const caesarApi = {
  async processText(mode: CipherMode, request: CaesarRequest): Promise<CaesarResponse> {
    if (USE_MOCK_API) return processMock(mode, request);

    const response = await fetch(`${API_BASE_URL}/api/caesar/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    return parseResponse(response);
  },

  async processFile(request: FileRequest): Promise<CaesarResponse> {
    if (USE_MOCK_API) {
      const text = await request.file.text();
      return processMock(request.action, { text, key: request.key });
    }

    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("key", String(request.key));
    formData.append("action", request.action);

    const response = await fetch(`${API_BASE_URL}/api/caesar/file`, {
      method: "POST",
      body: formData,
    });

    return parseResponse(response);
  },
};
