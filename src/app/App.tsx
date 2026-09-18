import { useState, type ReactNode } from "react";
import { CaesarWorkspace } from "../features/caesar/components/CaesarWorkspace";
import { useCaesarCipher } from "../features/caesar/hooks/useCaesarCipher";
import { PlayfairWorkspace } from "../features/playfair/components/PlayfairWorkspace";
import { usePlayfairDraft } from "../features/playfair/hooks/usePlayfairDraft";
import { VigenereWorkspace } from "../features/vigenere/components/VigenereWorkspace";
import { useVigenereCipher } from "../features/vigenere/hooks/useVigenereCipher";
import { CipherAlgorithmSelector } from "../shared/components/CipherAlgorithmSelector";
import { AppHeader } from "../shared/components/AppHeader";
import { cipherAlgorithms } from "../shared/config/cipherAlgorithms";
import type { CipherAlgorithm } from "../shared/types/cipher";

export function App() {
  const cipher = useCaesarCipher();
  const vigenere = useVigenereCipher();
  const playfair = usePlayfairDraft();
  const [algorithm, setAlgorithm] = useState<CipherAlgorithm>("caesar");
  const isLoading = cipher.isLoading || vigenere.isLoading;

  function resetWorkspace() {
    setAlgorithm("caesar");
    cipher.resetAll();
    vigenere.resetAll();
    playfair.resetAll();
  }

  function changeAlgorithm(nextAlgorithm: CipherAlgorithm) {
    if (isLoading || nextAlgorithm === algorithm) return;
    cipher.clearResult();
    cipher.setNotice(null);
    vigenere.clearResult();
    playfair.clearDerivedState();
    setAlgorithm(nextAlgorithm);
  }

  const workspaces: Record<CipherAlgorithm, ReactNode> = {
    caesar: <CaesarWorkspace cipher={cipher} />,
    playfair: <PlayfairWorkspace draft={playfair} />,
    vigenere: <VigenereWorkspace cipher={vigenere} />,
  };

  return (
    <>
      <AppHeader disabled={isLoading} onReset={resetWorkspace} />
      <main className="page">
        <header className="hero">
          <div className="hero__title">
            <h1>Cipher Workbench</h1>
          </div>
          <p>Mã hóa và giải mã Caesar hoặc Vigenère trực tiếp bằng kết quả từ Backend.</p>
        </header>
        <div className="workspace">
          <CipherAlgorithmSelector
            value={algorithm}
            disabled={isLoading}
            onChange={changeAlgorithm}
          />
          {cipherAlgorithms.map(({ value: panelAlgorithm }) => (
            <div
              id={`algorithm-panel-${panelAlgorithm}`}
              key={panelAlgorithm}
              role="tabpanel"
              aria-labelledby={`algorithm-tab-${panelAlgorithm}`}
              hidden={algorithm !== panelAlgorithm}
            >
              {algorithm === panelAlgorithm ? workspaces[panelAlgorithm] : null}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
