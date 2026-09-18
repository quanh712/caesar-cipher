import type { CipherMode, InputType } from "../../../shared/types/cipher";

export type ProcessingStatus = "idle" | "loading" | "success" | "error";

export interface VigenereResultSnapshot {
  text: string;
  source: string;
  mode: CipherMode;
  inputType: InputType;
  file?: File;
  keyValue: string;
  normalizedKey: string;
}
