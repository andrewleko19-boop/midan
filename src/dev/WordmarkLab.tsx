/**
 * TEMPORARY wordmark lab (Step 2). Not a product screen; open it at #wordmark.
 * Shows the exported wordmark on Sand and Surface, at small sizes, and in header-sized frames
 * so the mobile header size can be decided with real numbers. Replaced when the app shell exists (Step 5).
 */
import { Wordmark, wordmarkSize } from '@/brand/Wordmark';
import { WORDMARK_ALT, WORDMARK_MIN_WIDTH } from '@/brand/wordmark.config';
import { WORDMARK_ASSETS, type WordmarkVariant } from '@/brand/wordmark.generated';
import type { ReactNode } from 'react';

/** Bypasses the minimum-size clamp on purpose, to show what below-minimum looks like. */
function Raw({ variant, width, accent = true }: { variant: WordmarkVariant; width: number; accent?: boolean }) {
  const a = WORDMARK_ASSETS[variant];
  const height = width / a.aspect;
  return (
    <img
      src={accent ? a.light : a.solid}
      alt={WORDMARK_ALT[variant]}
      width={width}
      height={height}
      data-raw=""
      style={{ width, height, maxWidth: 'none' }}
    />
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <h2 className="mb-3 text-section font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Frame({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <figure className="m-0">
      <figcaption className="mb-1 text-caption">
        <span className="font-medium">{label}</span> <span className="text-muted">· {note}</span>
      </figcaption>
      <div
        className="flex items-center justify-between rounded-control border border-line bg-page px-4"
        style={{ width: '100%', maxWidth: 360, minHeight: 54 }}
      >
        {children}
        <span className="text-caption text-muted">القائمة</span>
      </div>
    </figure>
  );
}

const sizeNote = (v: WordmarkVariant, s: { width?: number; height?: number }) => {
  const r = wordmarkSize(v, s);
  return `${r.width}×${r.height}px${r.clamped ? ' (رُفع للحد الأدنى)' : ''}`;
};

export function WordmarkLab() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-4 p-4 md:p-6">
      <header>
        <h1 className="text-title font-semibold">مختبر الشعار النصي · مؤقت</h1>
        <p className="text-caption text-muted">
          للتحقق من الحجم والخلفية فقط. ليس شاشة من المنتج. <a className="underline" href="#foundation">العودة لصفحة الأساس</a>
        </p>
      </header>

      <Section title="المركّب الأساسي (F1) على Sand وعلى Surface">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex justify-center rounded-control bg-page p-6">
            <Wordmark variant="pair" width={260} />
          </div>
          <div className="flex justify-center rounded-control border border-line bg-surface p-6">
            <Wordmark variant="pair" width={260} />
          </div>
        </div>
        <p className="mt-2 text-caption text-muted">يمين: Sand #F4EDE0 · يسار: Surface #FFFDF8</p>
      </Section>

      <Section title="التمييز اختياري: مع #1F5FA8 وبدونه">
        <div className="flex flex-wrap items-center gap-6">
          <Wordmark variant="pair" width={180} />
          <Wordmark variant="pair" width={180} accent={false} />
        </div>
      </Section>

      <Section title="التراكيب الأربعة">
        <div className="flex flex-col gap-4">
          {(['pair', 'bi', 'ar', 'en'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-4">
              <span className="w-12 text-caption text-muted" dir="ltr">{v}</span>
              <Wordmark variant={v} width={v === 'bi' ? 280 : 160} />
              <span className="text-caption text-muted" dir="ltr">min {WORDMARK_MIN_WIDTH[v]}px wide · aspect {WORDMARK_ASSETS[v].aspect.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="سلّم الأحجام (الأحمر = تحت الحد الأدنى، للاختبار فقط)">
        <div className="flex flex-col gap-3">
          {(['ar', 'en', 'pair', 'bi'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-end gap-4">
              <span className="w-12 text-caption text-muted" dir="ltr">{v}</span>
              {[220, 160, 120, 110, 80, 56, 40, 28].map((w) => (
                <div key={w} className="flex flex-col items-start gap-1">
                  <Raw variant={v} width={w} />
                  <span className={`text-caption ${w < WORDMARK_MIN_WIDTH[v] ? 'text-attention-ink' : 'text-muted'}`} dir="ltr">
                    {w}px{w < WORDMARK_MIN_WIDTH[v] ? ' ▲' : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="هيدر الجوال: ثلاثة خيارات بالحجم الفعلي (شريط 54px)">
        <div className="flex flex-col gap-4">
          <Frame label="أ · pair عند الحد الأدنى" note={sizeNote('pair', { width: 120 })}>
            <Wordmark variant="pair" width={120} />
          </Frame>
          <Frame label="ب · bi (سطر واحد)" note={sizeNote('bi', { height: 28 })}>
            <Wordmark variant="bi" height={28} />
          </Frame>
          <Frame label="ج · العربي وحده" note={sizeNote('ar', { height: 30 })}>
            <Wordmark variant="ar" height={30} />
          </Frame>
          <Frame label="رمز فقط (للمساحات الضيقة)" note="32×32px، الرمز الأصلي كما هو">
            <Wordmark compact height={32} />
          </Frame>
        </div>
      </Section>

      <Section title="رأس الشريط الجانبي على الديسكتوب (عرض 232px)">
        <div className="flex flex-wrap gap-4">
          {(
            [
              ['pair', { width: 120 }],
              ['bi', { width: 160 }],
              ['ar', { width: 96 }],
            ] as const
          ).map(([v, s]) => (
            <figure key={v} className="m-0">
              <figcaption className="mb-1 text-caption text-muted" dir="ltr">{v} · {sizeNote(v, s)}</figcaption>
              <div className="flex items-center rounded-control border border-line bg-page p-4" style={{ width: 232 }}>
                <Wordmark variant={v} {...s} />
              </div>
            </figure>
          ))}
        </div>
      </Section>
    </main>
  );
}
