import type { CipherMode } from "../types/cipher";

interface PendingCipherActionProps {
  algorithmName: string;
  mode: CipherMode;
  descriptionId: string;
  message: string;
}

export function PendingCipherAction({
  algorithmName,
  mode,
  descriptionId,
  message,
}: PendingCipherActionProps) {
  return (
    <div className="pending-action">
      <button
        className="button button--primary"
        type="button"
        disabled
        aria-describedby={descriptionId}
      >
        {mode === "encrypt" ? "Mã hóa" : "Giải mã"}
      </button>
      <p id={descriptionId} role="status">
        Chưa thể xử lý {algorithmName}: {message}
      </p>
    </div>
  );
}
