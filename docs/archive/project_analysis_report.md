# تقرير التحليل الشامل — منصة بروشور دلمون للتأجير العقاري
**تاريخ التقرير:** 2 أغسطس 2026
**أعدّه:** مساعد المدير المالي — محمد كمال
**المشروع:** delmon-leasing-brochure
**الإصدار الحالي:** v15 (db6586b8)

---

## 1. تعريف المشروع والغرض منه

**منصة بروشور دلمون للتأجير العقاري** هي تطبيق ويب متكامل (Full-Stack Web Application) مصمم خصيصاً لشركة دلمون للاستثمار العقاري، يُمكّن فريق التأجير والمديرين الماليين من إنشاء بروشورات تأجير عقارية احترافية بتنسيق PDF بضغطة زر واحدة، دون الحاجة إلى مصمم جرافيك أو برامج تصميم خارجية.

### الغرض الأساسي
- **توليد بروشورات PDF احترافية** لمشاريع التأجير العقاري (مولات، مكاتب، معارض، فنادق، سكني) بثلاثة قوالب بصرية مختلفة
- **إدارة بيانات المشاريع** وحفظها في قاعدة بيانات مع إمكانية الاسترجاع والتعديل
- **تتبع التحليلات** لمعرفة القوالب الأكثر استخداماً والمشاريع الأكثر تصديراً
- **توليد بروشورات بالذكاء الاصطناعي** (GPT-Image-2) لإنشاء صفحات بصرية مولّدة تلقائياً

### الجمهور المستهدف
- فريق التأجير في دلمون للاستثمار
- المديرون الماليون وأصحاب القرار
- مديرو المشاريع العقارية

---

## 2. البنية التقنية العامة (Architecture)

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (React 19)                  │
│  Vite + Tailwind CSS 4 + shadcn/ui + tRPC Client    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/tRPC over /api/trpc
┌──────────────────────▼──────────────────────────────┐
│                  SERVER (Express 4)                  │
│  tRPC Router + PDF Engine + AI Generation Route     │
└──────────────┬───────────────────┬──────────────────┘
               │                   │
┌──────────────▼──────┐   ┌────────▼──────────────────┐
│  MySQL (TiDB Cloud) │   │  S3 (Manus Storage CDN)   │
│  4 جداول رئيسية    │   │  صور المشاريع + PDF files │
└─────────────────────┘   └───────────────────────────┘
```

**نمط المعمارية:** Monorepo — الـ Frontend والـ Backend في نفس المستودع
**نمط الاتصال:** tRPC (Type-safe RPC) بدلاً من REST API التقليدي
**المصادقة:** Manus OAuth 2.0 مع JWT session cookies
**النشر:** Manus Autoscale (Serverless) — يُنشر تلقائياً عند كل checkpoint

---

## 3. Stack التقني الكامل

### Frontend
| التقنية | الإصدار | الغرض |
|---|---|---|
| React | 19.2.1 | مكتبة الواجهة الأمامية |
| Vite | 7.1.7 | أداة البناء والتطوير |
| TypeScript | 5.9.3 | لغة البرمجة (type-safe) |
| Tailwind CSS | 4.1.14 | نظام التصميم والتنسيق |
| shadcn/ui + Radix UI | متعددة | مكونات الواجهة الجاهزة |
| tRPC Client | 11.6.0 | الاتصال بالـ Backend |
| TanStack Query | 5.90.2 | إدارة حالة البيانات والـ cache |
| Wouter | 3.3.5 | نظام التوجيه (Routing) |
| Framer Motion | 12.23.22 | الحركات والانتقالات |
| React Hook Form + Zod | 7.64 + 4.1 | إدارة النماذج والتحقق |
| Recharts | 2.15.2 | الرسوم البيانية |
| Lucide React | 0.453.0 | الأيقونات |
| next-themes | 0.4.6 | إدارة الثيم (فاتح/داكن) |
| Sonner | 2.0.7 | إشعارات Toast |

### Backend
| التقنية | الإصدار | الغرض |
|---|---|---|
| Node.js | 22.13.0 | بيئة التشغيل |
| Express | 4.21.2 | خادم HTTP |
| tRPC Server | 11.6.0 | Type-safe API procedures |
| Drizzle ORM | 0.44.5 | التعامل مع قاعدة البيانات |
| MySQL2 | 3.15.0 | driver قاعدة البيانات |
| Jose | 6.2.4 | JWT signing/verification |
| Puppeteer Core | 25.4.0 | توليد PDF من HTML |
| jsPDF | 4.2.1 | توليد PDF بديل |
| Zod | 4.1.12 | التحقق من البيانات |
| Superjson | 1.13.3 | تسلسل البيانات (Date, BigInt) |
| AWS SDK S3 | 3.693.0 | رفع الملفات وتخزينها |
| Axios | 1.12.0 | HTTP client |
| tsx | 4.19.1 | تشغيل TypeScript مباشرة |

### قاعدة البيانات
| التقنية | التفاصيل |
|---|---|
| نوع قاعدة البيانات | MySQL (TiDB Cloud — Serverless) |
| ORM | Drizzle ORM (Schema-first) |
| Migration tool | drizzle-kit |

### البنية التحتية
| المكوّن | الخدمة |
|---|---|
| Hosting | Manus Autoscale (Serverless) |
| CDN / File Storage | Manus S3-compatible Storage |
| Authentication | Manus OAuth 2.0 |
| CI/CD | Auto-publish عند كل checkpoint |
| Version Control | GitHub (mohkewan/delmon-leasing-brochure-v2) |

---

## 4. بنية الملفات والمكونات

### الصفحات (Pages)
| الصفحة | المسار | الوظيفة |
|---|---|---|
| `Home.tsx` | `/` | الصفحة الرئيسية — إدخال بيانات المشروع وتوليد PDF |
| `Archive.tsx` | `/archive` | أرشيف البروشورات المحفوظة |
| `AiBrochureGenerator.tsx` | `/ai-generator` | توليد بروشورات بالذكاء الاصطناعي |
| `TemplateMockup.tsx` | `/template-mockup` | معاينة القوالب |
| `NotFound.tsx` | `/*` | صفحة 404 |

### المكونات الرئيسية (Components)
| المكوّن | الوظيفة |
|---|---|
| `ProjectTab.tsx` | تبويب إدخال بيانات المشروع (الاسم، النوع، المدينة، الصورة...) |
| `UnitsTab.tsx` | تبويب إدخال وإدارة الوحدات الشاغرة |
| `ContactTab.tsx` | تبويب بيانات التواصل |
| `TemplateSelector.tsx` | اختيار القالب (Classic/Dark/Magazine) |
| `BrochurePreview.tsx` | معاينة القالب الكلاسيكي |
| `BrochurePreviewDark.tsx` | معاينة القالب الداكن |
| `BrochurePreviewMagazine.tsx` | معاينة قالب المجلة |
| `BrochurePreviewModern.tsx` | معاينة القالب الحديث |
| `DashboardLayout.tsx` | هيكل التخطيط مع الـ sidebar |
| `AIChatBox.tsx` | واجهة الدردشة مع الذكاء الاصطناعي |

### ملفات الخادم (Server)
| الملف | الوظيفة | الحجم |
|---|---|---|
| `server/pdfRoute.ts` | محرك توليد PDF — 3 قوالب × 6 صفحات | 1,772 سطر |
| `server/routers.ts` | جميع tRPC procedures | 94 سطر |
| `server/db.ts` | query helpers لقاعدة البيانات | 202 سطر |
| `server/aiGenerationRoute.ts` | توليد صفحات بـ GPT-Image-2 | — |
| `server/brochurePrompts.ts` | prompts الذكاء الاصطناعي للقوالب الثلاثة | — |
| `server/storage.ts` | helpers لرفع الملفات إلى S3 | — |
| `server/index.ts` | نقطة دخول الخادم | — |

---

## 5. قاعدة البيانات — الجداول الأربعة

### جدول `users`
| الحقل | النوع | الوصف |
|---|---|---|
| id | INT PK | معرف فريد |
| openId | VARCHAR(64) | معرف Manus OAuth |
| name | TEXT | اسم المستخدم |
| email | VARCHAR(320) | البريد الإلكتروني |
| role | ENUM(user/admin) | صلاحية المستخدم |
| createdAt / updatedAt | TIMESTAMP | توقيت الإنشاء والتحديث |

### جدول `brochures`
| الحقل | النوع | الوصف |
|---|---|---|
| id | INT PK | معرف فريد |
| userId | INT FK | مرتبط بالمستخدم |
| projectName | VARCHAR(255) | اسم المشروع |
| projectType | VARCHAR(100) | نوع المشروع |
| city | VARCHAR(100) | المدينة |
| data | JSON | كامل بيانات ProjectData |
| createdAt / updatedAt | TIMESTAMP | توقيت الإنشاء والتحديث |

### جدول `brochureJobs`
| الحقل | النوع | الوصف |
|---|---|---|
| id | INT PK | معرف فريد |
| userId | INT FK | مرتبط بالمستخدم |
| status | ENUM(pending/processing/done/error) | حالة مهمة التوليد |
| projectData | JSON | بيانات المشروع |
| projectImageUrl | TEXT | رابط صورة المشروع في S3 |
| pdfUrls | JSON | روابط PDF المولّدة (classic/dark/magazine) |
| pageUrls | JSON | روابط صفحات AI المولّدة |
| completedPages / totalPages | INT | تتبع التقدم (من 21 صفحة) |

### جدول `analytics`
| الحقل | النوع | الوصف |
|---|---|---|
| id | INT PK | معرف فريد |
| userId | INT | المستخدم (nullable) |
| eventType | VARCHAR(64) | نوع الحدث (pdf_export, json_export...) |
| template | VARCHAR(32) | القالب المستخدم |
| projectName / projectType / city | VARCHAR | بيانات المشروع |
| unitsCount | INT | عدد الوحدات |

---

## 6. API والـ Procedures

### tRPC Procedures (server/routers.ts)
| الـ Procedure | النوع | الوظيفة |
|---|---|---|
| `auth.me` | publicProcedure.query | جلب بيانات المستخدم الحالي |
| `auth.logout` | publicProcedure.mutation | تسجيل الخروج |
| `brochure.save` | protectedProcedure.mutation | حفظ بروشور في قاعدة البيانات |
| `brochure.list` | protectedProcedure.query | جلب قائمة البروشورات المحفوظة |
| `brochure.get` | protectedProcedure.query | جلب بروشور محدد |
| `brochure.delete` | protectedProcedure.mutation | حذف بروشور |
| `brochure.update` | protectedProcedure.mutation | تحديث بروشور |
| `analytics.summary` | protectedProcedure.query | ملخص التحليلات |

### REST Endpoints (server/pdfRoute.ts)
| الـ Endpoint | الطريقة | الوظيفة |
|---|---|---|
| `/api/generate-pdf` | POST | توليد PDF من بيانات المشروع |
| `/api/health` | GET | فحص حالة الخادم |

---

## 7. محرك PDF — القوالب الثلاثة

المحرك مبني بالكامل على **HTML/CSS → Puppeteer → PDF** ويولّد حالياً **6 صفحات** لكل قالب:

| الصفحة | المحتوى |
|---|---|
| 1 | الغلاف الرئيسي — صورة كاملة + KPIs + مرافق المشروع |
| 2 | تفاصيل المشروع + شروط التأجير + مزايا دلمون |
| 3 | جدول الوحدات الشاغرة + KPI bar |
| 4 | هوية دلمون — شبكة مشاريع + بيانات التواصل |
| 5 | ملخص المشروع مع الصورة |
| 6 | رؤية المشروع بخلفية كاملة |

### القوالب الثلاثة
| القالب | الهوية البصرية |
|---|---|
| Classic | أبيض + ذهبي + كحلي — راقٍ وتقليدي |
| Dark Luxury | داكن + ذهبي + أبيض — فاخر وعصري |
| Magazine | أبيض + رمادي + لمسات ملونة — أسلوب المجلة |

---

## 8. ميزة الذكاء الاصطناعي

المنصة تدعم **توليد بروشورات بالذكاء الاصطناعي** عبر:
- **النموذج:** GPT-Image-2 (OpenAI)
- **العملية:** توليد 7 صفحات × 3 قوالب = 21 صورة لكل مشروع
- **التخزين:** الصفحات المولّدة تُرفع إلى S3 وتُجمَّع في PDF
- **التتبع:** جدول `brochureJobs` يتتبع حالة كل مهمة توليد
- **الـ Prompts:** مخصصة لكل صفحة وقالب مع هوية دلمون مضمّنة

---

## 9. نموذج البيانات — ProjectData

```typescript
interface ProjectData {
  projectName: string;        // اسم المشروع
  projectType: string;        // نوع المشروع (مول/مكاتب/معارض...)
  city: string;               // المدينة
  district: string;           // الحي
  totalArea: number;          // المساحة الإجمالية (م²)
  floors: number;             // عدد الطوابق
  yearBuilt: number;          // سنة الإنشاء
  occupancyRate: number;      // نسبة الإشغال (%)
  annualRentPerSqm: number;   // الإيجار السنوي لكل م²
  amenities: string[];        // المرافق والخدمات
  description: string;        // وصف المشروع
  imageUrl: string;           // رابط صورة المشروع
  units: Unit[];              // قائمة الوحدات الشاغرة
  contactPhone: string;       // هاتف التواصل
  contactEmail: string;       // البريد الإلكتروني
  contactWebsite: string;     // الموقع الإلكتروني
  leaseTerm: string;          // مدة العقد
  paymentFrequency: string;   // دورية الدفع
  guaranteeType: string;      // نوع الضمان
}

interface Unit {
  unitNumber: string;   // رقم الوحدة
  type: UnitType;       // نوع الوحدة
  floor: string;        // الطابق
  area: number;         // المساحة (م²)
  monthlyRent: number;  // الإيجار الشهري (ر.س)
  status: string;       // الحالة (شاغرة/محجوزة)
}
```

---

## 10. الحالة الراهنة والمهام المكتملة

### ما تم إنجازه (v15)
- ✅ محرك PDF كامل بـ 6 صفحات × 3 قوالب
- ✅ واجهة إدخال بيانات متكاملة (3 تبويبات)
- ✅ رفع صور المشاريع إلى S3
- ✅ حفظ البروشورات في قاعدة البيانات
- ✅ أرشيف البروشورات المحفوظة
- ✅ تحليلات الاستخدام
- ✅ توليد بروشورات بالذكاء الاصطناعي (GPT-Image-2)
- ✅ إصلاح تنسيق الأرقام (en-US بدلاً من ar-SA)
- ✅ إصلاح عرض الوحدات في PDF
- ✅ Refactor Home.tsx إلى مكونات منفصلة

### المرحلة القادمة (المخطط لها)
- ⬜ تحديث البروشور إلى 10 صفحات
- ⬜ إضافة صفحة موقع المشروع ومزاياه
- ⬜ إضافة صفحة عملاء المشروع
- ⬜ إضافة صفحة الفرص الاستثمارية
- ⬜ رفع صور المشاريع المحسّنة من Gemini
- ⬜ إعادة توليد mockups بالهوية الفعلية لدلمون

---

## 11. الروابط والمعلومات التقنية

| المعلومة | القيمة |
|---|---|
| رابط المنصة | https://delmonbroch-j5bkujfh.manus.space |
| GitHub | https://github.com/mohkewan/delmon-leasing-brochure-v2 |
| آخر checkpoint | db6586b8 (v15) |
| حجم المشروع | 6.3 MB (بدون node_modules) |
| إجمالي أسطر الكود | ~3,000+ سطر (الملفات الرئيسية) |
| قاعدة البيانات | MySQL / TiDB Cloud Serverless |
| التخزين | Manus S3-compatible CDN |
| النشر | Manus Autoscale (Auto-publish) |
