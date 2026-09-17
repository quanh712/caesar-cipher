interface CipherConfigProps {
  value: string;
  normalizedKey: number | null;
  error: string | null;
  disabled: boolean;
  onChange: (value: string) => void;
}

export function CipherConfig(props: CipherConfigProps) {
  let shouldShowNormalizedKey = false;
  if (props.normalizedKey !== null) {
    try {
      shouldShowNormalizedKey = BigInt(props.value.trim()) !== BigInt(props.normalizedKey);
    } catch {
      shouldShowNormalizedKey = false;
    }
  }

  return (
    <section className="config-section">
      <h2>Khóa Caesar</h2>
      <p>Nhập số nguyên dùng để dịch chuyển bảng chữ cái. Khóa được chuẩn hóa về khoảng 0–25.</p>
      <div className="panel">
        <div className="panel__header">
          <h2>Khóa dịch chuyển</h2>
        </div>
        <div className="key-control">
          <input
            aria-label="Khóa Caesar"
            inputMode="numeric"
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
            disabled={props.disabled}
          />
          <span>{shouldShowNormalizedKey ? `chuẩn hóa → ${props.normalizedKey}` : ""}</span>
        </div>
        <div className="key-note">Số âm hoặc lớn hơn 25 vẫn hợp lệ: 29 → 3, −3 → 23, 26 → 0.</div>
        <div
          className={`status ${props.error ? "status--error" : props.normalizedKey === null ? "" : "status--success"}`}
          role="status"
          aria-live="polite"
        >
          {props.error
            ? `! ${props.error}`
            : props.normalizedKey === null
              ? "Chưa nhập khóa"
              : "✓ Khóa hợp lệ"}
        </div>
      </div>
    </section>
  );
}
