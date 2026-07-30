export const colors = {
  void: "#0A0A0C",
  ink: "#131316",
  ink2: "#1C1C21",
  line: "#2A2A30",
  bone: "#F3F2EF",
  mist: "#9C9BA5",
  smoke: "#6B6A75",
  volt: "#C9FF3F",
  plasma: "#7B6CFF",
  ember: "#FF5A4E",
} as const;

export const gradients = {
  volt: ["#C9FF3F", "#7CCB1F"],
  plasma: ["#9C8CFF", "#5A46E8"],
  ember: ["#FF8A6B", "#FF3D2E"],
  dusk: ["#232228", "#0A0A0C"],
} as const;

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function toHex(n: number) {
  return Math.round(Math.max(0, Math.min(255, n)))
    .toString(16)
    .padStart(2, "0");
}

/** Linear-interpolate between two hex colors. t=0 -> from, t=1 -> to. */
export function mixHexColors(from: string, to: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const r = a.r + (b.r - a.r) * clamped;
  const g = a.g + (b.g - a.g) * clamped;
  const bl = a.b + (b.b - a.b) * clamped;
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}
