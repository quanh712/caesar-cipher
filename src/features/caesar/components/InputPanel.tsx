import { useRef, useState } from "react";
import { formatFileSize } from "../../../shared/utils/formatFileSize";
import { MAX_TEXT_FILE_BYTES } from "../../../shared/utils/textFileValidation";
import { ColorizedText } from "../../../shared/components/ColorizedText";
import type { CipherMode, InputType } from "../types/cipher";
import { HighlightedTextArea } from "./HighlightedTextArea";

interface InputPanelProps {
  inputType: InputType;
  mode: CipherMode;
  text: string;
  file: File | null;
  fileText: string;
  error: string | null;
  disabled: boolean;
  onInputTypeChange: (value: InputType) => void;
  onTextChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
  onCopy: () => void;
}

export function InputPanel(props: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file: File | undefined) {
    if (!props.disabled && file) void props.onFileChange(file);
  }

  return (
    <section>
      <div className="section-label">
        <span>Đầu vào</span>
        <div className="segmented" role="group" aria-label="Nguồn đầu vào">
          {(["text", "file"] as const).map((type) => (
            <button
              className={props.inputType === type ? "is-active" : ""}
              key={type}
              type="button"
              onClick={() => props.onInputTypeChange(type)}
              disabled={props.disabled}
              aria-pressed={props.inputType === type}
            >
              {type === "text" ? "Văn bản" : "File .txt"}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>
            {props.inputType === "file"
              ? "Tệp văn bản"
              : props.mode === "encrypt"
                ? "Bản rõ"
                : "Bản mã"}
          </h2>
          <div className="button-group">
            <button
              className="button button--secondary"
              type="button"
              onClick={props.onCopy}
              disabled={
                props.disabled || (props.inputType === "text" ? !props.text : !props.fileText)
              }
            >
              Sao chép
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={props.onClear}
              disabled={props.disabled || (props.inputType === "text" ? !props.text : !props.file)}
            >
              Xóa
            </button>
          </div>
        </div>

        {props.inputType === "text" ? (
          <HighlightedTextArea
            value={props.text}
            onChange={props.onTextChange}
            disabled={props.disabled}
          />
        ) : (
          <div>
            <input
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              aria-label="Chọn file văn bản"
              accept=".txt,text/plain"
              disabled={props.disabled}
              onChange={(event) => {
                selectFile(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
            {props.file ? (
              <div className="file-card">
                <div className="file-card__header">
                  <span className="file-extension">TXT</span>
                  <span className="file-card__meta">
                    <strong>{props.file.name}</strong>
                    <small>{formatFileSize(props.file.size)}</small>
                  </span>
                  <div className="button-group">
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={props.disabled}
                    >
                      Đổi file
                    </button>
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={() => props.onFileChange(null)}
                      disabled={props.disabled}
                    >
                      Gỡ file
                    </button>
                  </div>
                </div>
                <pre className="file-preview">
                  <ColorizedText text={props.fileText.slice(0, 5_000)} />
                  {props.fileText.length > 5_000 ? "\n…" : ""}
                </pre>
              </div>
            ) : (
              <div
                className={isDragging ? "file-picker file-picker--dragging" : "file-picker"}
                onDragEnter={(event) => {
                  event.preventDefault();
                  if (props.disabled) return;
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  if (props.disabled) return;
                  selectFile(event.dataTransfer.files[0]);
                }}
              >
                <strong>Kéo thả file .txt vào đây</strong>
                <span>hoặc</span>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={props.disabled}
                >
                  Chọn file
                </button>
                <small>
                  Chỉ nhận .txt · tối đa {MAX_TEXT_FILE_BYTES / 1024 / 1024} MiB = 5.242.880 byte
                </small>
              </div>
            )}
          </div>
        )}

        <div
          className={`status ${props.inputType === "text" ? (props.text.length === 0 ? "" : props.error ? "status--error" : "status--success") : !props.file ? "" : props.error ? "status--error" : "status--success"}`}
          role="status"
          aria-live="polite"
        >
          {props.inputType === "text" && props.text.length === 0
            ? "Chưa có dữ liệu"
            : props.inputType === "file" && !props.file
              ? "Chưa chọn file"
              : props.error
                ? `! ${props.error}`
                : "✓ Đầu vào hợp lệ."}
        </div>
      </div>
    </section>
  );
}
