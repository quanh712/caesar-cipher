interface CipherConfigProps {
  value: string;
  normalizedKey: number | null;
  error: string | null;
  disabled: boolean;
  onChange: (value: string) => void;
}

export function CipherConfig(props: CipherConfigProps) {
  return (
    <section className="config">
      <div>
        <h2>Khóa Caesar</h2>
        <p>Nhập số nguyên; khóa được chuẩn hóa về khoảng 0–25.</p>
      </div>
      <div className="key-control">
        <input
          aria-label="Khóa Caesar"
          inputMode="numeric"
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          disabled={props.disabled}
        />
        <span>
          {props.error ?? (props.normalizedKey === null ? "Chưa nhập khóa" : `Khóa chuẩn hóa: ${props.normalizedKey}`)}
        </span>
      </div>
    </section>
  );
}
