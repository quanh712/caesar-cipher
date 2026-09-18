export const VIGENERE_ANALYSIS_LIMIT = 200;

function isAsciiLetter(character: string) {
  return /^[A-Za-z]$/.test(character);
}

export interface VigenereAnalysis {
  sample: string;
  keyStream: string;
  totalCharacters: number;
  transformedCharacters: number;
  unchangedCharacters: number;
  shownCharacters: number;
  truncated: boolean;
}

export function analyzeVigenere(source: string, key: string): VigenereAnalysis {
  const characters = Array.from(source);
  const sampleCharacters = characters.slice(0, VIGENERE_ANALYSIS_LIMIT);
  const normalizedKey = key.toUpperCase();
  let transformedCharacters = 0;
  let sampleKeyIndex = 0;

  for (const character of characters) {
    if (isAsciiLetter(character)) {
      transformedCharacters += 1;
    }
  }

  const keyStream = sampleCharacters
    .map((character) => {
      if (!isAsciiLetter(character)) return "·";
      const keyCharacter = normalizedKey[sampleKeyIndex % normalizedKey.length] ?? "·";
      sampleKeyIndex += 1;
      return keyCharacter;
    })
    .join("");

  return {
    sample: sampleCharacters.join(""),
    keyStream,
    totalCharacters: characters.length,
    transformedCharacters,
    unchangedCharacters: characters.length - transformedCharacters,
    shownCharacters: sampleCharacters.length,
    truncated: characters.length > sampleCharacters.length,
  };
}
