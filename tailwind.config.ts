import type { Config } from 'tailwindcss';

/**
 * Strict mapping to the design tokens in src/styles/tokens.css.
 * Colors, spacing, radius, type and weights are REPLACED (not extended), so the default
 * Tailwind palette and scales are unavailable. Motion utilities are disabled (no animation in V1).
 * Dark mode is bound to a selector that is never set; scripts/audit.mjs also rejects `dark:`.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    screens: { md: '768px' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      page: 'var(--ui-page)',
      surface: 'var(--ui-surface)',
      ink: 'var(--ui-ink)',
      muted: 'var(--ui-muted)',
      line: 'var(--ui-line)',
      primary: 'var(--ui-primary)',
      'on-primary': 'var(--ui-on-primary)',
      progress: 'var(--ui-progress)',
      attention: 'var(--ui-attention)',
      'attention-tint': 'var(--ui-attention-tint)',
      'attention-ink': 'var(--ui-attention-ink)',
      focus: 'var(--ui-focus)',
      'status-new': 'var(--status-new-bg)',
      'status-new-ink': 'var(--status-new-fg)',
      'status-active': 'var(--status-active-bg)',
      'status-active-ink': 'var(--status-active-fg)',
      'status-review': 'var(--status-review-bg)',
      'status-review-ink': 'var(--status-review-fg)',
      'status-done': 'var(--status-done-bg)',
      'status-done-ink': 'var(--status-done-fg)',
    },
    spacing: {
      0: '0px',
      px: '1px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      6: '24px',
      8: '32px',
      'target-desktop': 'var(--target-desktop)',
      'target-mobile': 'var(--target-mobile)',
      'target-field': 'var(--target-field)',
    },
    borderRadius: {
      none: '0px',
      control: 'var(--radius-control)',
      card: 'var(--radius-card)',
      full: '9999px',
    },
    fontFamily: {
      sans: ['"Readex Pro"', 'system-ui', '"Segoe UI"', 'Tahoma', 'sans-serif'],
    },
    fontSize: {
      caption: ['12.5px', { lineHeight: '1.5' }],
      body: ['14px', { lineHeight: '1.6' }],
      section: ['15px', { lineHeight: '1.5' }],
      title: ['22px', { lineHeight: '1.4' }],
      metric: ['28px', { lineHeight: '1.2' }],
      'metric-lg': ['30px', { lineHeight: '1.2' }],
    },
    fontWeight: { normal: '400', medium: '500', semibold: '600' },
    boxShadow: { none: 'none', fab: 'var(--shadow-fab)' },
    extend: {},
  },
  corePlugins: {
    animation: false,
    transitionProperty: false,
    transitionDuration: false,
    transitionDelay: false,
    transitionTimingFunction: false,
  },
  plugins: [],
};

export default config;
