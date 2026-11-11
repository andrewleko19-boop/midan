import symbol from './assets/symbol/midan-mark-light.svg';
import { SYMBOL_MIN_SIZE } from './wordmark.config';

type Props = {
  /** Square size in px. Never rendered below 16px. */
  size: number;
  /** True when the product name is already announced next to it. */
  decorative?: boolean;
  className?: string;
};

/**
 * The ORIGINAL approved M symbol, unmodified and static.
 * Use only for the app icon, favicon, and compact spaces where the wordmark cannot fit.
 * Not a replacement for the wordmark and never a loading indicator.
 */
export function BrandSymbol({ size, decorative = false, className }: Props) {
  const px = Math.max(SYMBOL_MIN_SIZE, size);
  return (
    <img
      src={symbol}
      alt={decorative ? '' : 'مِيدان'}
      width={px}
      height={px}
      draggable={false}
      className={className}
      data-brand-symbol=""
      style={{ width: px, height: px, maxWidth: 'none' }}
    />
  );
}
