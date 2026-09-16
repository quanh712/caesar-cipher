import { useMemo, useState } from "react";
import { caesarApi } from "../services/caesarApi";
import type { CipherAlgorithm, CipherMode, InputType, NoticeState } from "../types/cipher";
import { normalizeKey } from "../utils/caesar";
import { parseKey, validateInput } from "../utils/validation";

export function useCaesarCipher() {
  const [algorithm, setAlgorithm] = useState<CipherAlgorithm>("caesar");
  const [mode, setMode] = useState<CipherMode>("encrypt");
  const [inputType, setInputType] = useState<InputType>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("3");
  const [result, setResult] = useState("");
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parsedKey = useMemo(() => parseKey(key), [key]);
  const inputError = useMemo(() => validateInput(inputType, text, file), [file, inputType, text]);
  const keyError = key.trim() && parsedKey === null ? "Khóa phải là số nguyên." : null;
  const isAlgorithmAvailable = algorithm === "caesar";
  const canSubmit = isAlgorithmAvailable && !isLoading && !inputError && parsedKey !== null;

  async function processCipher() {
    if (!canSubmit || parsedKey === null) return;

    setIsLoading(true);
    setNotice(null);

    try {
      const response = inputType === "text"
        ? await caesarApi.processText(mode, { text, key: parsedKey })
        : await caesarApi.processFile({ file: file!, key: parsedKey, action: mode });

      if (!response.success || response.result === undefined) {
        throw new Error(response.message || "Không thể xử lý dữ liệu.");
      }

      setResult(response.result);
      setNotice({
        kind: "success",
        message: mode === "encrypt" ? "Mã hóa thành công." : "Giải mã thành công.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message: error instanceof Error ? error.message : "Không kết nối được máy chủ.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function resetInput() {
    setText("");
    setFile(null);
    setNotice(null);
  }

  return {
    algorithm,
    setAlgorithm,
    isAlgorithmAvailable,
    mode,
    setMode,
    inputType,
    setInputType,
    text,
    setText,
    file,
    setFile,
    key,
    setKey,
    normalizedKey: parsedKey === null ? null : normalizeKey(parsedKey),
    result,
    setResult,
    notice,
    setNotice,
    isLoading,
    inputError,
    keyError,
    canSubmit,
    processCipher,
    resetInput,
  };
}
