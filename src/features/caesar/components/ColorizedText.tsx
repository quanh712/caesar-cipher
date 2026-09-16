interface ColorizedTextProps {
  text: string;
}

type CharacterGroup = "upper" | "lower" | "other";

function getCharacterGroup(character: string): CharacterGroup {
  const code = character.charCodeAt(0);
  if (code >= 65 && code <= 90) return "upper";
  if (code >= 97 && code <= 122) return "lower";
  return "other";
}

export function ColorizedText({ text }: ColorizedTextProps) {
  if (text.length > 20_000) return text;

  const groups: Array<{ type: CharacterGroup; value: string }> = [];

  for (const character of text) {
    const type = getCharacterGroup(character);
    const previousGroup = groups.at(-1);

    if (previousGroup?.type === type) {
      previousGroup.value += character;
    } else {
      groups.push({ type, value: character });
    }
  }

  return groups.map((group, index) => (
    <span className={`character character--${group.type}`} key={`${group.type}-${index}`}>
      {group.value}
    </span>
  ));
}
