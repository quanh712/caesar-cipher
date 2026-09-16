export function normalizeKey(key: number): number {
  return ((key % 26) + 26) % 26;
}

export function shiftText(text: string, key: number): string {
  const normalizedKey = normalizeKey(key);

  return Array.from(text, (character) => {
    const code = character.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + normalizedKey) % 26) + 65);
    }

    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + normalizedKey) % 26) + 97);
    }

    return character;
  }).join("");
}
