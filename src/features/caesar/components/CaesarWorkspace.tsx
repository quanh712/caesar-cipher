import { useCaesarCipher } from "../hooks/useCaesarCipher";
import { AlphabetMap } from "./AlphabetMap";
import { CipherAlgorithmSelector } from "./CipherAlgorithmSelector";
import { CipherConfig } from "./CipherConfig";
import { CipherModeSelector } from "./CipherModeSelector";
import { InputPanel } from "./InputPanel";
import { Notification } from "./Notification";
import { OutputPanel } from "./OutputPanel";

export function CaesarWorkspace() {
  const cipher = useCaesarCipher();

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(cipher.result?.text ?? "");
      cipher.setNotice({ kind: "success", message: "Copy kết quả thành công." });
    } catch {
      cipher.setNotice({ kind: "error", message: "Trình duyệt không cho phép copy." });
    }
  }

  async function copyInput() {
    try {
      const input = cipher.inputType === "text" ? cipher.text : cipher.fileText;
      await navigator.clipboard.writeText(input ?? "");
      cipher.setNotice({ kind: "success", message: "Copy đầu vào thành công." });
    } catch {
      cipher.setNotice({ kind: "error", message: "Trình duyệt không cho phép copy." });
    }
  }

  function downloadResult() {
    if (!cipher.result) return;

    const url = URL.createObjectURL(
      new Blob([cipher.result.text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cipher.result.fileName?.replace(/\.txt$/i, "") ?? "result"}_${cipher.result.mode}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  return (
    <div className="workspace">
      <CipherAlgorithmSelector
        value={cipher.algorithm}
        disabled={cipher.isLoading}
        onChange={(algorithm) => {
          cipher.setAlgorithm(algorithm);
          cipher.setNotice(null);
        }}
      />
      <CipherModeSelector
        value={cipher.mode}
        disabled={cipher.isLoading}
        onChange={cipher.setMode}
      />

      {cipher.isAlgorithmAvailable && (
        <div className="helper-row">
          <span>
            {cipher.mode === "encrypt"
              ? "Dán bản rõ bên dưới để mã hóa bằng hệ mật Caesar."
              : "Dán bản mã bên dưới để giải mã bằng hệ mật Caesar."}
          </span>
          <button
            className="button button--secondary"
            type="button"
            onClick={cipher.loadExample}
            disabled={cipher.isLoading}
          >
            Generate example
          </button>
        </div>
      )}

      {cipher.isAlgorithmAvailable ? (
        <>
          <div className="workspace__columns">
            <InputPanel
              inputType={cipher.inputType}
              text={cipher.text}
              file={cipher.file}
              fileText={cipher.fileText}
              error={cipher.inputError}
              disabled={cipher.isLoading}
              onInputTypeChange={cipher.setInputType}
              onTextChange={cipher.setText}
              onFileChange={cipher.setFile}
              onClear={cipher.resetInput}
              onCopy={copyInput}
            />
            <OutputPanel
              result={cipher.result}
              processingStatus={cipher.processingStatus}
              onCopy={copyResult}
              onClear={cipher.clearResult}
              onDownload={downloadResult}
            />
          </div>

          <AlphabetMap
            mode={cipher.mode}
            normalizedKey={cipher.normalizedKey ?? 0}
            input={cipher.inputType === "text" ? cipher.text : cipher.fileText}
          />

          <CipherConfig
            value={cipher.key}
            normalizedKey={cipher.normalizedKey}
            error={cipher.keyError}
            disabled={cipher.isLoading}
            onChange={cipher.setKey}
          />

          <button
            className="button button--primary"
            type="button"
            disabled={!cipher.canSubmit}
            onClick={cipher.processCipher}
          >
            {cipher.isLoading ? "Đang xử lý…" : cipher.mode === "encrypt" ? "Mã hóa" : "Giải mã"}
          </button>
        </>
      ) : (
        <div className="availability-panel">
          <strong>Thuật toán đang được chuẩn bị</strong>
          <span>
            Hiện tại workspace chỉ xử lý Caesar Cipher. Hill và Huffman sẽ được bổ sung ở phase tiếp
            theo.
          </span>
        </div>
      )}

      {cipher.notice && (
        <Notification notice={cipher.notice} onClose={() => cipher.setNotice(null)} />
      )}
    </div>
  );
}
