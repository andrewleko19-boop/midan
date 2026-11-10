import type { CSSProperties } from "react";
import { layout, MARK, type Direction, type Language, type Variant } from "./geometry";
import { animationClass, MarkShapes, WordPath, type MarkAnimation, type SyncDirection } from "./parts";
import { themes, type LogoTheme } from "./tokens";

export type LogoSize = "sm" | "md" | "lg";
/** Rendered height of the logo (mark height) in px. */
export const LOGO_HEIGHT: Record<LogoSize, number> = { sm: 28, md: 40, lg: 64 };

export interface LogoProps {
  variant?: Variant;
  language?: Language;
  theme?: LogoTheme;
  /** true → play the entrance animation once on mount. */
  animated?: boolean;
  /** explicit animation state; wins over `animated`. */
  animation?: MarkAnimation;
  syncDirection?: SyncDirection;
  size?: LogoSize;
  /** exact height in px; overrides `size` (e.g. 16 for a favicon-scale check). */
  height?: number;
  /** layout direction of the lockup; defaults to rtl for ar/both, ltr for en. */
  dir?: Direction;
  /** hover/focus lift of the right route. Also triggers when the logo is inside a hovered <a>/<button>. */
  interactive?: boolean;
  /** hide from assistive tech (use when the name is already announced next to it). */
  decorative?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export const brandName = (language: Language) => (language === "ar" ? "مِيدان" : language === "en" ? "midan" : "مِيدان midan");

interface InternalProps extends LogoProps {
  withMark?: boolean;
}

export function LogoSvg({
  variant = "full", language = "ar", theme = "light", animated = false, animation, syncDirection = "up",
  size = "md", height, dir, interactive = false, decorative = false, label, className, style, withMark = true,
}: InternalProps) {
  const d: Direction = dir ?? (language === "en" ? "ltr" : "rtl");
  const anim: MarkAnimation = animation ?? (animated ? "enter" : "none");
  const lay = layout(variant, language, d, withMark);
  const h = height ?? LOGO_HEIGHT[size];
  const t = themes[theme];
  const markOnly = variant === "mark" && withMark;
  const cls = ["mdn-logo", animationClass(anim, syncDirection), interactive ? "mdn-interactive" : "", className ?? ""].filter(Boolean).join(" ");
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label ?? brandName(markOnly ? "both" : language) };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={markOnly ? `${MARK.box.x} ${MARK.box.y} ${MARK.box.w} ${MARK.box.h}` : `0 0 ${lay.width} ${lay.height}`}
      width={(h * lay.width) / lay.height}
      height={h}
      focusable="false"
      className={cls}
      style={style}
      {...a11y}
    >
      {markOnly ? (
        <MarkShapes theme={theme} animation={anim} />
      ) : (
        lay.items.map((it, i) =>
          it.kind === "mark" ? (
            <g key={i} transform={`translate(${it.x - MARK.box.x} ${it.y - MARK.box.y})`}>
              <MarkShapes theme={theme} animation={anim} />
            </g>
          ) : it.kind === "word" ? (
            <g key={i} className="mdn-word" transform={`translate(${it.x} ${it.baseline}) scale(${it.s})`}>
              <WordPath lang={it.lang} fill={t.word} />
            </g>
          ) : (
            <rect key={i} className="mdn-word" x={it.x} y={it.y} width={it.w} height={it.h} rx={it.w / 2} fill={t.word} opacity={0.35} />
          ),
        )
      )}
    </svg>
  );
}

/** Mark + wordmark lockups, or the mark alone with variant="mark". */
export function Logo(props: LogoProps) {
  return <LogoSvg {...props} />;
}

/** The mark only. */
export function LogoMark(props: Omit<LogoProps, "variant" | "language">) {
  return <LogoSvg {...props} variant="mark" />;
}

/** Wordmark(s) without the mark. language="both" stacks Arabic over English. */
export function LogoWordmark(props: Omit<LogoProps, "variant">) {
  return <LogoSvg {...props} withMark={false} />;
}
export const ArabicWordmark = (p: Omit<LogoProps, "variant" | "language">) => <LogoWordmark {...p} language="ar" />;
export const EnglishWordmark = (p: Omit<LogoProps, "variant" | "language">) => <LogoWordmark {...p} language="en" />;

