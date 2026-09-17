import { CaesarWorkspace } from "../features/caesar/components/CaesarWorkspace";
import { useCaesarCipher } from "../features/caesar/hooks/useCaesarCipher";
import { isMockApiEnabled } from "../features/caesar/services/caesarApi";
import { AppHeader } from "../shared/components/AppHeader";

export function App() {
  const cipher = useCaesarCipher();

  return (
    <>
      <AppHeader disabled={cipher.isLoading} onReset={cipher.resetAll} />
      <main className="page">
        <header className="hero">
          <div className="hero__title">
            <h1>Cipher Workbench</h1>
            {isMockApiEnabled && <span className="mock-badge">Bản demo giả lập</span>}
          </div>
          <p>
            Mã hóa và giải mã văn bản hoặc file bằng Caesar Cipher trong một workspace trực quan.
          </p>
        </header>
        <CaesarWorkspace cipher={cipher} />
      </main>
    </>
  );
}
