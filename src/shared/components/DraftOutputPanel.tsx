import type { CipherMode } from "../types/cipher";

interface DraftOutputPanelProps {
  algorithmName: string;
  mode: CipherMode;
}

export function DraftOutputPanel({ algorithmName, mode }: DraftOutputPanelProps) {
  return (
    <section>
      <div className="section-label">Kết quả</div>
      <div className="panel">
        <div className="panel__header">
          <h2>{mode === "encrypt" ? "Bản mã" : "Bản rõ"}</h2>
          <div className="button-group">
            <button className="button button--secondary" type="button" disabled>
              Tải kết quả
            </button>
            <button className="button button--secondary" type="button" disabled>
              Sao chép
            </button>
            <button className="button button--secondary" type="button" disabled>
              Xóa
            </button>
          </div>
        </div>
        <div className="output output--empty" role="status">
          Kết quả {algorithmName} sẽ xuất hiện ở đây sau khi tích hợp Backend.
        </div>
        <div className="status" role="status" aria-live="polite">
          Chưa tích hợp Backend
        </div>
      </div>
    </section>
  );
}
