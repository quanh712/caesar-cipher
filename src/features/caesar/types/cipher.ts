export type CipherMode = "encrypt" | "decrypt";
export type CipherAlgorithm = "caesar" | "hill" | "huffman";
export type InputType = "text" | "file";
export type NoticeKind = "success" | "error";

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
