import { MARK } from "./geometry";
import { MarkShapes } from "./parts";
import { palette, type LogoTheme } from "./tokens";

export interface AppIconProps {
  /** px size of the square icon */
  size?: number;
  /** indigo tile (default) or sand tile */
  tone?: "indigo" | "sand";
  /** "rounded" for favicon/tab/launcher, "maskable" = full-bleed with a safe zone for OS masks */
  shape?: "rounded" | "maskable";
  decorative?: boolean;
  label?: string;
  className?: string;
}

export function AppIcon({ size = 64, tone = "indigo", shape = "rounded", decorative = false, label = "midan", className }: AppIconProps) {
  const theme: LogoTheme = tone === "indigo" ? "dark" : "light";
  const scale = shape === "maskable" ? 0.5 : 0.6;
  const { x, y, w, h } = MARK.box;
  const tx = 50 - (x + w / 2) * scale;
  const ty = 50 - (y + h / 2) * scale;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} className={className} focusable="false" {...a11y}>
      <rect width="100" height="100" rx={shape === "maskable" ? 0 : 22} fill={tone === "indigo" ? palette.indigo : palette.sand} />
      <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
        <MarkShapes theme={theme} />
      </g>
    </svg>
  );
}
