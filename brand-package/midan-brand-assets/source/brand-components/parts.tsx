import { useId } from "react";
import { GLYPHS, MARK } from "./geometry";
import { themes, type LogoTheme } from "./tokens";

export type MarkAnimation = "none" | "enter" | "loading" | "sync";
export type SyncDirection = "up" | "down";

export const animationClass = (a: MarkAnimation, dir: SyncDirection = "up") =>
  a === "enter" ? "mdn-enter" : a === "loading" ? "mdn-loading" : a === "sync" ? `mdn-sync mdn-sync-${dir}` : "";

/** The mark's shapes, in mark units. Shared by every component – this is the only place the mark is drawn. */
export function MarkShapes({ theme, animation = "none" }: { theme: LogoTheme; animation?: MarkAnimation }) {
  const t = themes[theme];
  const mono = theme === "monochrome";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { cx, cy, r } = MARK.node;
  const R = r + MARK.knockout;
  const route = { fill: "none", strokeWidth: MARK.stroke, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1 } as const;
  const pulse = animation === "sync" && t.pulse;
  const pulseProps = { fill: "none", strokeWidth: MARK.stroke - 7, strokeLinecap: "butt", strokeLinejoin: "round", pathLength: 1, stroke: t.pulse ?? undefined } as const;
  return (
    <>
      {mono && (
        <defs>
          <clipPath id={`mdn-ko-${uid}`}>
            <path clipRule="evenodd" d={`M-20 -20H120V120H-20Z M${cx - R} ${cy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z`} />
          </clipPath>
        </defs>
      )}
      <g clipPath={mono ? `url(#mdn-ko-${uid})` : undefined}>
        <g className="mdn-l">
          <path className="mdn-route mdn-route-l" d={MARK.left} stroke={t.left} {...route} />
          {pulse && <path className="mdn-pulse mdn-pulse-l" d={MARK.left} {...pulseProps} />}
        </g>
        <g className="mdn-r">
          <path className="mdn-route mdn-route-r" d={MARK.right} stroke={t.right} {...route} />
          {pulse && <path className="mdn-pulse mdn-pulse-r" d={MARK.right} {...pulseProps} />}
        </g>
      </g>
      <circle className="mdn-halo" cx={cx} cy={cy} r={r + 2} fill="none" stroke={t.node} strokeWidth={2} opacity={0} />
      <circle className="mdn-node" cx={cx} cy={cy} r={r} fill={t.node} />
    </>
  );
}

export function WordPath({ lang, fill }: { lang: "ar" | "en"; fill: string }) {
  return <path d={GLYPHS[lang].d} fill={fill} />;
}
