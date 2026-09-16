import { useEffect } from "react";
import type { NoticeState } from "../types/cipher";

interface NotificationProps {
  notice: NoticeState;
  onClose: () => void;
}

export function Notification({ notice, onClose }: NotificationProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 2500);
    return () => window.clearTimeout(timeoutId);
  }, [notice, onClose]);

  return (
    <div className={`notice notice--${notice.kind}`} role="status" aria-live="polite">
      <span>{notice.message}</span>
      <button type="button" onClick={onClose} aria-label="Đóng thông báo">
        ×
      </button>
    </div>
  );
}
