/* global window, document */
(function () {
  let storedTheme;
  try {
    storedTheme = window.localStorage.getItem("cipher-workbench-theme");
  } catch {
    storedTheme = null;
  }

  const theme =
    storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  document.documentElement.dataset.theme = theme;
})();
