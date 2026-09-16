import type { CipherAlgorithm } from "../types/cipher";

interface CipherAlgorithmSelectorProps {
  value: CipherAlgorithm;
  disabled: boolean;
  onChange: (algorithm: CipherAlgorithm) => void;
}

const algorithms: Array<{
  value: CipherAlgorithm;
  name: string;
  description: string;
  available: boolean;
}> = [
  { value: "caesar", name: "Caesar", description: "Dịch chuyển bảng chữ cái", available: true },
  { value: "hill", name: "Hill", description: "Mật mã ma trận", available: false },
  { value: "huffman", name: "Huffman", description: "Mã hóa theo tần suất", available: false },
];

export function CipherAlgorithmSelector({
  value,
  disabled,
  onChange,
}: CipherAlgorithmSelectorProps) {
  return (
    <section className="algorithm-section" aria-labelledby="algorithm-title">
      <div className="section-label" id="algorithm-title">
        Thuật toán
      </div>
      <div className="algorithm-selector" role="tablist" aria-label="Chọn thuật toán mật mã">
        {algorithms.map((algorithm) => (
          <button
            className={
              value === algorithm.value ? "algorithm-card algorithm-card--active" : "algorithm-card"
            }
            key={algorithm.value}
            onClick={() => onChange(algorithm.value)}
            role="tab"
            aria-selected={value === algorithm.value}
            type="button"
            disabled={disabled}
          >
            <span className="algorithm-card__name">
              {algorithm.name}
              {!algorithm.available && <small>Sắp hỗ trợ</small>}
            </span>
            <span className="algorithm-card__description">{algorithm.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
