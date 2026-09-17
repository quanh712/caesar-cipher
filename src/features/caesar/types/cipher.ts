export type CipherMode = "encrypt" | "decrypt";
export type InputType = "text" | "file";
export type NoticeKind = "success" | "error";
export type ProcessingStatus = "idle" | "loading" | "success" | "error";

export interface CaesarRequest {
  text: string;
  keyToken: string;
}

export interface CaesarSuccessResponse {
  success: true;
  result: string;
}

export interface FileRequest {
  file: File;
  rawKey: string;
  action: CipherMode;
}

export interface DownloadResponse {
  blob: Blob;
  filename: string;
}

export interface NoticeState {
  kind: NoticeKind;
  message: string;
}

export interface CipherResultSnapshot {
  text: string;
  source: string;
  mode: CipherMode;
  inputType: InputType;
  fileName?: string;
  file?: File;
  keyValue: string;
  normalizedKey: number;
}
