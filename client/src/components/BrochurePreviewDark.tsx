// ===== DELMON INVESTMENT — DARK LUXURY TEMPLATE =====
// Dark premium design: deep navy + gold accents
// A4 Landscape 1123×794px — RTL, print-ready

import type { ProjectData } from "@/pages/Home";
import { formatNumber } from "@/lib/formatNumber";

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

const LOGO = "/manus-storage/delmon_logo_19a2386c.png";
const GOLD = "#c9a84c";
const GOLD_LIGHT = "#e8c97a";
const GOLD_PALE = "rgba(201,168,76,0.12)";
const GOLD_BORDER = "rgba(201,168,76,0.3)";
const BG_DARK = "#1a1a2e";
const BG_CARD = "#16213e";
const BG_ACCENT = "#0f3460";
const TEXT_LIGHT = "#f0ede0";
const TEXT_MID = "#b8b4a0";
const TEXT_DIM = "#7a7668";
const W = 1123;
const H = 794;

interface Props { data: ProjectData; }

export default function BrochurePreviewDark({ data }: Props) {
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);

  return (
    <div id="brochure-content" dir="rtl" style={{ fontFamily: "'Cairo','Noto Kufi Arabic',sans-serif", background: BG_DARK, width: W }}>

      {/* PAGE 1 — COVER */}
      <div style={{ width: W, height: H, background: BG_DARK, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", pageBreakAfter: "always" }}>
        {/* Gold top bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`, flexShrink: 0 }} />

        {/* Decorative background */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <circle cx="900" cy="100" r="350" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.08" />
          <circle cx="900" cy="100" r="500" fill="none" stroke={GOLD_LIGHT} strokeWidth="0.5" opacity="0.05" />
          <path d={`M600 0 L${W} 0 L${W} ${H} L500 ${H} Z`} fill={BG_CARD} opacity="0.6" />
        </svg>

        {/* Header */}
        <div style={{ padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GOLD_BORDER}`, flexShrink: 0, position: "relative", zIndex: 2 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 44, objectFit: "contain", filter: "brightness(1.2)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: GOLD, fontSize: 13, fontWeight: 900 }}>شركة دلمون للاستثمار</div>
            <div style={{ color: TEXT_DIM, fontSize: 10, letterSpacing: 1.5 }}>DELMON INVESTMENT COMPANY</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: TEXT_DIM, fontSize: 10 }}>www.delmoninvest.com</div>
            <div style={{ color: TEXT_DIM, fontSize: 10 }}>011-2080129</div>
          </div>
        </div>

        {/* Main body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 2 }}>
          {/* RIGHT — text */}
          <div style={{ width: 490, padding: "28px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: GOLD_PALE, color: GOLD, padding: "4px 16px", borderRadius: 4, fontSize: 11, fontWeight: 800, border: `1px solid ${GOLD_BORDER}`, marginBottom: 16 }}>
                ◆ وحدات شاغرة للتأجير
              </div>
              <h1 style={{ color: TEXT_LIGHT, fontSize: 36, fontWeight: 900, lineHeight: 1.3, margin: "0 0 8px" }}>
                {data.projectName || "اسم المشروع"}
              </h1>
              {data.projectType && (
                <div style={{ color: GOLD_LIGHT, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{data.projectType}</div>
              )}
              {(data.city || data.district) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: TEXT_MID, fontSize: 13, marginBottom: 22 }}>
                  <SvgPin color={GOLD} size={14} />
                  {[data.district, data.city].filter(Boolean).join(" — ")}
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                {[
                  { v: String(data.units.length), l: "وحدة شاغرة", primary: true },
                  { v: `${totalArea.toLocaleString("en-US")} م²`, l: "إجمالي مساحة الوحدات الشاغرة", primary: false },
                  ...(data.floors ? [{ v: data.floors, l: "طابق", primary: false }] : []),
                  ...(data.completionYear ? [{ v: data.completionYear, l: "سنة الإنجاز", primary: false }] : []),
                ].map((s, i) => (
                  <div key={i} style={{ background: s.primary ? GOLD : BG_CARD, border: `1px solid ${s.primary ? GOLD : GOLD_BORDER}`, borderRadius: 8, padding: "10px 18px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ color: s.primary ? BG_DARK : GOLD, fontSize: 20, fontWeight: 900 }}>{s.v}</div>
                    <div style={{ color: s.primary ? "rgba(26,26,46,0.8)" : TEXT_MID, fontSize: 10, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {data.amenities && (
                <div style={{ padding: "12px 16px", background: BG_CARD, borderRadius: 6, border: `1px solid ${GOLD_BORDER}`, borderRight: `4px solid ${GOLD}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.amenities.split(/[,،]/).slice(0, 5).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: TEXT_LIGHT, fontSize: 11, fontWeight: 600 }}>
                      <SvgCheck color={GOLD} size={11} />
                      {item.trim()}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: "14px 0 0", borderTop: `1px solid ${GOLD_BORDER}` }}>
              <div style={{ color: GOLD, fontSize: 12, fontWeight: 800 }}>فرصة استثمارية مميزة</div>
              <div style={{ color: TEXT_DIM, fontSize: 10, marginTop: 3 }}>تواصل معنا للحصول على مزيد من التفاصيل</div>
            </div>
          </div>

          {/* LEFT — image */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: data.projectImage ? "transparent" : BG_CARD, borderRight: `3px solid ${GOLD}` }}>
            {data.projectImage ? (
              <>
                <img src={data.projectImage} alt={data.projectName} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) saturate(0.9)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,26,46,0.3) 0%, transparent 40%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px", background: `linear-gradient(to top, rgba(26,26,46,0.85) 0%, transparent 100%)` }}>
                  <div style={{ color: TEXT_LIGHT, fontSize: 18, fontWeight: 900 }}>{data.projectName}</div>
                  <div style={{ color: GOLD, fontSize: 12 }}>{data.city}</div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                <SvgBuilding color={GOLD_BORDER} size={64} />
                <div style={{ color: TEXT_MID, fontWeight: 700, fontSize: 14 }}>صورة المشروع</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`, flexShrink: 0 }} />
      </div>

      {/* PAGE 2 — PROJECT DETAILS */}
      <div style={{ width: W, height: H, background: BG_DARK, display: "flex", flexDirection: "column", pageBreakAfter: "always" }}>
        <DPageHeader name={data.projectName} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 520, padding: "20px 40px", borderLeft: `1px solid ${GOLD_BORDER}` }}>
            <DSectionTitle title="نبذة عن المشروع" />
            <div style={{ background: BG_CARD, borderRadius: 8, padding: "14px 18px", borderRight: `5px solid ${GOLD}`, color: TEXT_LIGHT, fontSize: 13, lineHeight: 2.0, marginBottom: 20 }}>
              {data.description || "يرجى إضافة وصف للمشروع"}
            </div>
            <DSectionTitle title="المرافق والخدمات" />
            {data.amenities ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.amenities.split(/[,،]/).map((item, i) => (
                  <span key={i} style={{ background: i % 2 === 0 ? GOLD_PALE : BG_CARD, color: i % 2 === 0 ? GOLD : GOLD_LIGHT, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${GOLD_BORDER}` }}>
                    <SvgCheck color={GOLD} size={11} /> {item.trim()}
                  </span>
                ))}
              </div>
            ) : <div style={{ color: TEXT_DIM, fontSize: 12 }}>لم يتم إدخال المرافق</div>}
          </div>
          <div style={{ flex: 1, padding: "20px 32px" }}>
            <DSectionTitle title="مواصفات المشروع" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "اسم المشروع", value: data.projectName },
                { label: "نوع المشروع", value: data.projectType },
                { label: "المدينة", value: data.city },
                { label: "الحي / الموقع", value: data.district },
                { label: "إجمالي المساحة", value: data.totalArea ? `${parseFloat(data.totalArea).toLocaleString("en-US")} م²` : "" },
                { label: "عدد الطوابق", value: data.floors },
                { label: "سنة الإنجاز", value: data.completionYear },
                { label: "الوحدات الشاغرة", value: String(data.units.length) },
              ].filter(x => x.value).map((item, i) => (
                <div key={i} style={{ background: BG_CARD, borderRadius: 8, padding: "10px 14px", border: `1px solid ${GOLD_BORDER}`, borderTop: `3px solid ${i % 2 === 0 ? GOLD : GOLD_LIGHT}` }}>
                  <div style={{ fontSize: 9, color: TEXT_DIM, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ color: TEXT_LIGHT, fontWeight: 800, fontSize: 13 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DPageFooter />
      </div>

      {/* PAGE 3 — UNITS TABLE */}
      <div style={{ width: W, height: H, background: BG_DARK, display: "flex", flexDirection: "column", pageBreakAfter: "always" }}>
        <DPageHeader name={data.projectName} />
        <div style={{ padding: "16px 40px", flex: 1, overflow: "hidden" }}>
          <div style={{ marginBottom: 14 }}>
            <DSectionTitle title={`الوحدات الشاغرة — ${data.projectName || "المشروع"}`} />
            <p style={{ color: TEXT_MID, fontSize: 12, margin: 0 }}>إجمالي {data.units.length} وحدة شاغرة بمساحة إجمالية {totalArea.toLocaleString("en-US")} م²</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16, border: `2px solid ${GOLD_BORDER}`, borderRadius: 8, overflow: "hidden" }}>
            <thead>
              <tr>
                {["#", "رقم الوحدة", "الطابق", "النوع", "المساحة (م²)", "مدة العقد", "الإيجار السنوي (ر.س)", "سعر م²", "ملاحظات"].map((h, i) => (
                  <th key={i} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`, color: BG_DARK, padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 11, borderLeft: i > 0 ? `1px solid rgba(26,26,46,0.3)` : "none" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.units.map((unit, idx) => {
                const annualRent = unit.monthlyRent ? (parseFloat(unit.monthlyRent) * 12).toLocaleString("en-US") : "—";
                return (
                  <tr key={unit.id} style={{ background: idx % 2 === 0 ? BG_DARK : BG_CARD, borderBottom: `1px solid ${GOLD_BORDER}` }}>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GOLD, fontWeight: 800, fontSize: 12, border: `1px solid ${GOLD_BORDER}` }}>{idx + 1}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: TEXT_LIGHT, border: `1px solid ${GOLD_BORDER}` }}>{unit.unitNumber || `وحدة ${idx + 1}`}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: TEXT_MID, border: `1px solid ${GOLD_BORDER}` }}>{unit.floor || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", border: `1px solid ${GOLD_BORDER}` }}>
                      <span style={{ background: GOLD_PALE, color: GOLD, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{unit.unitType}</span>
                    </td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, color: TEXT_LIGHT, border: `1px solid ${GOLD_BORDER}` }}>{unit.area ? parseFloat(unit.area).toLocaleString("en-US") : "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: TEXT_MID, border: `1px solid ${GOLD_BORDER}` }}>{(unit as any).contractDuration || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GOLD_LIGHT, fontWeight: 700, border: `1px solid ${GOLD_BORDER}` }}>{annualRent}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: TEXT_MID, border: `1px solid ${GOLD_BORDER}` }}>{unit.pricePerMeter ? parseFloat(unit.pricePerMeter).toLocaleString("en-US") : "—"}</td>
                    <td style={{ padding: "8px 6px", color: TEXT_DIM, fontSize: 10, border: `1px solid ${GOLD_BORDER}` }}>{unit.features || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: BG_ACCENT, borderTop: `2px solid ${GOLD}` }}>
                <td colSpan={4} style={{ padding: "10px 8px", fontWeight: 900, color: GOLD, fontSize: 12, border: `1px solid ${GOLD_BORDER}` }}>الإجمالي</td>
                <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 900, color: GOLD, fontSize: 13, border: `1px solid ${GOLD_BORDER}` }}>{totalArea.toLocaleString("en-US")} م²</td>
                <td colSpan={4} style={{ border: `1px solid ${GOLD_BORDER}` }} />
              </tr>
            </tfoot>
          </table>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { label: "إجمالي الوحدات الشاغرة", value: String(data.units.length), sub: "وحدة", accent: GOLD },
              { label: "إجمالي مساحة الوحدات الشاغرة", value: totalArea.toLocaleString("en-US"), sub: "م²", accent: GOLD_LIGHT },
              { label: "متوسط مساحة الوحدة", value: data.units.length ? Math.round(totalArea / data.units.length).toLocaleString("en-US") : "—", sub: "م²", accent: GOLD },
            ].map((c, i) => (
              <div key={i} style={{ flex: 1, background: BG_CARD, border: `1px solid ${GOLD_BORDER}`, borderTop: `4px solid ${c.accent}`, borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: c.accent, lineHeight: 1 }}>{c.value}<span style={{ fontSize: 11, fontWeight: 600, marginRight: 4, color: TEXT_DIM }}>{c.sub}</span></div>
                <div style={{ fontSize: 11, color: TEXT_MID, marginTop: 5 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        <DPageFooter />
      </div>

      {/* PAGE 4 — CONTACT */}
      <div style={{ width: W, height: H, background: BG_DARK, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)` }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <circle cx="950" cy="120" r="300" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.12" />
          <circle cx="950" cy="120" r="450" fill="none" stroke={GOLD_LIGHT} strokeWidth="1" opacity="0.06" />
          <path d={`M0 650 Q300 580 600 640 T${W} 560 L${W} ${H} L0 ${H} Z`} fill={GOLD} opacity="0.04" />
        </svg>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 80px", position: "relative", zIndex: 2 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 64, objectFit: "contain", marginBottom: 12, filter: "brightness(1.2)" }} />
          <div style={{ width: 80, height: 3, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`, margin: "0 auto 16px", borderRadius: 2 }} />
          <h2 style={{ color: TEXT_LIGHT, fontSize: 26, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>للاستفسار والحجز</h2>
          <p style={{ color: TEXT_MID, fontSize: 12, margin: "0 0 32px", textAlign: "center" }}>فريقنا جاهز لمساعدتك في اختيار الوحدة المناسبة لنشاطك التجاري</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "المسؤول", value: data.contactName, accent: GOLD },
              { label: "الهاتف", value: data.contactPhone, accent: GOLD_LIGHT },
              { label: "البريد الإلكتروني", value: data.contactEmail, accent: GOLD },
              { label: "الموقع الإلكتروني", value: "www.delmoninvest.com", accent: GOLD_LIGHT },
            ].filter(c => c.value).map((c, i) => (
              <div key={i} style={{ background: BG_CARD, border: `1px solid ${GOLD_BORDER}`, borderTop: `4px solid ${c.accent}`, borderRadius: 12, padding: "18px 26px", minWidth: 160, textAlign: "center" }}>
                <div style={{ color: c.accent, fontSize: 10, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ color: TEXT_LIGHT, fontWeight: 700, fontSize: 13 }}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, padding: "16px 0 0", borderTop: `1px solid ${GOLD_BORDER}`, textAlign: "center", width: "100%" }}>
            <div style={{ color: TEXT_DIM, fontSize: 11 }}>المقر الرئيسي: الرياض — حي الروابي | هاتف: 011-2080129</div>
            <div style={{ color: GOLD, fontSize: 12, marginTop: 6, fontWeight: 700 }}>شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY</div>
          </div>
        </div>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)` }} />
      </div>
    </div>
  );
}

function DPageHeader({ name }: { name: string }) {
  return (
    <>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`, flexShrink: 0 }} />
      <div style={{ background: BG_CARD, padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GOLD_BORDER}`, flexShrink: 0 }}>
        <img src={LOGO} alt="دلمون" style={{ height: 32, objectFit: "contain", filter: "brightness(1.2)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: TEXT_LIGHT, fontWeight: 700, fontSize: 12 }}>{name || "بروشور التأجير"}</div>
          <div style={{ color: GOLD, fontSize: 10 }}>وحدات شاغرة للتأجير</div>
        </div>
        <div style={{ textAlign: "left", color: TEXT_DIM, fontSize: 10 }}>
          <div>www.delmoninvest.com</div>
          <div>011-2080129</div>
        </div>
      </div>
      <div style={{ height: 2, background: GOLD_LIGHT, flexShrink: 0, opacity: 0.4 }} />
    </>
  );
}

function DPageFooter() {
  return (
    <>
      <div style={{ height: 2, background: GOLD_LIGHT, flexShrink: 0, opacity: 0.4 }} />
      <div style={{ background: BG_CARD, padding: "8px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${GOLD_BORDER}`, flexShrink: 0 }}>
        <span style={{ color: TEXT_DIM, fontSize: 10 }}>شركة دلمون للاستثمار | جميع الحقوق محفوظة</span>
        <span style={{ color: GOLD, fontSize: 10, fontWeight: 700 }}>www.delmoninvest.com</span>
      </div>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`, flexShrink: 0 }} />
    </>
  );
}

function DSectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 5, height: 22, background: `linear-gradient(180deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`, borderRadius: 3, flexShrink: 0 }} />
      <h2 style={{ color: TEXT_LIGHT, fontSize: 15, fontWeight: 900, margin: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: GOLD_BORDER, marginRight: 6 }} />
    </div>
  );
}
