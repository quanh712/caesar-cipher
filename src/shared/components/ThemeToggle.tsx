import type { Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = theme === "light" ? "tối" : "sáng";
  const label = `Chuyển sang nền ${nextTheme}`;

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
      onClick={onToggle}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.4 15.2A8.7 8.7 0 0 1 8.8 3.6a8.8 8.8 0 1 0 11.6 11.6Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
