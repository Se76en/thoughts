export const TAG_HUES: Record<string, number> = {
  physics: 239,
  mathematics: 160,
  life: 38,
  tech: 190,
  "silly thoughts": 340,
  gaming: 270,
};

const DEFAULT_HUE = 239;

export function tagHue(tag: string): number {
  return TAG_HUES[tag] ?? DEFAULT_HUE;
}

export function tagStyle(tag: string) {
  const h = tagHue(tag);
  return {
    bg: `hsla(${h}, 50%, 55%, 0.12)`,
    text: `hsla(${h}, 55%, 72%, 0.9)`,
    border: `hsla(${h}, 40%, 65%, 0.2)`,
  };
}
