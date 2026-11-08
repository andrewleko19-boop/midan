/**
 * TEMPORARY foundation smoke page (Step 1). Not a product screen.
 * Verifies tokens, Readex Pro weights, Western digits and RTL logical properties.
 * No wordmark here (Step 2). Replaced in Steps 3 and 5.
 */
type Swatch = { name: string; varName: string; note?: string };

const brand: Swatch[] = [
  { name: 'Indigo', varName: '--brand-indigo' },
  { name: 'Teal', varName: '--brand-teal' },
  { name: 'Copper', varName: '--brand-copper', note: 'رسم فقط' },
  { name: 'Sand', varName: '--brand-sand' },
  { name: 'Night', varName: '--brand-night', note: 'محجوز للعلامة' },
];

const ui: Swatch[] = [
  { name: 'الصفحة', varName: '--ui-page' },
  { name: 'السطح', varName: '--ui-surface' },
  { name: 'النص الثانوي', varName: '--ui-muted' },
  { name: 'الخط الفاصل', varName: '--ui-line' },
];

const wordmark: Swatch[] = [
  { name: 'حبر الشعار', varName: '--wordmark-ink' },
  { name: 'تمييز اختياري', varName: '--wordmark-accent' },
];

const statuses = [
  { label: 'جديدة', bg: 'bg-status-new', fg: 'text-status-new-ink' },
  { label: 'قيد التنفيذ', bg: 'bg-status-active', fg: 'text-status-active-ink' },
  { label: 'قيد المراجعة', bg: 'bg-status-review', fg: 'text-status-review-ink' },
  { label: 'مكتملة', bg: 'bg-status-done', fg: 'text-status-done-ink' },
  { label: 'متأخرة', bg: 'bg-attention-tint', fg: 'text-attention-ink' },
];

function SwatchRow({ items }: { items: Swatch[] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((s) => (
        <li key={s.varName} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-6 w-8 rounded-control border border-line"
            style={{ backgroundColor: `var(${s.varName})` }}
          />
          <span className="text-caption">
            {s.name}
            {s.note ? <span className="text-muted"> · {s.note}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <h2 className="mb-3 text-section font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function FoundationSmoke() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-4 p-4 md:p-6">
      <header>
        <h1 className="text-title font-semibold">صفحة تجريبية مؤقتة · أساس المشروع</h1>
        <p className="text-caption text-muted">
          للتحقق من الرموز والخطوط واتجاه RTL فقط. ليست شاشة من المنتج.
        </p>
      </header>

      <Section title="الطبقة 1 · العلامة">
        <SwatchRow items={brand} />
      </Section>

      <Section title="الطبقة 2 · الواجهة">
        <SwatchRow items={ui} />
        <ul className="mt-3 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <li key={s.label} className={`rounded-full px-3 py-1 text-caption font-medium ${s.bg} ${s.fg}`}>
              {s.label}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-caption text-muted">الأشكال المرافقة للحالات تأتي مع مكوّن الشارة في الخطوة 3.</p>
      </Section>

      <Section title="الطبقة 3 · ألوان الشعار (قيم فقط، بلا شعار في هذه الخطوة)">
        <SwatchRow items={wordmark} />
      </Section>

      <Section title="الخط والأرقام">
        <p className="text-caption">12.5 · نص توضيحي بوزن 400</p>
        <p className="text-body font-normal">14 · النص الأساسي بوزن 400</p>
        <p className="text-body font-medium">14 · النص الأساسي بوزن 500</p>
        <p className="text-section font-semibold">15 · عنوان قسم بوزن 600</p>
        <p className="text-title font-semibold">22 · عنوان صفحة</p>
        <p className="text-metric font-semibold">28 · 61 · 148 · 07</p>
        <p className="text-caption text-muted">أرقام غربية: 24 · 61 · 148 — Readex Pro 400 / 500 / 600</p>
      </Section>

      <Section title="اتجاه RTL والخصائص المنطقية">
        <div className="flex items-stretch gap-3">
          <div className="border-s-4 border-progress ps-4 text-start">
            حد على بداية السطر (start) ويقع يميناً في RTL.
          </div>
          <div className="ms-auto border-e-4 border-attention pe-4 text-end">
            حد على نهاية السطر (end).
          </div>
        </div>
      </Section>

      <Section title="أحجام أهداف النقر">
        <ul className="flex flex-wrap items-center gap-3 text-caption">
          <li className="flex h-target-desktop items-center rounded-control border border-line px-3">40 ديسكتوب</li>
          <li className="flex h-target-mobile items-center rounded-control border border-line px-3">44 جوال</li>
          <li className="flex h-target-field items-center rounded-control border border-line px-3">52 عامل ميداني</li>
        </ul>
      </Section>
    </main>
  );
}
