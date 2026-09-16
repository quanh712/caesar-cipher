import { useMemo, useRef, useState } from "react";
import { caesarApi } from "../services/caesarApi";
import type {
  CipherAlgorithm,
  CipherMode,
  CipherResultSnapshot,
  InputType,
  NoticeState,
  ProcessingStatus,
} from "../types/cipher";
import { normalizeKey } from "../utils/caesar";
import { MAX_FILE_BYTES, parseKey, validateInput } from "../utils/validation";

export function useCaesarCipher() {
  const [algorithm, setAlgorithm] = useState<CipherAlgorithm>("caesar");
  const [mode, setMode] = useState<CipherMode>("encrypt");
  const [inputType, setInputType] = useState<InputType>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const [key, setKey] = useState("3");
  const [result, setResult] = useState<CipherResultSnapshot | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("idle");
  const fileReadVersion = useRef(0);

  const parsedKey = useMemo(() => parseKey(key), [key]);
  const inputError = useMemo(() => validateInput(inputType, text, file), [file, inputType, text]);
  const keyError = key.trim() && parsedKey === null ? "Khóa phải là số nguyên." : null;
  const isAlgorithmAvailable = algorithm === "caesar";
  const canSubmit = isAlgorithmAvailable && !isLoading && !inputError && parsedKey !== null;

  async function processCipher() {
    if (!canSubmit || parsedKey === null) return;

    const requestMode = mode;
    const requestInputType = inputType;
    const requestFile = file;
    const requestSource = requestInputType === "text" ? text : fileText;
    const requestKeyValue = key;
    const requestNormalizedKey = normalizeKey(parsedKey);

    setIsLoading(true);
    setProcessingStatus("loading");
    setNotice(null);

    try {
      const response =
        requestInputType === "text"
          ? await caesarApi.processText(requestMode, { text: requestSource, key: parsedKey })
          : await caesarApi.processFile({
              file: requestFile!,
              key: parsedKey,
              action: requestMode,
            });

      if (!response.success || response.result === undefined) {
        throw new Error(response.message || "Không thể xử lý dữ liệu.");
      }

      setResult({
        text: response.result,
        source: requestSource,
        mode: requestMode,
        inputType: requestInputType,
        fileName: requestFile?.name,
        keyValue: requestKeyValue,
        normalizedKey: requestNormalizedKey,
      });
      setProcessingStatus("success");
      setNotice({
        kind: "success",
        message: requestMode === "encrypt" ? "Mã hóa thành công." : "Giải mã thành công.",
      });
    } catch (error) {
      setProcessingStatus("error");
      setNotice({
        kind: "error",
        message: error instanceof Error ? error.message : "Không kết nối được máy chủ.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function resetInput() {
    fileReadVersion.current += 1;
    setText("");
    setFile(null);
    setFileText("");
    setNotice(null);
  }

  async function updateFile(nextFile: File | null) {
    const readVersion = ++fileReadVersion.current;
    setFile(nextFile);
    setFileText("");
    const validationError = nextFile ? validateInput("file", "", nextFile) : null;
    const canReadFile =
      nextFile &&
      /\.txt$/i.test(nextFile.name) &&
      nextFile.size > 0 &&
      nextFile.size <= MAX_FILE_BYTES;

    setNotice(validationError ? { kind: "error", message: validationError } : null);

    if (!canReadFile) return;

    try {
      const content = await nextFile.text();
      if (fileReadVersion.current === readVersion) setFileText(content);
    } catch {
      if (fileReadVersion.current === readVersion) setFileText("");
    }
  }

  function updateKey(nextKey: string) {
    setKey(nextKey);
    const parsedNextKey = parseKey(nextKey);
    setNotice(
      nextKey.trim() && parsedNextKey === null
        ? { kind: "error", message: "Khóa phải là số nguyên." }
        : null,
    );
  }

  function loadExample() {
    fileReadVersion.current += 1;
    setInputType("text");
    setText("Hello World");
    setKey("3");
    setResult(null);
    setProcessingStatus("idle");
    setNotice(null);
  }

  function clearResult() {
    setResult(null);
    setProcessingStatus("idle");
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
    fileText,
    setFile: updateFile,
    key,
    setKey: updateKey,
    normalizedKey: parsedKey === null ? null : normalizeKey(parsedKey),
    result,
    clearResult,
    notice,
    setNotice,
    isLoading,
    processingStatus,
    inputError,
    keyError,
    canSubmit,
    processCipher,
    resetInput,
    loadExample,
  };
}
