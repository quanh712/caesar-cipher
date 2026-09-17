export function normalizeKey(key: bigint): number {
  return Number(((key % 26n) + 26n) % 26n);
}

export function shiftText(text: string, key: number): string {
  const normalizedKey = ((key % 26) + 26) % 26;

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
