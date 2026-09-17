import { useMemo, useRef, useState } from "react";
import { CaesarApiError, caesarApi } from "../services/caesarApi";
import type {
  CipherMode,
  CipherResultSnapshot,
  InputType,
  NoticeState,
  ProcessingStatus,
} from "../types/cipher";
import { normalizeKey } from "../utils/caesar";
import { MAX_FILE_BYTES, parseKey, validateInput } from "../utils/validation";

function userFacingError(error: unknown) {
  return error instanceof CaesarApiError
    ? error.message
    : "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function useCaesarCipher() {
  const [mode, setModeState] = useState<CipherMode>("encrypt");
  const [inputType, setInputTypeState] = useState<InputType>("text");
  const [text, setTextState] = useState("");
  const [file, setFileState] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const [key, setKeyState] = useState("");
  const [result, setResult] = useState<CipherResultSnapshot | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("idle");
  const fileReadVersion = useRef(0);
  const requestInFlight = useRef(false);

  const parsedKey = useMemo(() => parseKey(key, inputType), [inputType, key]);
  const inputError = useMemo(() => validateInput(inputType, text, file), [file, inputType, text]);
  const keyError = key.trim() !== "" && parsedKey === null ? "Khóa phải là số nguyên." : null;
  const canSubmit = !isLoading && !inputError && parsedKey !== null;

  function clearDerivedState() {
    setResult(null);
    setProcessingStatus("idle");
    setNotice(null);
  }

  function setMode(nextMode: CipherMode) {
    if (isLoading || nextMode === mode) return;
    setModeState(nextMode);
    clearDerivedState();
  }

  function setInputType(nextType: InputType) {
    if (isLoading || nextType === inputType) return;
    setInputTypeState(nextType);
    clearDerivedState();
  }

  function setText(nextText: string) {
    if (isLoading) return;
    setTextState(nextText);
    clearDerivedState();
  }

  function setKey(nextKey: string) {
    if (isLoading) return;
    setKeyState(nextKey);
    clearDerivedState();
  }

  async function processCipher() {
    if (!canSubmit || parsedKey === null || requestInFlight.current) return;

    const requestMode = mode;
    const requestInputType = inputType;
    const requestFile = file;
    const requestSource = requestInputType === "text" ? text : fileText;
    const requestKeyValue = key;
    const requestKeyToken = parsedKey.toString();
    const requestNormalizedKey = normalizeKey(parsedKey);

    requestInFlight.current = true;
    setResult(null);
    setIsLoading(true);
    setProcessingStatus("loading");
    setNotice(null);

    try {
      const response =
        requestInputType === "text"
          ? await caesarApi.processText(requestMode, {
              text: requestSource,
              keyToken: requestKeyToken,
            })
          : await caesarApi.previewFile({
              file: requestFile!,
              rawKey: requestKeyValue,
              action: requestMode,
            });

      setResult({
        text: response.result,
        source: requestSource,
        mode: requestMode,
        inputType: requestInputType,
        fileName: requestFile?.name,
        file: requestFile ?? undefined,
        keyValue: requestKeyValue,
        normalizedKey: requestNormalizedKey,
      });
      setProcessingStatus("success");
      setNotice({
        kind: "success",
        message: requestMode === "encrypt" ? "Mã hóa thành công." : "Giải mã thành công.",
      });
    } catch (error) {
      setResult(null);
      setProcessingStatus("error");
      setNotice({ kind: "error", message: userFacingError(error) });
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  }

  async function downloadResult() {
    const snapshot = result;
    if (!snapshot || isLoading || requestInFlight.current) return;

    requestInFlight.current = true;
    setIsLoading(true);
    setNotice(null);
    try {
      if (snapshot.inputType === "text") {
        const suffix = snapshot.mode === "encrypt" ? "encrypted" : "decrypted";
        saveBlob(
          new Blob([snapshot.text], { type: "text/plain;charset=utf-8" }),
          `ket-qua.${suffix}.txt`,
        );
      } else {
        const download = await caesarApi.downloadFile({
          file: snapshot.file!,
          rawKey: snapshot.keyValue,
          action: snapshot.mode,
        });
        saveBlob(download.blob, download.filename);
      }
      setNotice({ kind: "success", message: "Đã tải kết quả." });
    } catch (error) {
      setResult(null);
      setProcessingStatus("error");
      setNotice({ kind: "error", message: userFacingError(error) });
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  }

  function resetInput() {
    if (isLoading) return;
    if (inputType === "text") {
      setTextState("");
    } else {
      fileReadVersion.current += 1;
      setFileState(null);
      setFileText("");
    }
    clearDerivedState();
  }

  async function updateFile(nextFile: File | null) {
    if (isLoading) return;
    const readVersion = ++fileReadVersion.current;
    setFileState(nextFile);
    setFileText("");
    clearDerivedState();

    const canReadFile =
      nextFile &&
      /\.txt$/i.test(nextFile.name) &&
      nextFile.size > 0 &&
      nextFile.size <= MAX_FILE_BYTES;
    if (!canReadFile) return;

    try {
      const content = await nextFile.text();
      if (fileReadVersion.current === readVersion) setFileText(content);
    } catch {
      if (fileReadVersion.current === readVersion) setFileText("");
    }
  }

  function loadExample() {
    if (isLoading) return;
    fileReadVersion.current += 1;
    setInputTypeState("text");
    setTextState("Hello World");
    setKeyState("3");
    clearDerivedState();
  }

  function clearResult() {
    if (isLoading) return;
    clearDerivedState();
  }

  function resetAll() {
    if (isLoading) return;
    fileReadVersion.current += 1;
    setModeState("encrypt");
    setInputTypeState("text");
    setTextState("");
    setFileState(null);
    setFileText("");
    setKeyState("");
    clearDerivedState();
  }

  return {
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
    setKey,
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
    downloadResult,
    resetInput,
    resetAll,
    loadExample,
  };
}

export type CaesarCipherController = ReturnType<typeof useCaesarCipher>;
