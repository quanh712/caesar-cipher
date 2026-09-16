import type { InputType } from "../types/cipher";
import { MAX_FILE_BYTES } from "../utils/validation";

interface InputPanelProps {
  inputType: InputType;
  text: string;
  file: File | null;
  error: string | null;
  disabled: boolean;
  onInputTypeChange: (value: InputType) => void;
  onTextChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
  onCopy: () => void;
}

export function InputPanel(props: InputPanelProps) {
  return (
    <section>
      <div className="section-label">
        <span>Đầu vào</span>
        <div className="segmented" aria-label="Loại đầu vào">
          {(["text", "file"] as const).map((type) => (
            <button
              className={props.inputType === type ? "is-active" : ""}
              key={type}
              type="button"
              onClick={() => props.onInputTypeChange(type)}
            >
              {type === "text" ? "Text" : "File .txt"}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>{props.inputType === "text" ? "Nội dung" : "Tệp văn bản"}</h2>
          <div className="button-group">
            <button
              className="button button--secondary"
              type="button"
              onClick={props.onCopy}
              disabled={props.inputType === "text" ? !props.text : !props.file}
            >
              Copy
            </button>
            <button className="button button--secondary" type="button" onClick={props.onClear}>
              Clear
            </button>
          </div>
        </div>

        {props.inputType === "text" ? (
          <textarea
            className="text-area"
            value={props.text}
            onChange={(event) => props.onTextChange(event.target.value)}
            placeholder="Nhập hoặc dán văn bản…"
            disabled={props.disabled}
          />
        ) : (
          <label className="file-picker">
            <strong>{props.file?.name ?? "Chọn file .txt"}</strong>
            <span>
              {props.file
                ? `${(props.file.size / 1024).toFixed(1)} KB`
                : `Dung lượng tối đa ${MAX_FILE_BYTES / 1024 / 1024} MB`}
            </span>
            <input
              type="file"
              accept=".txt,text/plain"
              disabled={props.disabled}
              onChange={(event) => props.onFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
        )}

        <div className={`status ${props.error ? "status--error" : "status--success"}`}>
          {props.error ?? "Đầu vào hợp lệ."}
        </div>
      </div>
    </section>
  );
}
