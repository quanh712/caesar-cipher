import { CipherModeSelector } from "../../../shared/components/CipherModeSelector";
import { DraftInputPanel } from "../../../shared/components/DraftInputPanel";
import { DraftKeyConfig } from "../../../shared/components/DraftKeyConfig";
import { DraftOutputPanel } from "../../../shared/components/DraftOutputPanel";
import { Notification } from "../../../shared/components/Notification";
import { PendingCipherAction } from "../../../shared/components/PendingCipherAction";
import type { PlayfairDraftController } from "../hooks/usePlayfairDraft";

interface PlayfairWorkspaceProps {
  draft: PlayfairDraftController;
}

export function PlayfairWorkspace({ draft }: PlayfairWorkspaceProps) {
  async function copyInput() {
    try {
      await navigator.clipboard.writeText(draft.text);
      draft.setNotice({ kind: "success", message: "Đã sao chép đầu vào." });
    } catch {
      draft.setNotice({ kind: "error", message: "Không thể sao chép đầu vào." });
    }
  }

  return (
    <div className="cipher-workspace">
      <CipherModeSelector value={draft.mode} disabled={false} onChange={draft.setMode} />

      <div className="helper-row">
        <span>
          Playfair chuẩn hóa thành chữ hoa ASCII, gộp J/I, loại định dạng và giữ filler X/Q khi giải
          mã; kết quả không khôi phục nguyên văn đầu vào.
        </span>
      </div>

      <div className="workspace__columns">
        <DraftInputPanel
          inputType={draft.inputType}
          mode={draft.mode}
          text={draft.text}
          file={draft.file}
          error={draft.inputError}
          onInputTypeChange={draft.setInputType}
          onTextChange={draft.setText}
          onFileChange={draft.setFile}
          onClear={draft.resetInput}
          onCopy={copyInput}
        />
        <DraftOutputPanel algorithmName="Playfair" mode={draft.mode} />
      </div>

      <DraftKeyConfig
        algorithmName="Playfair"
        value={draft.key}
        error={draft.keyError}
        placeholder="Ví dụ: MONARCHY"
        description="Khóa Playfair được chuẩn hóa thành chữ hoa ASCII, gộp J/I và loại ký tự trùng."
        hint="Khoảng trắng và ký tự ngoài ASCII bị loại nếu khóa vẫn còn ít nhất một chữ cái A–Z."
        onChange={draft.setKey}
      />

      <section className="analysis-section" aria-labelledby="playfair-analysis-title">
        <div className="section-label" id="playfair-analysis-title">
          Phân tích Playfair
        </div>
        <div className="panel analysis-empty" role="status">
          <strong>Key Matrix và Digraph</strong>
          <span>
            Matrix và digraph sẽ được tính như visualization từ input sau khi tích hợp; kết quả
            chính thức luôn lấy từ Backend.
          </span>
        </div>
      </section>

      <PendingCipherAction
        algorithmName="Playfair"
        mode={draft.mode}
        descriptionId="playfair-backend-status"
        message="tích hợp API được thực hiện ở giai đoạn tiếp theo sau checkpoint Vigenère."
      />

      {draft.notice && <Notification notice={draft.notice} onClose={() => draft.setNotice(null)} />}
    </div>
  );
}
