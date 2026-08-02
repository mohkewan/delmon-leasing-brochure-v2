import { ProjectData } from "@/lib/brochureTypes";
import { formatNumber } from "@/lib/formatNumber";

// ===== DELMON INVESTMENT — MODERN TEMPLATE =====
// Modern design: clean green + white, geometric accents
// A4 Landscape 1123×794px — RTL, print-ready

const LOGO = "/manus-storage/delmon_logo_19a2386c.png";
const GREEN = "#1a6b4a";
const GREEN_LIGHT = "#4caf7d";
const GREEN_PALE = "#e8f5ee";
const GREEN_BORDER = "#b8dfc9";
const BG = "#F8FAF9";
const WHITE = "#FFFFFF";
const DARK = "#1a2e25";
const MID = "#4a6558";
const LIGHT = "#8aab99";
const W = 1123;
const H = 794;

interface Props { data: ProjectData; }

export default function BrochurePreviewModern({ data }: Props) {
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const today = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div id="brochure-content" dir="rtl" style={{ fontFamily: "'Cairo','Noto Kufi Arabic',sans-serif", background: BG, width: W }}>

      {/* PAGE 1 — COVER */}
      <div style={{ width: W, height: H, background: WHITE, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", pageBreakAfter: "always" }}>
        {/* Top geometric bar */}
        <div style={{ height: 8, background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GREEN_BORDER}`, background: WHITE, flexShrink: 0 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 44, objectFit: "contain" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: GREEN, fontSize: 13, fontWeight: 900 }}>شركة دلمون للاستثمار</div>
            <div style={{ color: LIGHT, fontSize: 10, letterSpacing: 1.5 }}>DELMON INVESTMENT COMPANY</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: LIGHT, fontSize: 10 }}>www.delmoninvest.com</div>
            <div style={{ color: LIGHT, fontSize: 10 }}>011-2080129</div>
          </div>
        </div>

        {/* Main body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* RIGHT — text */}
          <div style={{ width: 490, padding: "28px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: GREEN_PALE, color: GREEN, padding: "4px 16px", borderRadius: 4, fontSize: 11, fontWeight: 800, border: `1px solid ${GREEN_BORDER}`, marginBottom: 16 }}>
                ◆ وحدات شاغرة للتأجير
              </div>
              <h1 style={{ color: DARK, fontSize: 36, fontWeight: 900, lineHeight: 1.3, margin: "0 0 8px" }}>
                {data.projectName || "اسم المشروع"}
              </h1>
              {data.projectType && (
                <div style={{ color: GREEN_LIGHT, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{data.projectType}</div>
              )}
              {(data.city || data.district) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: MID, fontSize: 13, marginBottom: 22 }}>
                  <span style={{ color: GREEN_LIGHT, fontWeight: 700 }}>📍</span>
                  {[data.district, data.city].filter(Boolean).join(" — ")}
                </div>
              )}
              {/* Stats */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                {[
                  { v: String(data.units.length), l: "وحدة شاغرة", primary: true },
                  { v: `${formatNumber(totalArea)} م²`, l: "إجمالي مساحة الوحدات الشاغرة", primary: false },
                  ...(data.floors ? [{ v: data.floors, l: "طابق", primary: false }] : []),
                  ...(data.completionYear ? [{ v: data.completionYear, l: "سنة الإنجاز", primary: false }] : []),
                ].map((s, i) => (
                  <div key={i} style={{ background: s.primary ? GREEN : GREEN_PALE, border: `1px solid ${s.primary ? GREEN : GREEN_BORDER}`, borderRadius: 8, padding: "10px 18px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ color: s.primary ? WHITE : GREEN, fontSize: 20, fontWeight: 900 }}>{s.v}</div>
                    <div style={{ color: s.primary ? "rgba(255,255,255,0.85)" : MID, fontSize: 10, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {data.amenities && (
                <div style={{ padding: "12px 16px", background: GREEN_PALE, borderRadius: 6, border: `1px solid ${GREEN_BORDER}`, borderRight: `4px solid ${GREEN_LIGHT}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.amenities.split(/[,،]/).slice(0, 5).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: DARK, fontSize: 11, fontWeight: 600 }}>
                      <span style={{ color: GREEN_LIGHT, fontWeight: 900 }}>✓</span>
                      {item.trim()}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: "14px 0 0", borderTop: `1px solid ${GREEN_BORDER}` }}>
              <div style={{ color: GREEN, fontSize: 12, fontWeight: 800 }}>فرصة استثمارية مميزة</div>
              <div style={{ color: LIGHT, fontSize: 10, marginTop: 3 }}>تواصل معنا للحصول على مزيد من التفاصيل</div>
            </div>
          </div>

          {/* LEFT — image */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: data.projectImage ? "transparent" : GREEN_PALE, borderRight: `4px solid ${GREEN}` }}>
            {data.projectImage ? (
              <>
                <img src={data.projectImage} alt={data.projectName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 40%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px", background: `linear-gradient(to top, rgba(26,107,74,0.75) 0%, transparent 100%)` }}>
                  <div style={{ color: WHITE, fontSize: 18, fontWeight: 900 }}>{data.projectName}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{data.city}</div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                <div style={{ fontSize: 60, color: GREEN_BORDER }}>🏢</div>
                <div style={{ color: MID, fontWeight: 700, fontSize: 14 }}>صورة المشروع</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`, flexShrink: 0 }} />
      </div>

      {/* PAGE 2 — PROJECT DETAILS */}
      <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", pageBreakAfter: "always" }}>
        <MPageHeader name={data.projectName} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 520, padding: "20px 40px", borderLeft: `1px solid ${GREEN_BORDER}` }}>
            <MSectionTitle title="نبذة عن المشروع" />
            <div style={{ background: WHITE, borderRadius: 8, padding: "14px 18px", borderRight: `5px solid ${GREEN}`, color: DARK, fontSize: 13, lineHeight: 2.0, marginBottom: 20, boxShadow: "0 1px 4px rgba(26,107,74,0.08)" }}>
              {data.description || "يرجى إضافة وصف للمشروع"}
            </div>
            <MSectionTitle title="المرافق والخدمات" />
            {data.amenities ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.amenities.split(/[,،]/).map((item, i) => (
                  <span key={i} style={{ background: i % 2 === 0 ? GREEN_PALE : WHITE, color: i % 2 === 0 ? GREEN : GREEN_LIGHT, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${GREEN_BORDER}` }}>
                    ✓ {item.trim()}
                  </span>
                ))}
              </div>
            ) : <div style={{ color: LIGHT, fontSize: 12 }}>لم يتم إدخال المرافق</div>}
          </div>
          <div style={{ flex: 1, padding: "20px 32px" }}>
            <MSectionTitle title="مواصفات المشروع" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "اسم المشروع", value: data.projectName },
                { label: "نوع المشروع", value: data.projectType },
                { label: "المدينة", value: data.city },
                { label: "الحي / الموقع", value: data.district },
                { label: "إجمالي المساحة", value: data.totalArea ? `${formatNumber(parseFloat(data.totalArea))} م²` : "" },
                { label: "عدد الطوابق", value: data.floors },
                { label: "سنة الإنجاز", value: data.completionYear },
                { label: "الوحدات الشاغرة", value: String(data.units.length) },
              ].filter(x => x.value).map((item, i) => (
                <div key={i} style={{ background: WHITE, borderRadius: 8, padding: "10px 14px", border: `1px solid ${GREEN_BORDER}`, borderTop: `3px solid ${i % 2 === 0 ? GREEN : GREEN_LIGHT}`, boxShadow: "0 1px 3px rgba(26,107,74,0.06)" }}>
                  <div style={{ fontSize: 9, color: LIGHT, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ color: DARK, fontWeight: 800, fontSize: 13 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <MPageFooter />
      </div>

      {/* PAGE 3 — UNITS TABLE */}
      <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", pageBreakAfter: "always" }}>
        <MPageHeader name={data.projectName} />
        <div style={{ padding: "16px 40px", flex: 1, overflow: "hidden" }}>
          <div style={{ marginBottom: 14 }}>
            <MSectionTitle title={`الوحدات الشاغرة — ${data.projectName || "المشروع"}`} />
            <p style={{ color: MID, fontSize: 12, margin: 0 }}>إجمالي {data.units.length} وحدة شاغرة بمساحة إجمالية {formatNumber(totalArea)} م²</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16, border: `2px solid ${GREEN_BORDER}`, borderRadius: 8, overflow: "hidden" }}>
            <thead>
              <tr>
                {["#", "رقم الوحدة", "الطابق", "النوع", "المساحة (م²)", "مدة العقد", "الإيجار السنوي (ر.س)", "سعر م²", "ملاحظات"].map((h, i) => (
                  <th key={i} style={{ background: GREEN, color: WHITE, padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 11, borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.2)` : "none" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.units.map((unit, idx) => {
                const annualRent = unit.monthlyRent ? (parseFloat(unit.monthlyRent) * 12) : "—";
                return (
                  <tr key={unit.id} style={{ background: idx % 2 === 0 ? WHITE : GREEN_PALE, borderBottom: `1px solid ${GREEN_BORDER}` }}>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GREEN, fontWeight: 800, fontSize: 12, border: `1px solid ${GREEN_BORDER}` }}>{idx + 1}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: DARK, border: `1px solid ${GREEN_BORDER}` }}>{unit.unitNumber || `وحدة ${idx + 1}`}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: MID, border: `1px solid ${GREEN_BORDER}` }}>{unit.floor || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", border: `1px solid ${GREEN_BORDER}` }}>
                      <span style={{ background: GREEN_PALE, color: GREEN, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{unit.unitType}</span>
                    </td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, color: DARK, border: `1px solid ${GREEN_BORDER}` }}>{unit.area ? formatNumber(parseFloat(unit.area)) : "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: MID, border: `1px solid ${GREEN_BORDER}` }}>{(unit as any).contractDuration || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GREEN, fontWeight: 700, border: `1px solid ${GREEN_BORDER}` }}>{annualRent}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: MID, border: `1px solid ${GREEN_BORDER}` }}>{unit.pricePerMeter ? formatNumber(parseFloat(unit.pricePerMeter)) : "—"}</td>
                    <td style={{ padding: "8px 6px", color: LIGHT, fontSize: 10, border: `1px solid ${GREEN_BORDER}` }}>{unit.features || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: GREEN_PALE, borderTop: `2px solid ${GREEN}` }}>
                <td colSpan={4} style={{ padding: "10px 8px", fontWeight: 900, color: GREEN, fontSize: 12, border: `1px solid ${GREEN_BORDER}` }}>الإجمالي</td>
                <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 900, color: GREEN, fontSize: 13, border: `1px solid ${GREEN_BORDER}` }}>{formatNumber(totalArea)} م²</td>
                <td colSpan={4} style={{ border: `1px solid ${GREEN_BORDER}` }} />
              </tr>
            </tfoot>
          </table>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { label: "إجمالي الوحدات الشاغرة", value: String(data.units.length), sub: "وحدة", accent: GREEN },
              { label: "إجمالي مساحة الوحدات الشاغرة", value: formatNumber(totalArea), sub: "م²", accent: GREEN_LIGHT },
              { label: "متوسط مساحة الوحدة", value: data.units.length ? Math.round(totalArea / data.units.length) : "—", sub: "م²", accent: GREEN },
            ].map((c, i) => (
              <div key={i} style={{ flex: 1, background: WHITE, border: `1px solid ${GREEN_BORDER}`, borderTop: `4px solid ${c.accent}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", boxShadow: "0 1px 4px rgba(26,107,74,0.08)" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: c.accent, lineHeight: 1 }}>{c.value}<span style={{ fontSize: 11, fontWeight: 600, marginRight: 4, color: LIGHT }}>{c.sub}</span></div>
                <div style={{ fontSize: 11, color: MID, marginTop: 5 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        <MPageFooter />
      </div>

      {/* PAGE 4 — CONTACT */}
      <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ height: 8, background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)` }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <circle cx="950" cy="120" r="300" fill="none" stroke={GREEN} strokeWidth="1.5" opacity="0.1" />
          <circle cx="950" cy="120" r="420" fill="none" stroke={GREEN_LIGHT} strokeWidth="1" opacity="0.07" />
          <path d={`M0 650 Q300 580 600 640 T${W} 560 L${W} ${H} L0 ${H} Z`} fill={GREEN} opacity="0.04" />
        </svg>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 80px", position: "relative", zIndex: 2 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 64, objectFit: "contain", marginBottom: 12 }} />
          <div style={{ width: 80, height: 3, background: GREEN, margin: "0 auto 16px", borderRadius: 2 }} />
          <h2 style={{ color: DARK, fontSize: 26, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>للاستفسار والحجز</h2>
          <p style={{ color: MID, fontSize: 12, margin: "0 0 32px", textAlign: "center" }}>فريقنا جاهز لمساعدتك في اختيار الوحدة المناسبة لنشاطك التجاري</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "المسؤول", value: data.contactName, accent: GREEN },
              { label: "الهاتف", value: data.contactPhone, accent: GREEN_LIGHT },
              { label: "البريد الإلكتروني", value: data.contactEmail, accent: GREEN },
              { label: "الموقع الإلكتروني", value: "www.delmoninvest.com", accent: GREEN_LIGHT },
            ].filter(c => c.value).map((c, i) => (
              <div key={i} style={{ background: WHITE, border: `1px solid ${GREEN_BORDER}`, borderTop: `4px solid ${c.accent}`, borderRadius: 12, padding: "18px 26px", minWidth: 160, textAlign: "center", boxShadow: "0 2px 8px rgba(26,107,74,0.08)" }}>
                <div style={{ color: c.accent, fontSize: 10, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ color: DARK, fontWeight: 700, fontSize: 13 }}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, padding: "16px 0 0", borderTop: `1px solid ${GREEN_BORDER}`, textAlign: "center", width: "100%" }}>
            <div style={{ color: LIGHT, fontSize: 11 }}>المقر الرئيسي: الرياض — حي الروابي | هاتف: 011-2080129</div>
            <div style={{ color: GREEN, fontSize: 12, marginTop: 6, fontWeight: 700 }}>شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY</div>
          </div>
        </div>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)` }} />
      </div>
    </div>
  );
}

function MPageHeader({ name }: { name: string }) {
  return (
    <>
      <div style={{ height: 5, background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`, flexShrink: 0 }} />
      <div style={{ background: WHITE, padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GREEN_BORDER}`, flexShrink: 0 }}>
        <img src={LOGO} alt="دلمون" style={{ height: 32, objectFit: "contain" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: DARK, fontWeight: 700, fontSize: 12 }}>{name || "بروشور التأجير"}</div>
          <div style={{ color: GREEN_LIGHT, fontSize: 10 }}>وحدات شاغرة للتأجير</div>
        </div>
        <div style={{ textAlign: "left", color: LIGHT, fontSize: 10 }}>
          <div>www.delmoninvest.com</div>
          <div>011-2080129</div>
        </div>
      </div>
      <div style={{ height: 2, background: GREEN_LIGHT, flexShrink: 0 }} />
    </>
  );
}

function MPageFooter() {
  return (
    <>
      <div style={{ height: 2, background: GREEN_LIGHT, flexShrink: 0 }} />
      <div style={{ background: GREEN_PALE, padding: "8px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${GREEN_BORDER}`, flexShrink: 0 }}>
        <span style={{ color: LIGHT, fontSize: 10 }}>شركة دلمون للاستثمار | جميع الحقوق محفوظة</span>
        <span style={{ color: GREEN, fontSize: 10, fontWeight: 700 }}>www.delmoninvest.com</span>
      </div>
      <div style={{ height: 4, background: GREEN, flexShrink: 0 }} />
    </>
  );
}

function MSectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 5, height: 22, background: GREEN, borderRadius: 3, flexShrink: 0 }} />
      <h2 style={{ color: DARK, fontSize: 15, fontWeight: 900, margin: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: GREEN_BORDER, marginRight: 6 }} />
    </div>
  );
}
