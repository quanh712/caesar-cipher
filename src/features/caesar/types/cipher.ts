export type CipherMode = "encrypt" | "decrypt";
export type CipherAlgorithm = "caesar" | "hill" | "huffman";
export type InputType = "text" | "file";
export type NoticeKind = "success" | "error";
export type ProcessingStatus = "idle" | "loading" | "success" | "error";

export interface CaesarRequest {
  text: string;
  key: number;
}

export interface CaesarResponse {
  success: boolean;
  result?: string;
  message?: string;
}

export interface FileRequest {
  file: File;
  key: number;
  action: CipherMode;
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
  keyValue: string;
  normalizedKey: number;
}
