# Argo Ticket Reference Template

هذا القالب صار محايد ومخصص للتسليم للمبرمجين بدون أي شعارات مخترعة.

الملفات:
- `D:\te=eckt\ticket-template-a4.html`

ما الذي تغيّر:
- تم حذف كل الشعارات المولدة داخل الكود.
- شعار شركة الطيران في البلوك الأزرق صار يعتمد فقط على `logoUrl` حقيقي من النظام.
- إذا لم يوجد `logoUrl` يبقى مكان الشعار Placeholder بسيط بدل اختراع أي شكل.
- أمثلة الشركات صارت أمثلة ربط فقط مثل:
  - `/logos/airlines/qatar-airways.svg`
  - `/logos/airlines/ajet.svg`
  - `/logos/airlines/turkish-airlines.svg`

نقطة مهمة:
- القالب الحالي `static HTML` ومناسب لأي Backend.
- الفريق يستطيع تعبئة القيم عبر DOM أو server-side render.
- الأفضل أن تكون شعارات شركات الطيران بصيغة `SVG`.
- إذا لم تتوفر `SVG` استخدموا `PNG` شفاف عالي الدقة.

إعدادات تصدير PDF المقترحة:
- `format: "A4"`
- `printBackground: true`
- `preferCSSPageSize: true`
- `scale: 1`

ملاحظات:
- القالب يحاول الاقتراب من المرجع بصريًا، لكن الخطوط الأصلية في المرجع غير معروفة 100%.
- إذا عندكم الخط المعتمد من المصمم، يجب ربطه مباشرة بدل Google Fonts للوصول لتطابق أعلى.
