import { useState } from "react";
import type { CipherResultSnapshot, ProcessingStatus } from "../types/cipher";
import { ColorizedText } from "./ColorizedText";

interface OutputPanelProps {
  result: CipherResultSnapshot | null;
  processingStatus: ProcessingStatus;
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
          <h2>Output</h2>
          <div className="panel-tabs" role="tablist" aria-label="Kiểu hiển thị kết quả">
            <button
              type="button"
              role="tab"
              aria-selected={view === "text"}
              onClick={() => setView("text")}
            >
              Text
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "stats"}
              onClick={() => setView("stats")}
            >
              Phân tích
            </button>
          </div>
          <div className="button-group">
            {props.result?.inputType === "file" && (
              <button
                className="button button--secondary"
                onClick={props.onDownload}
                disabled={!props.result}
                type="button"
              >
                Download
              </button>
            )}
            <button
              className="button button--secondary"
              onClick={props.onCopy}
              disabled={!props.result}
              type="button"
            >
              Copy
            </button>
            <button
              className="button button--secondary"
              onClick={props.onClear}
              disabled={!props.result}
              type="button"
            >
              Clear
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
              <dd>{props.result?.mode ?? "-"}</dd>
            </div>
            <div>
              <dt>Nguồn</dt>
              <dd>
                {props.result?.inputType === "text"
                  ? "text"
                  : props.result
                    ? `file · ${props.result.fileName ?? "-"}`
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
        >
          {props.processingStatus === "loading"
            ? "Đang gửi yêu cầu…"
            : props.processingStatus === "error"
              ? props.result
                ? "Xử lý thất bại · Kết quả trước được giữ lại"
                : "Xử lý thất bại"
              : props.result
                ? `Xử lý thành công · ${props.result.text.length} ký tự`
                : "Chưa xử lý"}
        </div>
      </div>
    </section>
  );
}
