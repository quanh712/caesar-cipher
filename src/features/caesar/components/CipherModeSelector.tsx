import type { CipherMode } from "../types/cipher";

interface CipherModeSelectorProps {
  value: CipherMode;
  onChange: (mode: CipherMode) => void;
}

export function CipherModeSelector({ value, onChange }: CipherModeSelectorProps) {
  return (
    <section className="mode-section" aria-labelledby="mode-title">
      <div className="section-label" id="mode-title">Chế độ</div>
      <div className="mode-selector" role="tablist" aria-label="Chế độ xử lý">
        {(["encrypt", "decrypt"] as const).map((mode) => (
          <button
            className={value === mode ? "mode-button mode-button--active" : "mode-button"}
            key={mode}
            onClick={() => onChange(mode)}
            role="tab"
            aria-selected={value === mode}
            type="button"
          >
            <span aria-hidden="true">{mode === "encrypt" ? "🔒" : "🔓"}</span>
            <span>
              <small>{mode === "encrypt" ? "Encode" : "Decode"}</small>
              {mode === "encrypt" ? "Mã hóa" : "Giải mã"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
