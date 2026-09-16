import type { CipherMode } from "../types/cipher";

interface AlphabetMapProps {
  mode: CipherMode;
  normalizedKey: number;
  input: string;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function AlphabetMap({ mode, normalizedKey, input }: AlphabetMapProps) {
  const usedLetters = new Set(
    Array.from(input.toUpperCase()).filter((character) => alphabet.includes(character)),
  );
  const isEncrypting = mode === "encrypt";
  const mappedAlphabet = Array.from(alphabet, (_, index) => {
    const mappedIndex = isEncrypting
      ? (index + normalizedKey) % alphabet.length
      : (index - normalizedKey + alphabet.length) % alphabet.length;
    return alphabet[mappedIndex];
  });

  return (
    <section className="map-section" aria-labelledby="alphabet-map-title">
      <div className="section-label">
        <span>Bảng dịch chuyển</span>
        <span className="map-legend">Tô đỏ: chữ có trong đầu vào</span>
      </div>
      <div className="panel alphabet-panel">
        <div className="panel__header">
          <h2 id="alphabet-map-title">
            Khóa {normalizedKey} · A → {mappedAlphabet[0]}
          </h2>
        </div>
        <div className="alphabet-map">
          <div className="alphabet-row">
            <span className="alphabet-label">{isEncrypting ? "Bản rõ" : "Bản mã"}</span>
            {Array.from(alphabet).map((letter) => (
              <span
                className={
                  usedLetters.has(letter) ? "alphabet-cell alphabet-cell--used" : "alphabet-cell"
                }
                key={letter}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="alphabet-row alphabet-row--mapped">
            <span className="alphabet-label">{isEncrypting ? "Bản mã" : "Bản rõ"}</span>
            {mappedAlphabet.map((letter, index) => (
              <span
                className={
                  usedLetters.has(alphabet[index])
                    ? "alphabet-cell alphabet-cell--used"
                    : "alphabet-cell"
                }
                key={`${letter}-${index}`}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
