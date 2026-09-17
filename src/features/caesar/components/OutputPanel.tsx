import { useState } from "react";
import type { CipherMode, CipherResultSnapshot, ProcessingStatus } from "../types/cipher";
import { ColorizedText } from "./ColorizedText";

interface OutputPanelProps {
  result: CipherResultSnapshot | null;
  mode: CipherMode;
  processingStatus: ProcessingStatus;
  disabled: boolean;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export function OutputPanel(props: OutputPanelProps) {
  const [view, setView] = useState<"text" | "stats">("text");
  const stats = Array.from(props.result?.source ?? "").reduce(
    (result, character) => {
      const code = character.charCodeAt(0);
      if (code >= 65 && code <= 90) result.uppercase += 1;
      else if (code >= 97 && code <= 122) result.lowercase += 1;
      else result.unchanged += 1;
      return result;
    },
    { uppercase: 0, lowercase: 0, unchanged: 0 },
  );

  return (
    <section>
      <div className="section-label">Kết quả</div>
      <div className="panel">
        <div className="panel__header">
          <h2>{props.mode === "encrypt" ? "Bản mã" : "Bản rõ"}</h2>
          <div className="panel-tabs" role="tablist" aria-label="Kiểu hiển thị kết quả">
            <button
              type="button"
              role="tab"
              aria-selected={view === "text"}
              onClick={() => setView("text")}
              disabled={props.disabled}
            >
              Văn bản
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "stats"}
              onClick={() => setView("stats")}
              disabled={props.disabled}
            >
              Phân tích
            </button>
          </div>
          <div className="button-group">
            <button
              className="button button--secondary"
              onClick={props.onDownload}
              disabled={!props.result || props.disabled}
              type="button"
            >
              Tải kết quả
            </button>
            <button
              className="button button--secondary"
              onClick={props.onCopy}
              disabled={!props.result || props.disabled}
              type="button"
            >
              Sao chép
            </button>
            <button
              className="button button--secondary"
              onClick={props.onClear}
              disabled={!props.result || props.disabled}
              type="button"
            >
              Xóa
            </button>
          </div>
        </div>
        {view === "text" ? (
          <pre className={props.result ? "output" : "output output--empty"}>
            {props.result ? (
              <ColorizedText text={props.result.text} />
            ) : (
              "Kết quả sẽ hiển thị ở đây sau khi xử lý."
            )}
          </pre>
        ) : (
          <dl className="stats-list">
            <div>
              <dt>Chế độ</dt>
              <dd>
                {props.result?.mode === "encrypt"
                  ? "Mã hóa"
                  : props.result?.mode === "decrypt"
                    ? "Giải mã"
                    : "-"}
              </dd>
            </div>
            <div>
              <dt>Nguồn</dt>
              <dd>
                {props.result?.inputType === "text"
                  ? "Văn bản"
                  : props.result
                    ? `File · ${props.result.fileName ?? "-"}`
                    : "-"}
              </dd>
            </div>
            <div>
              <dt>Khóa nhập / chuẩn hóa</dt>
              <dd>
                {props.result?.keyValue || "-"} / {props.result?.normalizedKey ?? "-"}
              </dd>
            </div>
            <div>
              <dt>Tổng ký tự</dt>
              <dd>{props.result?.source.length ?? 0}</dd>
            </div>
            <div>
              <dt>Chữ hoa dịch chuyển</dt>
              <dd>{stats.uppercase}</dd>
            </div>
            <div>
              <dt>Chữ thường dịch chuyển</dt>
              <dd>{stats.lowercase}</dd>
            </div>
            <div>
              <dt>Ký tự giữ nguyên</dt>
              <dd>{stats.unchanged}</dd>
            </div>
          </dl>
        )}
        <div
          className={`status ${props.processingStatus === "success" ? "status--success" : props.processingStatus === "error" ? "status--error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {props.processingStatus === "loading"
            ? "Đang gửi yêu cầu…"
            : props.processingStatus === "error"
              ? "! Xử lý thất bại"
              : props.result
                ? `✓ Xử lý thành công · ${props.result.text.length} ký tự`
                : "Chưa xử lý"}
        </div>
      </div>
    </section>
  );
}
