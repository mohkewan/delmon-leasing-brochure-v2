import type { ProjectData } from "@/pages/Home";
import { formatNumber } from "@/lib/formatNumber";

// SVG أيقونات خطية موحدة بلون الهوية — تحل محل إيموجي نظام التشغيل
const SvgPin = ({ color, size = 14 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const SvgBuilding = ({ color, size = 56 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1"/>
    <path d="M10 21v-4h4v4"/>
  </svg>
);
const SvgCheck = ({ color, size = 12 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ===== DELMON INVESTMENT — LEASING BROCHURE PREVIEW =====
// Official Brand Identity from DELMON1PPTtemplatev1.pptx
// Olive: #949437 | Blue accent: #94B6D2 | Charcoal: #262626
// Layout: A4 LANDSCAPE 1123×794px — matches reference brochure format
// NO dark navy — light background system throughout
// RTL, print-ready

interface Props {
  data: ProjectData;
}

const LOGO = "/manus-storage/delmon_logo_19a2386c.png";
const GOLD = "#949437";
const GOLD_80 = "#b8b55a";
const GOLD_40 = "#d4d2a0";
const CYAN = "#94B6D2";
const CYAN_40 = "#DDEBF5";
const DARK_TEXT = "#262626";
const MID_TEXT = "#5a5a5a";
const LIGHT_TEXT = "#8a8a8a";
const BG_PAGE = "#FFFFFF";
const BG_SECTION = "#F7F7F4";
const BG_ACCENT = "#EEF0DC";
const BORDER_LIGHT = "#E2E5E3";
const BORDER_GOLD = "#C7CB99";

// Page dimensions — A4 Landscape
const W = 1123;
const H = 794;

export default function BrochurePreview({ data }: Props) {
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const projectLocation = [data.district, data.city].filter(Boolean).join(" — ");
  const marketingHighlights = [
    data.city ? `موقع في ${data.city}` : "",
    data.district ? `ضمن ${data.district}` : "",
    data.units.length > 1 ? `${data.units.length} فرص تأجير متاحة` : "",
    ...data.amenities.split(/[,،]/).map((item) => item.trim()).filter(Boolean),
  ].filter(Boolean).slice(0, 6);
  const today = new Date().toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      id="brochure-content"
      dir="rtl"
      style={{ fontFamily: "'Cocon Next Arabic','Cairo','Noto Kufi Arabic',sans-serif", background: BG_PAGE, width: W }}
    >

      {/* ══════════════════════════════════════════════
          PAGE 1 — COVER (Landscape split: right=text, left=image)
      ══════════════════════════════════════════════ */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", pageBreakAfter: "always" }}>
        <div style={{ height: 4, background: GOLD, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER_GOLD}`, background: BG_PAGE, flexShrink: 0 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 46, objectFit: "contain" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: GOLD, fontSize: 13, fontWeight: 900, letterSpacing: 0.5 }}>شركة دلمون للاستثمار</div>
            <div style={{ color: LIGHT_TEXT, fontSize: 10, letterSpacing: 1.5 }}>DELMON INVESTMENT COMPANY</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: LIGHT_TEXT, fontSize: 10 }}>www.delmoninvest.com</div>
            <div style={{ color: LIGHT_TEXT, fontSize: 10 }}>011-2080129</div>
          </div>
        </div>
        <div style={{ height: 2, background: CYAN, flexShrink: 0 }} />

        {/* Main body — two columns */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* RIGHT column — text content */}
          <div style={{ width: 480, padding: "28px 40px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: BG_ACCENT, color: GOLD, padding: "4px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800, border: `1px solid ${BORDER_GOLD}`, marginBottom: 14 }}>
                ● وحدات شاغرة للتأجير
              </div>

              <h1 style={{ color: DARK_TEXT, fontSize: 38, fontWeight: 900, lineHeight: 1.3, margin: "0 0 6px" }}>
                {data.projectName || "اسم المشروع"}
              </h1>

              {data.projectType && (
                <div style={{ color: GOLD, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{data.projectType}</div>
              )}

              {(data.city || data.district) && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: MID_TEXT, fontSize: 13, marginBottom: 20 }}>
                  <SvgPin color={CYAN} size={14} />
                  {projectLocation}
              </div>
              )}

              {/* Stats cards */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                {[
                  { v: String(data.units.length), l: "وحدة شاغرة", primary: true },
                  { v: `${formatNumber(totalArea)} م²`, l: "إجمالي مساحة الوحدات الشاغرة", primary: false },
                  ...(data.floors ? [{ v: data.floors, l: "طابق", primary: false }] : []),
                  ...(data.completionYear ? [{ v: data.completionYear, l: "سنة الإنجاز", primary: false }] : []),
                ].map((s, i) => (
                  <div key={i} style={{ background: s.primary ? GOLD : BG_ACCENT, border: `1px solid ${s.primary ? GOLD : BORDER_GOLD}`, borderRadius: 10, padding: "10px 18px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ color: s.primary ? "#fff" : GOLD, fontSize: 20, fontWeight: 900 }}>{s.v}</div>
                    <div style={{ color: s.primary ? "rgba(255,255,255,0.85)" : MID_TEXT, fontSize: 10, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              {data.amenities && (
              <div style={{ padding: "12px 16px", background: BG_SECTION, borderRadius: 8, border: `1px solid ${BORDER_LIGHT}`, borderRight: `4px solid ${CYAN}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.amenities.split(/[,،]/).slice(0, 5).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: DARK_TEXT, fontSize: 11, fontWeight: 600 }}>
                      <SvgCheck color={GOLD} size={11} />
                      {item.trim()}
                    </div>
                  ))}
              </div>
              )}
            </div>

            {marketingHighlights.length > 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 12 }}>
                <div style={{ color: GOLD, fontSize: 11, fontWeight: 800, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${BORDER_GOLD}` }}>أبرز عناصر الفرصة</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {marketingHighlights.map((text, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, background: BG_SECTION, borderRadius: 0, padding: "7px 10px", border: `1px solid ${BORDER_LIGHT}`, borderRight: `3px solid ${i % 2 === 0 ? GOLD : CYAN}` }}>
                      <SvgCheck color={i % 2 === 0 ? GOLD : CYAN} size={11} />
                      <span style={{ color: DARK_TEXT, fontSize: 10, fontWeight: 600 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Bottom call to action */}
            <div style={{ padding: "14px 0 0", borderTop: `1px solid ${BORDER_GOLD}` }}>
              <div style={{ color: GOLD, fontSize: 12, fontWeight: 800 }}>احجز معاينتك الآن</div>
              <div style={{ color: LIGHT_TEXT, fontSize: 10, marginTop: 3 }}>تواصل مع فريق التأجير للحصول على التفاصيل المتاحة</div>
            </div>
          </div>

          {/* LEFT column — project image */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: data.projectImage ? "transparent" : BG_SECTION, borderRight: `3px solid ${GOLD}` }}>
            {data.projectImage ? (
              <>
                <img src={data.projectImage} alt={data.projectName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.15) 0%, transparent 40%)" }} />
                {/* Project name overlay */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>{data.projectName}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{data.city}</div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                <SvgBuilding color={GOLD_40} size={64} />
                <div style={{ color: MID_TEXT, fontWeight: 700, fontSize: 14 }}>صورة المشروع</div>
                <div style={{ color: LIGHT_TEXT, fontSize: 11 }}>أضف صورة من نموذج الإدخال</div>
              </div>
            )}
          </div>
        </div>

        {/* Cyan + Gold bottom bars */}
        <div style={{ height: 3, background: CYAN, flexShrink: 0 }} />
        <div style={{ height: 6, background: GOLD, flexShrink: 0 }} />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 2 — PROJECT DETAILS (Landscape two-column)
      ══════════════════════════════════════════════ */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", pageBreakAfter: "always", position: "relative" }}>
        <PageHeader name={data.projectName} />

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* RIGHT column */}
          <div style={{ width: 520, padding: "20px 40px", borderLeft: `1px solid ${BORDER_LIGHT}`, overflowY: "hidden", display: "flex", flexDirection: "column", alignSelf: "stretch" }}>
            <SectionTitle title="نبذة عن المشروع" />
            <div style={{ background: BG_SECTION, borderRadius: 8, padding: "14px 18px", borderRight: `5px solid ${GOLD}`, color: DARK_TEXT, fontSize: 13, lineHeight: 2.0, marginBottom: 20 }}>
              {data.description || "يرجى إضافة وصف للمشروع من نموذج الإدخال"}
            </div>

            <SectionTitle title="المرافق والخدمات" />
            {data.amenities ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1, alignContent: "flex-start" }}>
                {data.amenities.split(/[,،]/).map((item, i) => (
                  <span key={i} style={{ background: i % 2 === 0 ? BG_ACCENT : "#EEF3FA", color: i % 2 === 0 ? GOLD : CYAN, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${i % 2 === 0 ? BORDER_GOLD : CYAN_40}` }}>
                    <SvgCheck color={i % 2 === 0 ? GOLD : CYAN} size={11} /> {item.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ color: LIGHT_TEXT, fontSize: 12 }}>لم يتم إدخال المرافق</div>
            )}
          </div>

          {/* LEFT column — specs grid */}
          <div style={{ flex: 1, padding: "20px 32px", display: "flex", flexDirection: "column" }}>
            <SectionTitle title="مواصفات المشروع" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "start" }}>
              {[
                { label: "اسم المشروع", value: data.projectName },
                { label: "نوع المشروع", value: data.projectType },
                { label: "المدينة", value: data.city },
                { label: "الحي / الموقع", value: data.district },
                { label: "إجمالي المساحة", value: data.totalArea ? `${formatNumber(parseFloat(data.totalArea))} م²` : "" },
                { label: "عدد الطوابق", value: data.floors },
                { label: "سنة الإنجاز", value: data.completionYear },
                { label: "الوحدات الشاغرة", value: String(data.units.length) },
                { label: "إجمالي مساحة الوحدات الشاغرة", value: totalArea > 0 ? `${formatNumber(totalArea)} م²` : "" },
              ].filter((x) => x.value).map((item, i) => (
                <div key={i} style={{ background: BG_SECTION, borderRadius: 8, padding: "10px 14px", border: `1px solid ${BORDER_LIGHT}`, borderTop: `3px solid ${i % 2 === 0 ? GOLD : CYAN}` }}>
                  <div style={{ fontSize: 9, color: LIGHT_TEXT, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ color: DARK_TEXT, fontWeight: 800, fontSize: 13 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, marginTop: 16, background: `linear-gradient(135deg, ${BG_ACCENT} 0%, #EEF3FA 100%)`, padding: "16px 18px", border: `1px solid ${BORDER_GOLD}`, borderRight: `4px solid ${CYAN}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 13, marginBottom: 10, borderBottom: `1px solid ${BORDER_GOLD}`, paddingBottom: 8 }}>ملخص الإتاحة</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "فرص متاحة", value: `${data.units.length} وحدة` },
                  { label: "المساحة المتاحة", value: totalArea > 0 ? `${formatNumber(totalArea)} م²` : "تُستكمل" },
                  { label: "الموقع", value: projectLocation || "تُستكمل بيانات الموقع" },
                  { label: "التواصل", value: data.contactName || "فريق التأجير" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,.72)", padding: "8px 10px", borderTop: `2px solid ${i % 2 === 0 ? GOLD : CYAN}` }}>
                    <div style={{ color: LIGHT_TEXT, fontSize: 9, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ color: DARK_TEXT, fontSize: 11, fontWeight: 800, lineHeight: 1.45 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 3 — VACANT UNITS TABLE
      ══════════════════════════════════════════════ */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", pageBreakAfter: "always", position: "relative" }}>
        <PageHeader name={data.projectName} />

        <div style={{ padding: "16px 40px", flex: 1, overflow: "hidden" }}>
          <div style={{ marginBottom: 14 }}>
            <SectionTitle title={`الوحدات الشاغرة — ${data.projectName || "المشروع"}`} />
            <p style={{ color: MID_TEXT, fontSize: 12, margin: 0 }}>
              إجمالي {data.units.length} وحدة شاغرة بمساحة إجمالية {formatNumber(totalArea)} م²
            </p>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16, border: `2px solid ${BORDER_GOLD}`, borderRadius: 8, overflow: "hidden" }}>
            <thead>
              <tr>
                {["#", "رقم الوحدة", "الطابق", "النوع", "المساحة (م²)", "مدة العقد", "الإيجار السنوي (ر.س)", "سعر م²", "ملاحظات"].map((h, i) => (
                  <th key={i} style={{ background: GOLD, color: "#fff", padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 11, borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.2)` : "none" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.units.map((unit, idx) => {
                const annualRent = unit.monthlyRent ? (parseFloat(unit.monthlyRent) * 12) : "—";
                return (
                  <tr key={unit.id} style={{ background: idx % 2 === 0 ? BG_PAGE : BG_SECTION, borderBottom: `1px solid ${BORDER_LIGHT}` }}>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GOLD, fontWeight: 800, fontSize: 12, border: `1px solid ${BORDER_LIGHT}` }}>{idx + 1}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: DARK_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>{unit.unitNumber || `وحدة ${idx + 1}`}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: MID_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>{unit.floor || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", border: `1px solid ${BORDER_LIGHT}` }}>
                      <span style={{ background: CYAN_40, color: CYAN, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{unit.unitType}</span>
                    </td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, color: DARK_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>{unit.area ? formatNumber(parseFloat(unit.area)) : "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: MID_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>{(unit as any).contractDuration || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: "#1a7a4a", fontWeight: 700, border: `1px solid ${BORDER_LIGHT}` }}>{annualRent}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: MID_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>{unit.pricePerMeter ? formatNumber(parseFloat(unit.pricePerMeter)) : "—"}</td>
                    <td style={{ padding: "8px 6px", color: LIGHT_TEXT, fontSize: 10, border: `1px solid ${BORDER_LIGHT}` }}>{unit.features || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: BG_ACCENT, borderTop: `2px solid ${GOLD}` }}>
                <td colSpan={4} style={{ padding: "10px 8px", fontWeight: 900, color: GOLD, fontSize: 12, border: `1px solid ${BORDER_GOLD}` }}>الإجمالي</td>
                <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 900, color: GOLD, fontSize: 13, border: `1px solid ${BORDER_GOLD}` }}>{formatNumber(totalArea)} م²</td>
                <td colSpan={4} style={{ border: `1px solid ${BORDER_GOLD}` }} />
              </tr>
            </tfoot>
          </table>

          {/* Summary cards */}
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { label: "إجمالي الوحدات الشاغرة", value: String(data.units.length), sub: "وحدة", accent: GOLD },
              { label: "إجمالي مساحة الوحدات الشاغرة", value: formatNumber(totalArea), sub: "م²", accent: CYAN },
              { label: "متوسط مساحة الوحدة", value: data.units.length ? Math.round(totalArea / data.units.length) : "—", sub: "م²", accent: GOLD_80 },
            ].map((c, i) => (
              <div key={i} style={{ flex: 1, background: BG_SECTION, border: `1px solid ${BORDER_LIGHT}`, borderTop: `4px solid ${c.accent}`, borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: c.accent, lineHeight: 1 }}>
                  {c.value}<span style={{ fontSize: 11, fontWeight: 600, marginRight: 4, color: LIGHT_TEXT }}>{c.sub}</span>
                </div>
                <div style={{ fontSize: 11, color: MID_TEXT, marginTop: 5 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 4 — CONTACT
      ══════════════════════════════════════════════ */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* Gold top bar */}
        <div style={{ height: 7, background: GOLD }} />

        {/* Decorative SVG */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <circle cx="950" cy="120" r="300" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.12" />
          <circle cx="950" cy="120" r="420" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.08" />
          <circle cx="100" cy="700" r="250" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.08" />
          <path d={`M0 650 Q300 580 600 640 T${W} 560 L${W} ${H} L0 ${H} Z`} fill={GOLD} opacity="0.04" />
        </svg>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 80px", position: "relative", zIndex: 2 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 64, objectFit: "contain", marginBottom: 12 }} />
          <div style={{ width: 80, height: 3, background: GOLD, margin: "0 auto 16px", borderRadius: 2 }} />

          <h2 style={{ color: DARK_TEXT, fontSize: 26, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>احجز معاينتك</h2>
          <p style={{ color: MID_TEXT, fontSize: 12, margin: "0 0 32px", textAlign: "center" }}>
            فريقنا جاهز لمساعدتك في اختيار الوحدة المناسبة لنشاطك التجاري
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "المسؤول", value: data.contactName, accent: GOLD },
              { label: "الهاتف", value: data.contactPhone, accent: CYAN },
              { label: "البريد الإلكتروني", value: data.contactEmail, accent: GOLD_80 },
              { label: "الموقع الإلكتروني", value: "www.delmoninvest.com", accent: CYAN },
            ].filter((c) => c.value).map((c, i) => (
              <div key={i} style={{ background: BG_SECTION, border: `1px solid ${BORDER_LIGHT}`, borderTop: `4px solid ${c.accent}`, borderRadius: 12, padding: "18px 26px", minWidth: 160, textAlign: "center" }}>
                <div style={{ color: c.accent, fontSize: 10, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ color: DARK_TEXT, fontWeight: 700, fontSize: 13 }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, padding: "16px 0 0", borderTop: `1px solid ${BORDER_GOLD}`, textAlign: "center", width: "100%" }}>
            <div style={{ color: LIGHT_TEXT, fontSize: 11 }}>المقر الرئيسي: الرياض — حي الروابي | هاتف: 011-2080129</div>
            <div style={{ color: GOLD, fontSize: 12, marginTop: 6, fontWeight: 700 }}>شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY</div>
          </div>
        </div>

        <div style={{ height: 3, background: CYAN }} />
        <div style={{ height: 7, background: GOLD }} />
      </div>
    </div>
  );
}

/* ─── Shared sub-components ─── */

function PageHeader({ name }: { name: string }) {
  return (
    <>
      <div style={{ height: 6, background: GOLD, flexShrink: 0 }} />
      <div style={{ background: BG_PAGE, padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER_GOLD}`, flexShrink: 0 }}>
        <img src={LOGO} alt="دلمون" style={{ height: 32, objectFit: "contain" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: DARK_TEXT, fontWeight: 700, fontSize: 12 }}>{name || "بروشور التأجير"}</div>
          <div style={{ color: GOLD, fontSize: 10 }}>وحدات شاغرة للتأجير</div>
        </div>
        <div style={{ textAlign: "left", color: LIGHT_TEXT, fontSize: 10 }}>
          <div>www.delmoninvest.com</div>
          <div>011-2080129</div>
        </div>
      </div>
      <div style={{ height: 3, background: CYAN, flexShrink: 0 }} />
    </>
  );
}

function PageFooter() {
  return (
    <>
      <div style={{ height: 3, background: CYAN, flexShrink: 0 }} />
      <div style={{ background: BG_SECTION, padding: "8px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${BORDER_GOLD}`, flexShrink: 0 }}>
        <span style={{ color: LIGHT_TEXT, fontSize: 10 }}>شركة دلمون للاستثمار | جميع الحقوق محفوظة</span>
        <span style={{ color: GOLD, fontSize: 10, fontWeight: 700 }}>www.delmoninvest.com</span>
      </div>
      <div style={{ height: 5, background: GOLD, flexShrink: 0 }} />
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 5, height: 22, background: GOLD, borderRadius: 3, flexShrink: 0 }} />
      <h2 style={{ color: DARK_TEXT, fontSize: 15, fontWeight: 900, margin: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: BORDER_GOLD, marginRight: 6 }} />
    </div>
  );
}
