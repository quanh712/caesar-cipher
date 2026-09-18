import { useMemo, useState } from "react";
import type { CipherMode, InputType, NoticeState } from "../../../shared/types/cipher";

export function usePlayfairDraft() {
  const [mode, setModeState] = useState<CipherMode>("encrypt");
  const [inputType, setInputTypeState] = useState<InputType>("text");
  const [text, setTextState] = useState("");
  const [file, setFileState] = useState<File | null>(null);
  const [key, setKeyState] = useState("");
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const inputError = useMemo(() => {
    if (inputType === "text") return text.length === 0 ? "Vui lòng nhập nội dung." : null;
    if (!file) return "Vui lòng chọn file .txt.";
    return /\.txt$/i.test(file.name) ? null : "Chỉ chấp nhận file .txt.";
  }, [file, inputType, text]);
  const keyError =
    key.trim().length === 0 ? "Khóa không được để trống hoặc chỉ có khoảng trắng." : null;

  function clearDerivedState() {
    setNotice(null);
  }

  function setMode(nextMode: CipherMode) {
    setModeState(nextMode);
    clearDerivedState();
  }

  function setInputType(nextType: InputType) {
    setInputTypeState(nextType);
    clearDerivedState();
  }

  function setText(nextText: string) {
    setTextState(nextText);
    clearDerivedState();
  }

  function setFile(nextFile: File | null) {
    setFileState(nextFile);
    clearDerivedState();
  }

  function setKey(nextKey: string) {
    setKeyState(nextKey);
    clearDerivedState();
  }

  function resetInput() {
    if (inputType === "text") setTextState("");
    else setFileState(null);
    clearDerivedState();
  }

  function resetAll() {
    setModeState("encrypt");
    setInputTypeState("text");
    setTextState("");
    setFileState(null);
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
    setFile,
    key,
    setKey,
    notice,
    setNotice,
    inputError,
    keyError,
    resetInput,
    resetAll,
    clearDerivedState,
  };
}

export type PlayfairDraftController = ReturnType<typeof usePlayfairDraft>;
