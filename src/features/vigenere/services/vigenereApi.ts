import { downloadFile, previewFile, transformText } from "../../../shared/services/cipherApi";
import type { CipherMode } from "../../../shared/types/cipher";

export const vigenereApi = {
  processText(mode: CipherMode, text: string, key: string) {
    return transformText("vigenere", mode, JSON.stringify({ text, key }));
  },

  previewFile(mode: CipherMode, file: File, key: string) {
    return previewFile({ cipher: "vigenere", file, key, action: mode });
  },

  downloadFile(mode: CipherMode, file: File, key: string) {
    return downloadFile({ cipher: "vigenere", file, key, action: mode });
  },
};
