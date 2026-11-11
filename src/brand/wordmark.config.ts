import type { WordmarkVariant } from './wordmark.generated';

/**
 * Minimum rendered width per variant, in CSS px. [A] Taken from the F5 reference (Arabic 40, pair 120)
 * and the R6 note (English 56); `bi` uses 110, the smallest width the reference applications used.
 * Below these sizes use <Wordmark compact /> (the original M symbol) instead. To be confirmed in the Wordmark lab.
 */
export const WORDMARK_MIN_WIDTH: Record<WordmarkVariant, number> = {
  ar: 40,
  en: 56,
  pair: 120,
  bi: 110,
};

/** Accessible names. English is always "Midan" (capital M) in the text wordmark. */
export const WORDMARK_ALT: Record<WordmarkVariant, string> = {
  pair: 'مِيدان Midan',
  bi: 'مِيدان Midan',
  ar: 'مِيدان',
  en: 'Midan',
};

/** The original M symbol is never drawn smaller than this (brand guidelines). */
export const SYMBOL_MIN_SIZE = 16;
