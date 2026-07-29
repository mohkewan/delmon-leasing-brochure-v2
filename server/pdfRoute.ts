import type { Request, Response } from "express";
import puppeteer from "puppeteer-core";

// ── Types (matching Home.tsx exactly) ────────────────────────────────────────
interface Unit {
  id: string;
  unitNumber: string;
  floor: string;
  area: string;
  unitType: string;
  description: string;
  features: string;
  pricePerMeter?: string;
  monthlyRent?: string;
  contractDuration?: string;
}

interface ProjectData {
  projectName: string;
  projectType: string;
  city: string;
  district: string;
  totalArea: string;
  floors: string;
  completionYear: string;
  description: string;
  amenities: string;        // comma-separated string
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  projectImage?: string;    // base64 data URL or URL
  units: Unit[];
}

// ── HTML builder ──────────────────────────────────────────────────────────────
function buildBrochureHTML(data: ProjectData, template: string): string {
  const GOLD = "#C9A84C";
  const DARK_BG = "#1A1F2E";
  const DARK_PANEL = "#242938";

  const amenitiesList = data.amenities
    ? data.amenities.split(/[,،\n]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const imgSrc = data.projectImage ?? "";

  // KPIs
  const kpis = [
    { v: data.totalArea ? `${Number(data.totalArea).toLocaleString("ar-SA")}` : "—", l: "المساحة م²" },
    { v: data.floors || "—", l: "الطوابق" },
    { v: data.units?.length ? String(data.units.length) : "—", l: "الوحدات" },
    { v: data.completionYear || "—", l: "الإنجاز" },
  ];

  const unitsRows = (data.units ?? []).map((u: Unit, i: number) => `
    <tr style="background:${i % 2 === 0 ? "#F9F8F5" : "#fff"}">
      <td style="padding:6px 8px;text-align:center;font-size:10px">${i + 1}</td>
      <td style="padding:6px 8px;text-align:center;font-size:10px">${u.unitNumber || "—"}</td>
      <td style="padding:6px 8px;text-align:center;font-size:10px">${u.floor || "—"}</td>
      <td style="padding:6px 8px;text-align:center;font-size:10px">${u.unitType || "—"}</td>
      <td style="padding:6px 8px;text-align:center;font-size:10px">${u.area || "—"}</td>
      <td style="padding:6px 8px;text-align:center;font-size:10px">${u.monthlyRent ? Number(u.monthlyRent).toLocaleString("ar-SA") : "—"}</td>
    </tr>
  `).join("");

  const imgBlock = imgSrc
    ? `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover">`
    : `<div style="width:100%;height:100%;background:#e8e7e3;display:flex;align-items:center;justify-content:center;font-size:48px">🏢</div>`;

  const imgBlockDark = imgSrc
    ? `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;filter:brightness(0.85)">`
    : `<div style="width:100%;height:100%;background:${DARK_PANEL};display:flex;align-items:center;justify-content:center;font-size:48px">🏢</div>`;

  const footer = (page: string, bg: string, textColor: string, terms: string) => `
    <div style="height:26px;background:${bg};display:flex;align-items:center;justify-content:space-between;padding:0 30px;flex-shrink:0">
      <span style="color:${textColor};font-size:8px;font-weight:600">${page}</span>
      <div style="display:flex;gap:12px">${terms}</div>
      <span style="color:${textColor === "#fff" ? "rgba(255,255,255,0.7)" : "#888"};font-size:8px">delmoninvest.com | 011-2080129</span>
    </div>`;

  const termsItems = `
    <span style="color:rgba(255,255,255,0.9);font-size:8px">✓ عقد 5 سنوات</span>
    <span style="color:rgba(255,255,255,0.9);font-size:8px">✓ دفع ربع سنوي</span>
    <span style="color:rgba(255,255,255,0.9);font-size:8px">✓ ضمان بنكي</span>
    <span style="color:rgba(255,255,255,0.9);font-size:8px">✓ لا معسلات</span>`;

  // ── Page 1 ────────────────────────────────────────────────────────────────
  const classicP1 = `
  <div class="page">
    <div class="header">
      <div style="font-size:13px;font-weight:900;color:${GOLD}">شركة دلمون للاستثمار</div>
      <div style="font-size:9px;color:#aaa">${data.projectName} | بروشور التأجير</div>
    </div>
    <div style="flex:1;display:flex;overflow:hidden">
      <div style="width:420px;flex-shrink:0;overflow:hidden;position:relative">
        ${imgBlock}
        <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));padding:20px 16px 12px">
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            ${amenitiesList.map((a: string) => `<span style="background:rgba(201,168,76,0.85);color:#fff;font-size:8px;padding:2px 6px;border-radius:3px">${a}</span>`).join("")}
          </div>
        </div>
      </div>
      <div style="flex:1;padding:24px 28px;display:flex;flex-direction:column;gap:14px;overflow:hidden">
        <div style="text-align:right">
          <div style="display:inline-block;background:${GOLD};color:#fff;font-size:9px;font-weight:700;padding:3px 10px;border-radius:2px;margin-bottom:10px">◆ وحدات شاغرة للتأجير</div>
          <h1 style="font-size:38px;font-weight:900;color:#2d2d2d;line-height:1;margin:0 0 6px">${data.projectName}</h1>
          <div style="font-size:13px;font-weight:700;color:${GOLD};margin-bottom:4px">${data.projectType}</div>
          <div style="font-size:11px;color:#666">📍 ${data.city} — ${data.district}</div>
        </div>
        <div style="background:#F5F5F3;border-radius:6px;padding:10px 14px;border-right:3px solid ${GOLD};font-size:10px;color:#555;line-height:1.6;text-align:right">${data.description}</div>
        <div style="display:flex;gap:6px">
          ${kpis.map((k: {v: string, l: string}) => `<div style="flex:1;background:#F5F5F3;border-radius:4px;padding:8px 4px;text-align:center;border-right:4px solid ${GOLD}"><div style="font-size:13px;font-weight:900;color:${GOLD};line-height:1">${k.v}</div><div style="font-size:8px;color:#888;margin-top:2px">${k.l}</div></div>`).join("")}
        </div>
      </div>
    </div>
    ${footer("01 / 04", GOLD, "#fff", termsItems)}
  </div>`;

  const darkP1 = `
  <div class="page" style="background:${DARK_BG}">
    <div class="header" style="background:${DARK_PANEL};border-bottom:1px solid rgba(201,168,76,0.3)">
      <div style="font-size:13px;font-weight:900;color:${GOLD}">شركة دلمون للاستثمار</div>
      <div style="font-size:9px;color:#888">${data.projectName} | بروشور التأجير</div>
    </div>
    <div style="flex:1;display:flex;overflow:hidden">
      <div style="width:420px;flex-shrink:0;overflow:hidden;position:relative">
        ${imgBlockDark}
      </div>
      <div style="flex:1;padding:24px 28px;display:flex;flex-direction:column;gap:14px;overflow:hidden">
        <div style="text-align:right">
          <div style="display:inline-block;background:${GOLD};color:#fff;font-size:9px;font-weight:700;padding:3px 10px;border-radius:2px;margin-bottom:10px">◆ وحدات شاغرة للتأجير</div>
          <h1 style="font-size:38px;font-weight:900;color:#fff;line-height:1;margin:0 0 6px">${data.projectName}</h1>
          <div style="font-size:13px;font-weight:700;color:${GOLD};margin-bottom:4px">${data.projectType}</div>
          <div style="font-size:11px;color:#aaa">📍 ${data.city} — ${data.district}</div>
        </div>
        <div style="background:${DARK_PANEL};border-radius:6px;padding:10px 14px;border-right:3px solid ${GOLD};font-size:10px;color:#ccc;line-height:1.6;text-align:right">${data.description}</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${amenitiesList.map((a: string) => `<span style="background:rgba(201,168,76,0.2);border:1px solid rgba(201,168,76,0.4);color:${GOLD};font-size:9px;padding:3px 8px;border-radius:3px">${a}</span>`).join("")}
        </div>
        <div style="display:flex;gap:6px">
          ${kpis.map((k: {v: string, l: string}) => `<div style="flex:1;background:${DARK_PANEL};border-radius:4px;padding:8px 4px;text-align:center;border:1px solid rgba(201,168,76,0.3)"><div style="font-size:13px;font-weight:900;color:${GOLD};line-height:1">${k.v}</div><div style="font-size:8px;color:#888;margin-top:2px">${k.l}</div></div>`).join("")}
        </div>
      </div>
    </div>
    ${footer("01 / 04", DARK_PANEL, GOLD, termsItems.replace(/rgba\(255,255,255,0.9\)/g, "#aaa"))}
  </div>`;

  const magazineP1 = `
  <div class="page" style="background:#f0efe9">
    <div class="header" style="background:#fff;border-bottom:2px solid ${GOLD}">
      <div style="font-size:13px;font-weight:900;color:#2d2d2d">شركة دلمون للاستثمار</div>
      <div style="font-size:8px;color:#aaa;letter-spacing:1px">LEASING BROCHURE | بروشور التأجير</div>
    </div>
    <div style="flex:1;display:flex;overflow:hidden">
      <div style="width:420px;flex-shrink:0;overflow:hidden;position:relative">
        ${imgBlock}
      </div>
      <div style="flex:1;padding:24px 28px;display:flex;flex-direction:column;gap:12px;overflow:hidden">
        <div style="text-align:right">
          <div style="font-size:9px;color:#999;letter-spacing:2px;margin-bottom:6px">LEASING BROCHURE</div>
          <h1 style="font-size:38px;font-weight:900;color:#2d2d2d;line-height:1;margin:0 0 6px">${data.projectName}</h1>
          <div style="font-size:13px;font-weight:700;color:${GOLD};margin-bottom:4px">${data.projectType}</div>
          <div style="font-size:11px;color:#666">📍 ${data.city} — ${data.district}</div>
          <div style="font-size:10px;color:#555;margin-top:8px;line-height:1.6">${data.description}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:800;color:#2d2d2d;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-direction:row-reverse"><span>أبرز المرافق</span><div style="flex:1;height:2px;background:#ddd"></div></div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${amenitiesList.map((a: string) => `<span style="background:#fff;border:1px solid #ddd;color:#555;font-size:9px;padding:3px 8px;border-radius:3px">${a}</span>`).join("")}
          </div>
        </div>
        <div style="display:flex;gap:6px">
          ${kpis.map((k: {v: string, l: string}) => `<div style="flex:1;background:#fff;border-radius:4px;padding:8px 4px;text-align:center;border-right:4px solid ${GOLD}"><div style="font-size:13px;font-weight:900;color:${GOLD};line-height:1">${k.v}</div><div style="font-size:8px;color:#888;margin-top:2px">${k.l}</div></div>`).join("")}
        </div>
      </div>
    </div>
    ${footer("01 / 04", GOLD, "#fff", termsItems)}
  </div>`;

  // ── Page 2 — Project Details ──────────────────────────────────────────────
  const page2BgStyle = template === "dark" ? `style="background:${DARK_BG}"` : "";
  const page2CardStyle = template === "dark"
    ? `background:${DARK_PANEL};border-top:3px solid ${GOLD};color:#e0e0e0`
    : `background:#F5F5F3;border-top:3px solid ${GOLD};color:#2d2d2d`;
  const page2LabelStyle = template === "dark" ? "color:#888" : "color:#888";
  const page2HeaderStyle = template === "dark"
    ? `background:${DARK_PANEL};border-bottom:1px solid rgba(201,168,76,0.3)`
    : "";
  const page2TitleColor = template === "dark" ? "#e0e0e0" : "#2d2d2d";

  const page2 = `
  <div class="page" ${page2BgStyle}>
    <div class="header" style="${page2HeaderStyle}">
      <div style="font-size:12px;font-weight:800;color:${page2TitleColor}">بيانات المشروع التفصيلية</div>
      <div style="font-size:9px;color:#aaa">${data.projectName} | بروشور التأجير</div>
    </div>
    <div style="flex:1;padding:20px 30px;display:grid;grid-template-columns:1fr 1fr;gap:12px;overflow:hidden">
      ${[
        ["اسم المشروع", data.projectName],
        ["نوع المشروع", data.projectType],
        ["المدينة", data.city],
        ["الحي / الموقع", data.district],
        ["إجمالي المساحة", data.totalArea ? `${Number(data.totalArea).toLocaleString("ar-SA")} م²` : "—"],
        ["عدد الطوابق", data.floors],
        ["سنة الإنجاز", data.completionYear],
        ["الوحدات الشاغرة", data.units?.length ? `${data.units.length} وحدة` : "—"],
      ].map(([l, v]) => `<div style="border-radius:8px;padding:10px 14px;${page2CardStyle}"><div style="font-size:9px;${page2LabelStyle};margin-bottom:3px">${l}</div><div style="font-weight:800;font-size:12px">${v || "—"}</div></div>`).join("")}
    </div>
    ${footer("02 / 04", GOLD, "#fff", "")}
  </div>`;

  // ── Page 3 — Units table ──────────────────────────────────────────────────
  const page3BgStyle = template === "dark" ? `style="background:${DARK_BG}"` : "";
  const page3HeaderStyle = template === "dark"
    ? `background:${DARK_PANEL};border-bottom:1px solid rgba(201,168,76,0.3)`
    : "";
  const page3TitleColor = template === "dark" ? "#e0e0e0" : "#2d2d2d";

  const page3 = `
  <div class="page" ${page3BgStyle}>
    <div class="header" style="${page3HeaderStyle}">
      <div style="font-size:12px;font-weight:800;color:${page3TitleColor}">الوحدات الشاغرة</div>
      <div style="font-size:9px;color:#aaa">${data.projectName} | بروشور التأجير</div>
    </div>
    <div style="flex:1;padding:16px 30px;overflow:hidden">
      <table style="width:100%;border-collapse:collapse;font-family:Cairo,sans-serif">
        <thead>
          <tr style="background:${GOLD}">
            ${["#","رقم الوحدة","الطابق","النوع","المساحة م²","الإيجار الشهري ر.س"].map((h: string) => `<th style="color:#fff;padding:8px 6px;text-align:center;font-size:10px;font-weight:700">${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>${unitsRows || `<tr><td colspan="6" style="text-align:center;padding:20px;color:#aaa;font-size:11px">لا توجد وحدات مضافة</td></tr>`}</tbody>
      </table>
    </div>
    ${footer("03 / 04", GOLD, "#fff", "")}
  </div>`;

  // ── Page 4 — Contact ──────────────────────────────────────────────────────
  const page4 = `
  <div class="page" style="background:${GOLD}">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:30px">
      <div style="font-size:28px;font-weight:900;color:#fff;text-align:center">${data.projectName}</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.85);text-align:center">${data.city} — ${data.district}</div>
      <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:20px 40px;text-align:center">
        <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:6px">للتواصل والاستفسار</div>
        <div style="font-size:18px;font-weight:900;color:#fff">${data.contactPhone || "011-2080129"}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px">${data.contactEmail || "delmoninvest.com"}</div>
      </div>
    </div>
  </div>`;

  // Select page 1 based on template
  const p1 = template === "dark" ? darkP1 : template === "magazine" ? magazineP1 : classicP1;

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
@page { size: 297mm 210mm landscape; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Cairo', sans-serif; direction: rtl; }
.page {
  width: 297mm;
  height: 210mm;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  page-break-after: always;
}
.header {
  height: 52px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E0DDD0;
  flex-shrink: 0;
  background: #fff;
}
</style>
</head>
<body>
${p1}
${page2}
${page3}
${page4}
</body>
</html>`;
}

// ── Express route handler ─────────────────────────────────────────────────────
export async function pdfRouteHandler(req: Request, res: Response) {
  try {
    const { data, template = "classic" } = req.body as {
      data: ProjectData;
      template: string;
    };

    if (!data) {
      res.status(400).json({ error: "Missing data" });
      return;
    }

    const html = buildBrochureHTML(data, template);

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: ["load", "domcontentloaded"],
      timeout: 30000,
    });

    // Wait for Google Fonts to load
    await page.evaluate(() => (document as any).fonts.ready);
    await new Promise((r) => setTimeout(r, 1500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    const projectName = data.projectName || "بروشور-دلمون";
    const city = data.city ? `-${data.city}` : "";
    const date = new Date().toISOString().split("T")[0];
    const filename = encodeURIComponent(`بروشور-دلمون-${projectName}${city}-${date}.pdf`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${filename}`);
    const buf = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    res.setHeader("Content-Length", buf.length);
    res.end(buf);
  } catch (err) {
    console.error("[PDF Route Error]", err);
    res.status(500).json({ error: "فشل توليد PDF", details: String(err) });
  }
}
