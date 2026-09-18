import { useMemo, useRef, useState } from "react";
import { CipherApiError } from "../../../shared/services/cipherApi";
import type { CipherMode, InputType, NoticeState } from "../../../shared/types/cipher";
import { saveBlob } from "../../../shared/utils/download";
import { MAX_TEXT_FILE_BYTES, readTextFile } from "../../../shared/utils/textFileValidation";
import { vigenereApi } from "../services/vigenereApi";
import type { ProcessingStatus, VigenereResultSnapshot } from "../types/cipher";
import { validateVigenereInput, validateVigenereKey } from "../utils/validation";

function userFacingError(error: unknown) {
  return error instanceof CipherApiError
    ? error.message
    : "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
}

export function useVigenereCipher() {
  const [mode, setModeState] = useState<CipherMode>("encrypt");
  const [inputType, setInputTypeState] = useState<InputType>("text");
  const [text, setTextState] = useState("");
  const [file, setFileState] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const [key, setKeyState] = useState("");
  const [result, setResult] = useState<VigenereResultSnapshot | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("idle");
  const fileReadVersion = useRef(0);
  const requestInFlight = useRef(false);

  const inputError = useMemo(
    () => validateVigenereInput(inputType, text, file),
    [file, inputType, text],
  );
  const keyError = useMemo(() => validateVigenereKey(key), [key]);
  const canSubmit = !isLoading && !inputError && !keyError;

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

  async function setFile(nextFile: File | null) {
    if (isLoading) return;
    const readVersion = ++fileReadVersion.current;
    setFileState(nextFile);
    setFileText("");
    clearDerivedState();

    const canRead =
      nextFile &&
      /\.txt$/i.test(nextFile.name) &&
      nextFile.size > 0 &&
      nextFile.size <= MAX_TEXT_FILE_BYTES;
    if (!canRead) return;

    try {
      const content = await readTextFile(nextFile);
      if (fileReadVersion.current === readVersion) setFileText(content.replace(/^\uFEFF/, ""));
    } catch {
      if (fileReadVersion.current === readVersion) setFileText("");
    }
  }

  async function processCipher() {
    if (!canSubmit || requestInFlight.current) return;

    const snapshotMode = mode;
    const snapshotInputType = inputType;
    const snapshotText = text;
    const snapshotFile = file;
    const snapshotFileText = fileText;
    const snapshotKey = key;

    requestInFlight.current = true;
    setResult(null);
    setIsLoading(true);
    setProcessingStatus("loading");
    setNotice(null);

    try {
      let snapshotSource = snapshotText;
      if (snapshotInputType === "file") {
        snapshotSource = snapshotFileText;
        if (snapshotSource.length === 0) {
          try {
            snapshotSource = (await readTextFile(snapshotFile!)).replace(/^\uFEFF/, "");
          } catch {
            snapshotSource = "";
          }
        }
      }
      const response =
        snapshotInputType === "text"
          ? await vigenereApi.processText(snapshotMode, snapshotText, snapshotKey)
          : await vigenereApi.previewFile(snapshotMode, snapshotFile!, snapshotKey);

      setResult({
        text: response.result,
        source: snapshotSource,
        mode: snapshotMode,
        inputType: snapshotInputType,
        file: snapshotFile ?? undefined,
        keyValue: snapshotKey,
        normalizedKey: snapshotKey.toUpperCase(),
      });
      setProcessingStatus("success");
      setNotice({
        kind: "success",
        message: snapshotMode === "encrypt" ? "Mã hóa thành công." : "Giải mã thành công.",
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
        const download = await vigenereApi.downloadFile(
          snapshot.mode,
          snapshot.file!,
          snapshot.keyValue,
        );
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
    if (inputType === "text") setTextState("");
    else {
      fileReadVersion.current += 1;
      setFileState(null);
      setFileText("");
    }
    clearDerivedState();
  }

  function loadExample() {
    if (isLoading) return;
    fileReadVersion.current += 1;
    setInputTypeState("text");
    setTextState("Attack at dawn!");
    setKeyState("LEMON");
    clearDerivedState();
  }

  function clearResult() {
    if (!isLoading) clearDerivedState();
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
    setFile,
    key,
    setKey,
    result,
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
    loadExample,
    clearResult,
    resetAll,
    clearDerivedState,
  };
}

export type VigenereCipherController = ReturnType<typeof useVigenereCipher>;
