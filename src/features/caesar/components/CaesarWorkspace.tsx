import type { CaesarCipherController } from "../hooks/useCaesarCipher";
import { AlphabetMap } from "./AlphabetMap";
import { CipherConfig } from "./CipherConfig";
import { CipherModeSelector } from "./CipherModeSelector";
import { InputPanel } from "./InputPanel";
import { Notification } from "./Notification";
import { OutputPanel } from "./OutputPanel";

interface CaesarWorkspaceProps {
  cipher: CaesarCipherController;
}

export function CaesarWorkspace({ cipher }: CaesarWorkspaceProps) {
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(cipher.result?.text ?? "");
      cipher.setNotice({ kind: "success", message: "Đã sao chép kết quả." });
    } catch {
      cipher.setNotice({ kind: "error", message: "Không thể sao chép kết quả." });
    }
  }

  async function copyInput() {
    try {
      const input = cipher.inputType === "text" ? cipher.text : cipher.fileText;
      await navigator.clipboard.writeText(input);
      cipher.setNotice({ kind: "success", message: "Đã sao chép đầu vào." });
    } catch {
      cipher.setNotice({ kind: "error", message: "Không thể sao chép đầu vào." });
    }
  }

  return (
    <div className="workspace">
      <CipherModeSelector
        value={cipher.mode}
        disabled={cipher.isLoading}
        onChange={cipher.setMode}
      />

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
          Tạo ví dụ
        </button>
      </div>

      <div className="workspace__columns">
        <InputPanel
          inputType={cipher.inputType}
          mode={cipher.mode}
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
          key={cipher.result ? "result" : "empty"}
          result={cipher.result}
          mode={cipher.mode}
          processingStatus={cipher.processingStatus}
          disabled={cipher.isLoading}
          onCopy={copyResult}
          onClear={cipher.clearResult}
          onDownload={cipher.downloadResult}
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

      {cipher.notice && (
        <Notification notice={cipher.notice} onClose={() => cipher.setNotice(null)} />
      )}
    </div>
  );
}
