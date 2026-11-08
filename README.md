# مِيدان · Midan — V1 UI prototype

نموذج واجهة أولي لمنصة إدارة الأعمال الميدانية. **هذه الخطوة (1) تحتوي الأساس فقط**: رموز التصميم والخطوط والأصول والفحوص. لا شاشات ولا بيانات ولا شعار بعد.

## ما هو وما ليس هو
- **هو:** واجهة قابلة للنقر ببيانات وهمية وحالة React محلية، لتعلّم المصطلحات والتدفقات من المختبِرين.
- **ليس:** منتجاً. لا خادم ولا قاعدة بيانات ولا تسجيل دخول ولا مزامنة حقيقية ولا تخزين في المتصفح. إعادة تحميل الصفحة ستعيد البيانات الوهمية إلى حالتها الأولى.
- المشكلة الأساسية ما تزال فرضية، والتحقق الميداني لم يتم. راجع `docs/TO_VALIDATE.md`.

## التشغيل
```bash
npm install
npm run dev          # تطوير
npm run check        # typecheck + lint + test + audit + brand:verify + build + audit:dist
npm run e2e          # Playwright (يلزم متصفح؛ CHROMIUM_PATH اختياري)
```

## أصول الهوية
ضع محتويات `midan-brand-assets.zip` في `brand-package/` ثم شغّل `npm run brand:copy`. ينسخ السكربت قائمة بيضاء من الملفات بايتاً ببايت ويسجل بصماتها في `brand-assets.sha256`، و`npm run brand:verify` يتحقق منها. الملف الوحيد المعدَّل هو `public/site.webmanifest` (حقول القالب فقط).

## الوثائق
`CLAUDE.md` قواعد المشروع · `docs/DECISIONS.md` القرارات والتجاوزات · `docs/TO_VALIDATE.md` ما يحتاج تحققاً · `docs/WORDMARK_NOTES.md` قرارات الشعار · `docs/reference/` المراجع.
