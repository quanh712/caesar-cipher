export type { CipherAlgorithm } from "../config/cipherAlgorithms";
export type CipherMode = "encrypt" | "decrypt";
export type InputType = "text" | "file";
export type NoticeKind = "success" | "error";

export interface NoticeState {
  kind: NoticeKind;
  message: string;
}
