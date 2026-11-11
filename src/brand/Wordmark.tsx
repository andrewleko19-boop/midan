import { BrandSymbol } from './BrandSymbol';
import { WORDMARK_ALT, WORDMARK_MIN_WIDTH } from './wordmark.config';
import { WORDMARK_ASSETS, type WordmarkVariant } from './wordmark.generated';

type Size = { height: number; width?: never } | { width: number; height?: never };

export type WordmarkProps = Size & {
  /** pair: مِيدان above Midan (primary, Arabic-first). bi: one line. ar / en: single language. */
  variant?: WordmarkVariant;
  /** Optional #1F5FA8 accent on the kasra and the i-dot. false = single color #0E3A5F. */
  accent?: boolean;
  /** True when the name is already announced next to it. */
  decorative?: boolean;
  /** Render the original M symbol instead (compact spaces only). */
  compact?: boolean;
  className?: string;
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Pure sizing rule: derive the other side from the aspect ratio and never go below the minimum width. */
export function wordmarkSize(variant: WordmarkVariant, size: { width?: number; height?: number }) {
  const { aspect } = WORDMARK_ASSETS[variant];
  const min = WORDMARK_MIN_WIDTH[variant];
  const requested = size.width ?? (size.height === undefined ? undefined : size.height * aspect);
  if (requested === undefined) throw new Error('Wordmark needs a width or a height.');
  const clamped = requested < min;
  const width = clamped ? min : requested;
  return { width: round(width), height: round(width / aspect), clamped };
}

/**
 * The static bilingual wordmark مِيدان / Midan. Static by design: no animation, no transitions,
 * never mirrored, stretched, recolored, outlined or shadowed. Light backgrounds only (Sand or white).
 */
export function Wordmark({ variant = 'pair', accent = true, decorative = false, compact = false, className, ...size }: WordmarkProps) {
  if (compact) return <BrandSymbol size={size.height ?? size.width ?? 0} decorative={decorative} className={className} />;

  const asset = WORDMARK_ASSETS[variant];
  const { width, height, clamped } = wordmarkSize(variant, size);
  return (
    <img
      src={accent ? asset.light : asset.solid}
      alt={decorative ? '' : WORDMARK_ALT[variant]}
      width={width}
      height={height}
      draggable={false}
      className={className}
      data-wordmark={variant}
      data-clamped={clamped ? 'true' : undefined}
      // maxWidth none: Tailwind's preflight would otherwise shrink the image below the minimum size.
      style={{ width, height, maxWidth: 'none' }}
    />
  );
}
