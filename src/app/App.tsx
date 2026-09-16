import { CaesarWorkspace } from "../features/caesar/components/CaesarWorkspace";
import { AppHeader } from "../shared/components/AppHeader";

export function App() {
  return (
    <>
      <AppHeader />
      <main className="page">
        <header className="hero">
          <h1>Caesar Cipher Debugger</h1>
          <p>
            Mã hóa và giải mã văn bản hoặc file với các thuật toán mật mã trong cùng một workspace
            trực quan.
          </p>
        </header>
        <CaesarWorkspace />
      </main>
    </>
  );
}
