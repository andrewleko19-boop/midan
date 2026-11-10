import { useEffect, useState } from "react";
import { Logo, type LogoProps } from "./Logo";
import type { SyncDirection } from "./parts";

export type LogoState = "enter" | "loading" | "sync" | "idle";

export interface AnimatedLogoProps extends Omit<LogoProps, "animated" | "animation"> {
  state?: LogoState;
  syncDirection?: SyncDirection;
  /** announced to screen readers while loading/syncing */
  statusLabel?: string;
  /** fires when the entrance has finished (immediately with reduced motion) */
  onEntered?: () => void;
}

const STATUS = {
  ar: { loading: "جارٍ التحميل", sync: "جارٍ المزامنة" },
  en: { loading: "Loading", sync: "Syncing" },
} as const;

/** Logo with a managed animation state. Remounts when the state changes so animations restart cleanly. */
export function AnimatedLogo({ state = "enter", statusLabel, onEntered, ...logo }: AnimatedLogoProps) {
  const [tick, setTick] = useState(0);
  useEffect(() => setTick((n) => n + 1), [state]);
  useEffect(() => {
    if (state !== "enter" || !onEntered) return;
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(onEntered, reduce ? 0 : 560);
    return () => clearTimeout(id);
  }, [state, onEntered]);

  const lang = logo.language === "en" ? "en" : "ar";
  const status = state === "loading" || state === "sync" ? statusLabel ?? STATUS[lang][state] : null;
  const animation = state === "idle" ? "none" : state;
  return (
    <span className="mdn-animated" role={status ? "status" : undefined} style={{ display: "inline-flex" }}>
      <Logo key={tick} {...logo} animation={animation} />
      {status && <span className="mdn-sr">{status}</span>}
    </span>
  );
}
