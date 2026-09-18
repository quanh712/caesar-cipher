import {
  downloadFile,
  previewFile,
  transformText,
  type DownloadResponse,
  type SuccessResponse,
} from "../../../shared/services/cipherApi";
import type { CaesarRequest, CipherMode, FileRequest } from "../types/cipher";

export { CipherApiError as CaesarApiError } from "../../../shared/services/cipherApi";

export const caesarApi = {
  processText(mode: CipherMode, request: CaesarRequest): Promise<SuccessResponse> {
    const body = `{"text":${JSON.stringify(request.text)},"key":${request.keyToken}}`;
    return transformText("caesar", mode, body);
  },

  previewFile(request: FileRequest): Promise<SuccessResponse> {
    return previewFile({
      cipher: "caesar",
      file: request.file,
      key: request.rawKey.trim(),
      action: request.action,
    });
  },

  downloadFile(request: FileRequest): Promise<DownloadResponse> {
    return downloadFile({
      cipher: "caesar",
      file: request.file,
      key: request.rawKey.trim(),
      action: request.action,
    });
  },
};
