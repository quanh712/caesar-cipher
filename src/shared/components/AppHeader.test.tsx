import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "../hooks/useTheme";
import { AppHeader } from "./AppHeader";

function mockSystemTheme(initiallyDark: boolean) {
  let changeListener: ((event: Event) => void) | undefined;
  let matches = initiallyDark;
  const mediaQuery = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event !== "change") return;
      changeListener =
        typeof listener === "function"
          ? listener
          : (changeEvent) => listener.handleEvent(changeEvent);
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;

  vi.mocked(window.matchMedia).mockReturnValue(mediaQuery);

  return {
    change(nextDark: boolean) {
      matches = nextDark;
      act(() => changeListener?.({ matches: nextDark } as MediaQueryListEvent));
    },
  };
}

describe("AppHeader theme toggle", () => {
  beforeEach(() => {
    vi.mocked(window.matchMedia).mockReset();
  });

  it("follows the system theme until the user chooses explicitly", () => {
    const systemTheme = mockSystemTheme(false);
    render(<AppHeader disabled={false} onReset={vi.fn()} />);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(screen.getByRole("button", { name: "Chuyển sang nền tối" })).toBeInTheDocument();

    systemTheme.change(true);

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: "Chuyển sang nền sáng" })).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("persists an explicit choice and does not reset it with the workspace", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const systemTheme = mockSystemTheme(false);
    render(<AppHeader disabled={false} onReset={onReset} />);

    await user.click(screen.getByRole("button", { name: "Chuyển sang nền tối" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    systemTheme.change(false);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(screen.getByRole("button", { name: "Làm mới" }));
    expect(onReset).toHaveBeenCalledOnce();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("restores the stored choice instead of the system theme", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    mockSystemTheme(false);

    render(<AppHeader disabled={false} onReset={vi.fn()} />);

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: "Chuyển sang nền sáng" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
