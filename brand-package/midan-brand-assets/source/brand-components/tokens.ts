/** Single source of truth for brand colors. Change a value here, run `npm run assets`. */
export const palette = {
  indigo: "#1B2A4E", // Midnight Indigo – primary ink, left route
  teal: "#1F7A6F", // Field Teal – right route
  copper: "#BF7129", // Copper – the node, used sparingly
  sand: "#F4EDE0", // Sand – light surface
  night: "#0F1730", // Night – dark surface
  tealLight: "#4DBFAA", // Field Teal for dark surfaces
  copperLight: "#E39A4F", // Copper for dark surfaces
} as const;

export type LogoTheme = "light" | "dark" | "monochrome";

export interface ThemeColors {
  left: string;
  right: string;
  node: string;
  word: string;
  /** colour of the travelling sync highlight; null = not drawn (monochrome) */
  pulse: string | null;
}

export const themes: Record<LogoTheme, ThemeColors> = {
  light: { left: palette.indigo, right: palette.teal, node: palette.copper, word: palette.indigo, pulse: palette.sand },
  dark: { left: palette.sand, right: palette.tealLight, node: palette.copperLight, word: palette.sand, pulse: palette.night },
  monochrome: { left: "currentColor", right: "currentColor", node: "currentColor", word: "currentColor", pulse: null },
};

const lin = (v: number) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
/** WCAG contrast ratio between two #RRGGBB colours. */
export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
