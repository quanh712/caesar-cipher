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
      await navigator.clipboard.writeText(cipher.result);
      cipher.setNotice({ kind: "success", message: "Copy kết quả thành công." });
    } catch {
      cipher.setNotice({ kind: "error", message: "Trình duyệt không cho phép copy." });
    }
  }

  async function copyInput() {
    try {
      const input = cipher.inputType === "text" ? cipher.text : await cipher.file?.text();
      await navigator.clipboard.writeText(input ?? "");
      cipher.setNotice({ kind: "success", message: "Copy đầu vào thành công." });
    } catch {
      cipher.setNotice({ kind: "error", message: "Trình duyệt không cho phép copy." });
    }
  }

  function downloadResult() {
    const url = URL.createObjectURL(new Blob([cipher.result], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cipher.file?.name.replace(/\.txt$/i, "") ?? "result"}_${cipher.mode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="workspace">
      <CipherAlgorithmSelector
        value={cipher.algorithm}
        onChange={(algorithm) => {
          cipher.setAlgorithm(algorithm);
          cipher.setNotice(null);
        }}
      />
      <CipherModeSelector value={cipher.mode} onChange={cipher.setMode} />

      {cipher.isAlgorithmAvailable ? (
        <>
          <div className="workspace__columns">
            <InputPanel
              inputType={cipher.inputType}
              text={cipher.text}
              file={cipher.file}
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
              showDownload={cipher.inputType === "file"}
              onCopy={copyResult}
              onClear={() => cipher.setResult("")}
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
          <span>Hiện tại workspace chỉ xử lý Caesar Cipher. Hill và Huffman sẽ được bổ sung ở phase tiếp theo.</span>
        </div>
      )}

      {cipher.notice && (
        <Notification notice={cipher.notice} onClose={() => cipher.setNotice(null)} />
      )}
    </div>
  );
}
