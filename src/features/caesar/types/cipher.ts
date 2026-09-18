import type { CipherMode, InputType } from "../../../shared/types/cipher";

export type {
  CipherAlgorithm,
  CipherMode,
  InputType,
  NoticeKind,
  NoticeState,
} from "../../../shared/types/cipher";
export type ProcessingStatus = "idle" | "loading" | "success" | "error";

export interface CaesarRequest {
  text: string;
  keyToken: string;
}

export interface FileRequest {
  file: File;
  rawKey: string;
  action: CipherMode;
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
