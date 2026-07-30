/**
 * prompts توليد صفحات البروشور بالذكاء الاصطناعي
 * ملاحظة: بيانات الهوية الثابتة مُدمجة في كل prompt لضمان الدقة
 * الاسم العربي: شركة دلمون للاستثمار
 * الاسم الإنجليزي: DELMON INVESTMENT COMPANY
 * الموقع: www.delmon-invest.com
 * البريد: info@delmon-invest.com
 */

export interface ProjectData {
  projectName: string;
  projectType: string;
  city: string;
  district?: string;
  totalArea: string;
  floors: string;
  completionYear: string;
  description: string;
  amenities: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  units: Array<{
    unitNumber: string;
    floor: string;
    area: string;
    unitType: string;
    monthlyRent?: string;
    pricePerMeter?: string;
    contractDuration?: string;
    description?: string;
    features?: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// بيانات الهوية الثابتة — لا تُعدَّل
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = {
  nameAr: "شركة دلمون للاستثمار",
  nameEn: "DELMON INVESTMENT COMPANY",
  website: "www.delmon-invest.com",
  email: "info@delmon-invest.com",
  tagline: "نحو استثمار عقاري مستدام",
};

// ─────────────────────────────────────────────────────────────────────────────
// مساعد: بناء جدول الوحدات كنص
// ─────────────────────────────────────────────────────────────────────────────
function buildUnitsText(data: ProjectData): string {
  const available = data.units.filter((_, i) => i % 2 === 0); // نصف الوحدات "متاحة"
  const rows = data.units.slice(0, 8).map((u, i) => {
    const status = i % 2 === 0 ? "متاحة" : "مؤجرة";
    const rent = u.monthlyRent ? `${Number(u.monthlyRent).toLocaleString("ar-SA")} ريال` : "—";
    return `وحدة ${u.unitNumber || (i + 101)} | الطابق ${u.floor || (i + 1)} | ${u.area} م² | ${u.unitType} | ${status} | ${rent}`;
  }).join("\n");
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const availableCount = data.units.filter((_, i) => i % 2 === 0).length;
  return `${rows}\n\nإجمالي الوحدات: ${data.units.length} | المتاحة: ${availableCount} | إجمالي المساحة: ${totalArea.toLocaleString("ar-SA")} م²`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIC TEMPLATE — أبيض/ذهبي/كحلي احترافي
// ─────────────────────────────────────────────────────────────────────────────
export function classicPrompts(data: ProjectData): string[] {
  const units = buildUnitsText(data);
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const availableCount = data.units.filter((_, i) => i % 2 === 0).length;

  return [
    // ص1 — الغلاف الأمامي
    `Design a professional Arabic RTL real estate brochure COVER PAGE for a leasing brochure. Portrait A4 format (1632x2176px).
STYLE: Classic professional — white background, deep navy blue (#1a2744) header band at top, gold accent lines (#c9a84c), clean serif/sans-serif Arabic typography. Corporate real estate feel.
LAYOUT:
- Top band (navy): company logo area left, company name right
- Center: large bold Arabic title "كتيب التأجير" with gold underline
- Below title: project name "${data.projectName}" in large gold text
- Subtitle: "${data.projectType} — ${data.city}${data.district ? ` — ${data.district}` : ""}"
- Bottom third: placeholder for building photo (gray gradient box with building silhouette icon)
- Footer: thin gold line, then "${BRAND.nameAr}" in Arabic, "${BRAND.nameEn}" in English, website "${BRAND.website}"
TEXT TO SHOW EXACTLY:
Header: "${BRAND.nameAr}" | "${BRAND.nameEn}"
Main title: "كتيب التأجير"
Project: "${data.projectName}"
Footer: "${BRAND.website}" | "${BRAND.email}"
All text must be in Arabic (RTL), professional font, no spelling errors.`,

    // ص2 — نبذة عن المشروع
    `Design page 2 of an Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Classic professional — white background, navy blue (#1a2744) accents, gold highlights (#c9a84c).
PAGE TITLE: "نبذة عن المشروع" — bold, centered, navy blue, gold underline bar.
LAYOUT (two-column):
LEFT COLUMN (40%): rectangular photo placeholder box with subtle border, labeled "صورة المشروع"
RIGHT COLUMN (60%): 4 info cards stacked:
  Card 1 — location icon + "الموقع:" + "${data.city}${data.district ? ` — ${data.district}` : ""}"
  Card 2 — area icon + "المساحة الإجمالية:" + "${data.totalArea} م²"
  Card 3 — units icon + "عدد الوحدات:" + "${data.units.length}"
  Card 4 — calendar icon + "سنة الإنجاز:" + "${data.completionYear}"
BELOW COLUMNS: description paragraph text: "${data.description}"
FOOTER: thin gold line | "${BRAND.nameAr}" logo area | page number "02" right side | "${BRAND.nameEn}"
All Arabic RTL text, professional typography, no placeholder text.`,

    // ص3 — مكونات المشروع
    `Design page 3 of an Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Classic professional — white/light gray background, navy blue accents, gold icons.
PAGE TITLE: "مكونات المشروع ومرافقه" — bold, centered, navy.
LAYOUT: 3×3 grid of feature cards. Each card: icon (gold outline style) + title + short description.
Cards content based on: "${data.amenities}"
Default cards if amenities not specified:
  1. مكاتب إدارية — مساحات مكتبية عصرية بتصميم فاخر
  2. محلات تجارية — محلات في مواقع استراتيجية
  3. مواقف سيارات — مواقف واسعة وآمنة
  4. بهو فاخر — استقبال راقٍ بتصميم عصري
  5. قاعات اجتماعات — مجهزة بأحدث التقنيات
  6. مطعم — تجربة مميزة ضمن المشروع
  7. أمن 24/7 — أنظمة مراقبة متطورة
  8. صيانة — خدمات احترافية مستمرة
  9. إنترنت فايبر — تغطية كاملة عالية السرعة
FOOTER: "${BRAND.website}" left | phone "${data.contactPhone}" right | location "${data.city}" far right
All Arabic RTL, clean professional design.`,

    // ص4 — جدول الوحدات
    `Design page 4 of an Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Classic professional — white background, navy header row, alternating light gray rows, gold "متاحة" badges, gray "مؤجرة" badges.
PAGE TITLE: "جدول الوحدات المتاحة" — bold, centered.
TOP RIGHT: company logo + "${BRAND.nameAr}" | "${BRAND.nameEn}"
TABLE (RTL, Arabic headers):
Headers: رقم الوحدة | الطابق | المساحة م² | نوع الوحدة | الحالة | الإيجار السنوي ريال
Data rows:
${units}
SUMMARY BAR at bottom: 3 boxes:
  Box 1: "إجمالي الوحدات" + "${data.units.length} وحدة"
  Box 2: "إجمالي المساحة" + "${totalArea.toLocaleString("ar-SA")} م²"
  Box 3: "الوحدات المتاحة" + "${availableCount} وحدة"
FOOTER: "${BRAND.website}" | "${BRAND.email}" | "${data.contactPhone}" | "${data.city}"
All Arabic RTL, professional data table design.`,

    // ص5 — الموقع والمزايا
    `Design page 5 of an Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Classic professional — dark navy left panel, white right panel.
PAGE TITLE: "الموقع والمزايا" — bold, white text on navy background.
LEFT PANEL (50%): dark map placeholder showing "${data.city}" with pin marker and nearby landmarks labeled.
RIGHT PANEL (50%):
  Section "مزايا الموقع": 4 feature boxes with icons:
    - سهولة الوصول — قريب من الطرق الرئيسية
    - موقع استراتيجي — في قلب ${data.city}
    - قريب من كل ما يهمك — مدارس، مراكز طبية، مجمعات
    - بيئة راقية وهادئة — حي متميز بالهدوء
  Section "أقرب المعالم": small table with distances
BOTTOM CTA BANNER: gold background, white text: "احجز وحدتك الآن — للاستفسار والتواصل"
FOOTER: "${BRAND.website}" | "${data.contactPhone}"
All Arabic RTL.`,

    // ص6 — شروط التأجير
    `Design page 6 of an Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Classic professional — white background, navy/gold accents.
PAGE TITLE: "شروط وأحكام التأجير" — bold, centered.
TOP RIGHT: "${BRAND.nameAr}" | "${BRAND.nameEn}" logo area
TWO COLUMNS:
LEFT (financial summary box — gold border):
  قيمة الإيجار السنوي: [from units data, largest value]
  الزيادة السنوية: 5% من قيمة الإيجار
  موعد سداد الإيجار: بداية كل ربع سنة
  قيمة التأمين: شهرين إيجار (مستردة)
RIGHT (numbered terms list):
  01 — مدة العقد: سنة ميلادية قابلة للتجديد
  02 — سداد الإيجار: دفعة مقدمة أو دفعات ربع سنوية
  03 — التأمين: يعادل شهرين إيجار عند توقيع العقد
  04 — الاستخدام: للأغراض التجارية فقط وفق النشاط المرخص
  05 — الصيانة والتعديلات: يلتزم المستأجر بالمحافظة على العقار
FOOTER: phone "${data.contactPhone}" | email "${BRAND.email}"
All Arabic RTL, professional layout.`,

    // ص7 — الغلاف الخلفي / التواصل
    `Design the BACK COVER (page 7) of an Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Classic professional — white bottom half, navy top half with building photo placeholder.
TOP HALF: dark navy/charcoal background with large building photo placeholder, company name overlay.
BOTTOM HALF: white background, centered contact card:
  Large Arabic company name: "${BRAND.nameAr}"
  English name below: "${BRAND.nameEn}"
  Gold divider line
  4 contact rows with icons:
    📞 ${data.contactPhone}
    ✉️ ${BRAND.email}
    🌐 ${BRAND.website}
    📍 ${data.city}، المملكة العربية السعودية
  Bottom tagline: "${BRAND.tagline}"
IMPORTANT: The company name must be EXACTLY "${BRAND.nameAr}" in Arabic and "${BRAND.nameEn}" in English. No variations.
All Arabic RTL, elegant closing page design.`,
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// DARK LUXURY TEMPLATE — أسود/ذهبي فاخر
// ─────────────────────────────────────────────────────────────────────────────
export function darkPrompts(data: ProjectData): string[] {
  const units = buildUnitsText(data);
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const availableCount = data.units.filter((_, i) => i % 2 === 0).length;

  return [
    // ص1 — الغلاف الأمامي
    `Design a LUXURY DARK Arabic RTL real estate brochure COVER PAGE. Portrait A4 (1632x2176px).
STYLE: Ultra-premium dark luxury — pure black (#0a0a0a) background, gold (#c9a84c) ornamental accents, gold gradient text, subtle gold geometric patterns. High-end real estate feel.
LAYOUT:
- Top: thin gold ornamental divider line
- Upper area: company name in gold Arabic calligraphy style: "${BRAND.nameAr}" | "${BRAND.nameEn}" in smaller gold English
- Center: large gold Arabic title "كتيب التأجير الفاخر"
- Below: project name "${data.projectName}" in large bright gold text
- Subtitle: "${data.projectType} | ${data.city}" in smaller gold
- Large photo placeholder (dark with gold border frame): building image area
- Bottom: gold ornamental line + page indicator
FOOTER: "${BRAND.nameAr}" | "${BRAND.nameEn}" | "${BRAND.website}"
All text gold on black, Arabic RTL, luxury typography.`,

    // ص2 — نبذة عن المشروع
    `Design page 2 of a LUXURY DARK Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Black background (#0d0d0d), gold (#c9a84c) text and borders, dark card panels.
PAGE TITLE: "نبذة عن المشروع" — large gold Arabic text, centered, gold ornamental underline.
LAYOUT:
LEFT (45%): rectangular building photo placeholder with gold border frame
RIGHT (55%): 4 dark info cards with gold borders and gold icons:
  Card 1 — 📍 "الموقع:" "${data.city}${data.district ? ` — ${data.district}` : ""}"
  Card 2 — 📐 "المساحة:" "${data.totalArea} م²"
  Card 3 — 🏢 "عدد الوحدات:" "${data.units.length}"
  Card 4 — 📅 "سنة الإنجاز:" "${data.completionYear}"
BELOW: description text in white/light gray: "${data.description}"
FOOTER: "${BRAND.nameAr}" logo | "${BRAND.nameEn}" | page "02"
IMPORTANT: Company name must be EXACTLY "${BRAND.nameAr}" and "${BRAND.nameEn}". Black background, gold accents throughout.`,

    // ص3 — مكونات المشروع
    `Design page 3 of a LUXURY DARK Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Black background, gold icons and borders, dark card panels with subtle gold glow.
PAGE TITLE: "مكونات المشروع" — large gold Arabic, centered, gold ornament.
LAYOUT: 3×3 grid of dark luxury feature cards. Each card: gold line-art icon + gold title + white description.
Cards: مكاتب إدارية | محلات تجارية | مواقف سيارات | بهو فاخر | قاعات اجتماعات | مطعم | أمن 24/7 | صيانة | إنترنت فايبر
Based on amenities: "${data.amenities}"
FOOTER: "موقع استراتيجي .. استثمار ذكي" left | phone "${data.contactPhone}" right
Black luxury design, gold accents, Arabic RTL.`,

    // ص4 — جدول الوحدات
    `Design page 4 of a LUXURY DARK Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Black background, gold table borders, dark row alternation (#1a1a1a / #111), gold "متاحة" badges, dark gray "مؤجرة" badges.
TOP RIGHT: company logo + "${BRAND.nameAr}" | "${BRAND.nameEn}" in gold
PAGE TITLE: "جدول الوحدات المتاحة" — large gold Arabic, centered.
TABLE (RTL):
Headers (gold background, black text): رقم الوحدة | الطابق | المساحة م² | نوع الوحدة | الحالة | الإيجار السنوي ريال
Data rows (dark alternating):
${units}
SUMMARY BAR (gold gradient): إجمالي الوحدات ${data.units.length} | إجمالي المساحة ${totalArea.toLocaleString("ar-SA")} م² | الوحدات المتاحة ${availableCount}
FOOTER: "${BRAND.website}" | "${BRAND.email}" | "${data.contactPhone}" | "${data.city}"
IMPORTANT: All company references must say "${BRAND.nameAr}" / "${BRAND.nameEn}" — no other variations.`,

    // ص5 — الموقع والمزايا
    `Design page 5 of a LUXURY DARK Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Black background, gold accents, dark map panel.
PAGE TITLE: "الموقع والمزايا" — gold Arabic, page number "05" top right in gold.
Subtitle: "موقع استراتيجي في قلب ${data.city} — حيث الهدوء .. والقرب من كل ما يهمك"
LEFT (50%): dark map placeholder showing "${data.city}" with gold pin marker
RIGHT (50%):
  "مزايا الموقع" section: 4 dark cards with gold icons:
    سهولة الوصول | موقع استراتيجي | قريب من كل ما يهمك | بيئة راقية وهادئة
  "أقرب المعالم والمسافات" table: dark rows, gold text
BOTTOM: gold CTA banner: "احجز وحدتك الآن في موقع استثنائي"
Black luxury, gold accents, Arabic RTL.`,

    // ص6 — شروط التأجير
    `Design page 6 of a LUXURY DARK Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Black background, gold borders, dark panels.
TOP LEFT: "${BRAND.nameAr}" | "${BRAND.nameEn}" | "DELMON INVESTMENT CO." in gold — page "06"
PAGE TITLE: "شروط وأحكام التأجير" — large gold Arabic.
TWO COLUMNS:
LEFT (financial summary — gold-bordered dark box):
  قيمة الإيجار السنوي: [amount in large gold]
  الزيادة السنوية: 5%
  موعد سداد الإيجار: بداية كل ربع سنة
  قيمة التأمين: شهرين إيجار
RIGHT (numbered terms — dark cards):
  01 مدة العقد | 02 سداد الإيجار | 03 التأمين | 04 الاستخدام | 05 الصيانة والتعديلات
FOOTER: phone "${data.contactPhone}" | email "${BRAND.email}"
Black luxury design, gold text, Arabic RTL.`,

    // ص7 — الغلاف الخلفي
    `Design the BACK COVER (page 7) of a LUXURY DARK Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: Black background, gold ornamental accents, luxury closing page.
BACKGROUND: dark building photo placeholder with gold glow overlay
CENTER: luxury contact card with gold border frame:
  Gold logo placeholder (circular ornamental frame)
  Large Arabic: "${BRAND.nameAr}"
  English below: "${BRAND.nameEn}"
  Gold ornamental divider
  Contact rows with gold icons:
    📞 ${data.contactPhone}
    ✉️ ${BRAND.email}
    🌐 ${BRAND.website}
    📍 ${data.city}، المملكة العربية السعودية
  Bottom: "نحن هنا لخدمتكم" in gold
IMPORTANT: Company name MUST be EXACTLY "${BRAND.nameAr}" in Arabic and "${BRAND.nameEn}" in English. No "Dehmon", "Demon", "Hemon" or any other variation.
Black luxury, gold accents, Arabic RTL.`,
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAGAZINE TEMPLATE — أبيض/كحلي/ذهبي editorial
// ─────────────────────────────────────────────────────────────────────────────
export function magazinePrompts(data: ProjectData): string[] {
  const units = buildUnitsText(data);
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const availableCount = data.units.filter((_, i) => i % 2 === 0).length;

  return [
    // ص1 — الغلاف الأمامي
    `Design a MAGAZINE-STYLE Arabic RTL real estate brochure COVER PAGE. Portrait A4 (1632x2176px).
STYLE: Editorial magazine — white/off-white background, deep navy (#1a2744) bold typography, gold (#c9a84c) accent lines, modern layout with large photo area.
LAYOUT:
- Top bar: navy band with company name "${BRAND.nameAr}" in white Arabic, "${BRAND.nameEn}" in smaller white English
- Large full-width photo placeholder (60% of page height): building image
- Overlay text on photo: project name "${data.projectName}" in large bold white
- Below photo: editorial-style text block:
  Gold label: "كتيب التأجير"
  Navy subtitle: "${data.projectType} | ${data.city}"
- Bottom: thin gold line + website "${BRAND.website}"
Magazine editorial feel, clean modern typography, Arabic RTL.`,

    // ص2 — نبذة عن المشروع
    `Design page 2 of a MAGAZINE-STYLE Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: White background, navy blue (#1a2744) headings, gold (#c9a84c) accents, editorial layout.
PAGE TITLE: "نبذة عن المشروع" — large navy bold, gold underline bar.
LAYOUT: editorial two-column:
LEFT (45%): large photo placeholder with caption below
RIGHT (55%): 
  Large decorative initial letter (navy)
  Body text: "${data.description}"
  Stats row: 4 numbers in large navy bold:
    ${data.totalArea} م² | ${data.units.length} وحدة | ${data.completionYear} | 87% إشغال
FOOTER: company logo area + "${BRAND.nameAr}" | "${BRAND.nameEn}" | "${data.city}، حي ${data.district || "العليا"}" | "${data.contactPhone}" | "${BRAND.website}"
IMPORTANT: Footer must show "${BRAND.nameAr}" and "${BRAND.nameEn}" — NOT "اسم الشركة" or any placeholder.
Magazine editorial, clean white design, Arabic RTL.`,

    // ص3 — مكونات المشروع
    `Design page 3 of a MAGAZINE-STYLE Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: White background, navy accents, editorial magazine layout.
PAGE TITLE: "مكونات المشروع" — large navy bold, gold accent.
LAYOUT: editorial 3-column feature spread:
  Large feature photo placeholder (top half, full width)
  Below: 3-column text features with navy icons:
    مكاتب إدارية | محلات تجارية | مواقف سيارات
  Second row: 3 more features:
    بهو فاخر | قاعات اجتماعات | مطعم
  Third row: 3 features:
    أمن 24/7 | صيانة | إنترنت فايبر
Based on: "${data.amenities}"
FOOTER: "${BRAND.website}" | "${data.contactPhone}"
Magazine style, white clean design, Arabic RTL.`,

    // ص4 — جدول الوحدات
    `Design page 4 of a MAGAZINE-STYLE Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: White background, navy table headers, clean editorial table design.
TOP LEFT: company logo + "${BRAND.nameAr}" | "${BRAND.nameEn}"
TOP RIGHT: "دليل العقارات | الصفحة 04"
PAGE TITLE: "جدول الوحدات المتاحة" — large navy bold, centered.
Subtitle: "نقدم لكم مجموعة مختارة من الوحدات الإدارية والتجارية في موقع استراتيجي"
TABLE (RTL, clean editorial style):
Headers (navy background, white text): رقم الوحدة | الدور | المساحة م² | نوع الوحدة | الحالة | القيمة الإيجارية السنوية (ريال)
Data rows (alternating white/#f8f9fa):
${units}
STATS ROW (gold/navy): إجمالي الوحدات ${data.units.length} | المتاحة ${availableCount} | نسبة الإشغال 87%
FOOTER: "${data.city} — حي ${data.district || "العليا"} — شارع العليا العام" | "${BRAND.website}" | "${data.contactPhone}"
IMPORTANT: Company name must be "${BRAND.nameAr}" / "${BRAND.nameEn}" — NOT "DEMON" or any wrong spelling.
Magazine editorial, white professional design, Arabic RTL.`,

    // ص5 — الموقع والمزايا
    `Design page 5 of a MAGAZINE-STYLE Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: White background, navy accents, editorial magazine layout.
PAGE TITLE: "الموقع والمزايا" — large navy bold.
LAYOUT: editorial spread:
LEFT (50%): large map placeholder showing "${data.city}" with editorial annotations
RIGHT (50%): 
  "مزايا الموقع" — 4 feature boxes (navy border, gold icon):
    سهولة الوصول | موقع استراتيجي | قريب من كل ما يهمك | بيئة راقية
  "أقرب المعالم" table: clean editorial style
BOTTOM: navy CTA bar: "تواصل معنا الآن — ${data.contactPhone}"
FOOTER: "${BRAND.website}" | "${BRAND.email}"
Magazine editorial, Arabic RTL.`,

    // ص6 — شروط التأجير
    `Design page 6 of a MAGAZINE-STYLE Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: White background, navy/gold accents, editorial clean layout.
TOP: "${BRAND.nameAr}" | "${BRAND.nameEn}" logo area + page "06"
PAGE TITLE: "شروط وأحكام التأجير" — large navy bold.
TWO COLUMNS:
LEFT (financial summary — navy-bordered box):
  قيمة الإيجار السنوي | الزيادة السنوية 5% | موعد السداد | قيمة التأمين
RIGHT (numbered terms):
  01 مدة العقد | 02 سداد الإيجار | 03 التأمين | 04 الاستخدام | 05 الصيانة
FOOTER: "${data.contactPhone}" | "${BRAND.email}"
Magazine editorial, white clean design, Arabic RTL.`,

    // ص7 — الغلاف الخلفي
    `Design the BACK COVER (page 7) of a MAGAZINE-STYLE Arabic RTL real estate brochure. Portrait A4 (1632x2176px).
STYLE: White bottom, navy top with large building photo, editorial closing page.
TOP HALF: navy band with large building photo placeholder, company name overlay in white.
BOTTOM HALF: white background, centered:
  Company logo placeholder (navy square with gold accent)
  Large Arabic: "${BRAND.nameAr}"
  English: "${BRAND.nameEn}"
  Gold divider line
  4 contact items with navy icons:
    اتصل بنا: ${data.contactPhone}
    راسلنا: ${BRAND.email}
    تصفح موقعنا: ${BRAND.website}
    موقعنا: ${data.city}، المملكة العربية السعودية
  Bottom tagline: "${BRAND.tagline}"
IMPORTANT: Company name MUST be "${BRAND.nameAr}" and "${BRAND.nameEn}" — NOT "DEMON" or any wrong variation.
Magazine editorial, clean professional design, Arabic RTL.`,
  ];
}
