# دليل إعداد المشروع — نظام بروشور التأجير
## دلمون للاستثمار

---

## المتطلبات الأساسية

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- قاعدة بيانات MySQL 8+ أو TiDB

---

## خطوات التثبيت

```bash
# 1. استنساخ المستودع
git clone https://github.com/mohkewan/delmon-leasing-brochure-v2.git
cd delmon-leasing-brochure-v2

# 2. تثبيت الحزم
pnpm install

# 3. إنشاء ملف البيئة
cp .env.template .env
# ثم عدّل .env بالقيم الفعلية (انظر القسم أدناه)

# 4. إنشاء جداول قاعدة البيانات تلقائياً
pnpm db:push

# 5. تشغيل بيئة التطوير
pnpm dev
```

---

## متغيرات البيئة المطلوبة

أنشئ ملف `.env` في جذر المشروع بالمتغيرات التالية:

### قاعدة البيانات (إلزامي)
```
DATABASE_URL=mysql://user:password@host:3306/delmon_brochure
```

### الأمان (إلزامي)
```
JWT_SECRET=any_random_secret_string_min_32_chars
```
يمكن توليده بـ: `openssl rand -base64 32`

### تسجيل الدخول — Manus OAuth (إلزامي)
```
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.ai
VITE_OAUTH_PORTAL_URL=https://manus.im
```
> للحصول على VITE_APP_ID: تواصل مع فريق Manus أو استخدم نظام OAuth مختلف

### Manus Forge API — لتوليد PDF (إلزامي للـ PDF)
```
BUILT_IN_FORGE_API_URL=https://api.manus.ai
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.ai
```
> ملاحظة: إذا أردت الاستغناء عن Manus Forge، يمكن تعديل `server/pdfRoute.ts`
> لاستخدام Puppeteer مباشرة مع Chromium مثبت على السيرفر.

### معلومات المالك (اختياري)
```
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=دلمون للاستثمار
```

### إعدادات التطبيق
```
VITE_APP_TITLE=دلمون للاستثمار - نظام بروشور التأجير
NODE_ENV=production
```

### Gamma API (اختياري)
```
GAMMA_API_KEY=your_gamma_api_key
```
احصل عليه من: gamma.app → Settings → API

---

## بناء للإنتاج

```bash
pnpm build
node dist/index.js
```

---

## هيكل قاعدة البيانات

يتم إنشاء الجداول تلقائياً عند تشغيل `pnpm db:push`:

| الجدول | الوصف |
|--------|-------|
| `users` | المستخدمون المسجلون |
| `brochures` | مشاريع البروشور المحفوظة |
| `project_units` | وحدات كل مشروع |
| `saved_brochures` | الأرشيف |

---

## ملاحظة مهمة حول Puppeteer (PDF)

توليد PDF يعتمد على Puppeteer + Chromium. عند النشر على سيرفر Linux:

```bash
# تثبيت المتطلبات
apt-get install -y chromium-browser fonts-noto-color-emoji

# أو استخدام Docker (انظر Dockerfile في المشروع)
```

---

## الدعم

للاستفسارات التقنية: info@delmoninvest.com
