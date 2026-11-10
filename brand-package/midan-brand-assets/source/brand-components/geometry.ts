import glyphs from "./glyphs.json";

/** The mark lives in a 100×100 grid. Both routes run bottom → node, so sync pulses flow field → centre. */
export const MARK = {
  left: "M18 90V34Q18 22 25.3 31.5L50 70",
  right: "M82 90V22Q82 10 75.9 20.3L50 70",
  stroke: 16,
  node: { cx: 50, cy: 70, r: 9.5 },
  knockout: 4, // monochrome: gap ring around the node
  /** measured ink bounds, stroke included */
  box: { x: 10, y: 7.5, w: 80, h: 90.5 },
} as const;

export type Language = "ar" | "en" | "both";
export type Variant = "full" | "compact" | "mark";
export type Direction = "rtl" | "ltr";

export const GLYPHS = glyphs as {
  upm: number;
  ar: { d: string; w: number; top: number; bottom: number };
  en: { d: string; w: number; top: number; bottom: number };
};

export type Item =
  | { kind: "mark"; x: number; y: number }
  | { kind: "word"; lang: "ar" | "en"; x: number; baseline: number; s: number }
  | { kind: "rule"; x: number; y: number; w: number; h: number };

export interface LogoLayout {
  width: number;
  height: number;
  items: Item[];
}

const H = MARK.box.h;
const arH = GLYPHS.ar.bottom - GLYPHS.ar.top;
const enH = GLYPHS.en.bottom - GLYPHS.en.top;

/**
 * Pure layout: where the mark and wordmarks sit for a given variant/language.
 * Units are mark units (mark ink height = 90.5). The mark sits at the start edge of the reading direction.
 * `withMark:false` gives wordmark-only lockups.
 */
export function layout(variant: Variant, language: Language, dir: Direction, withMark = true): LogoLayout {
  const markW = MARK.box.w;
  if (variant === "mark" && withMark) return { width: markW, height: H, items: [{ kind: "mark", x: 0, y: 0 }] };

  const compact = variant === "compact";
  const gap = compact ? 18 : 24;
  const cy = H / 2;
  // text block as a list of pieces laid out left→right inside a local box, then mirrored/positioned
  type Piece = { w: number; make: (x: number) => Item[] };
  let block: Piece;

  const arWord = (s: number, baseline: number) => (x: number): Item[] => [{ kind: "word", lang: "ar", x, baseline, s }];
  const enWord = (s: number, baseline: number) => (x: number): Item[] => [{ kind: "word", lang: "en", x, baseline, s }];

  if (language === "ar") {
    const s = ((compact ? 0.7 : 0.8) * H) / arH;
    block = { w: GLYPHS.ar.w * s, make: arWord(s, cy - ((GLYPHS.ar.top + GLYPHS.ar.bottom) / 2) * s) };
  } else if (language === "en") {
    const s = ((compact ? 0.52 : 0.58) * H) / enH;
    block = { w: GLYPHS.en.w * s, make: enWord(s, cy - ((GLYPHS.en.top + GLYPHS.en.bottom) / 2) * s) };
  } else if (!compact) {
    // Arabic-first stack: Arabic large, English small, both aligned to the start edge
    const sA = 0.054, sE = 0.032, g = 9;
    const aH = arH * sA, eH = enH * sE, top = (H - (aH + g + eH)) / 2;
    const wA = GLYPHS.ar.w * sA, wE = GLYPHS.en.w * sE, w = Math.max(wA, wE);
    const bA = top - GLYPHS.ar.top * sA, bE = top + aH + g - GLYPHS.en.top * sE;
    const startAr = dir === "rtl";
    block = {
      w,
      make: (x) => [
        { kind: "word", lang: "ar", x: x + (startAr ? w - wA : 0), baseline: bA, s: sA },
        { kind: "word", lang: "en", x: x + (startAr ? w - wE : 0), baseline: bE, s: sE },
      ],
    };
  } else {
    // one-line bilingual: Arabic | English
    const sA = 0.056, sE = 0.05, d = 14, rule = 2.5, rh = 40;
    const wA = GLYPHS.ar.w * sA, wE = GLYPHS.en.w * sE;
    const bA = cy - ((GLYPHS.ar.top + GLYPHS.ar.bottom) / 2) * sA;
    const bE = cy - ((GLYPHS.en.top + GLYPHS.en.bottom) / 2) * sE;
    const w = wA + d + rule + d + wE;
    block = {
      w,
      make: (x) => {
        const [a, e] = dir === "rtl" ? ["en", "ar"] : ["ar", "en"]; // left→right order
        const widths = { ar: wA, en: wE } as const;
        const wordAt = (lang: "ar" | "en", px: number): Item =>
          lang === "ar" ? { kind: "word", lang, x: px, baseline: bA, s: sA } : { kind: "word", lang, x: px, baseline: bE, s: sE };
        const first = a as "ar" | "en", second = e as "ar" | "en";
        return [
          wordAt(first, x),
          { kind: "rule", x: x + widths[first] + d, y: cy - rh / 2, w: rule, h: rh },
          wordAt(second, x + widths[first] + d + rule + d),
        ];
      },
    };
  }

  if (!withMark) {
    const hh = language === "both" && !compact ? H : H;
    return { width: block.w, height: hh, items: block.make(0) };
  }
  const width = markW + gap + block.w;
  if (dir === "rtl") return { width, height: H, items: [...block.make(0), { kind: "mark", x: width - markW, y: 0 }] };
  return { width, height: H, items: [{ kind: "mark", x: 0, y: 0 }, ...block.make(markW + gap)] };
}
