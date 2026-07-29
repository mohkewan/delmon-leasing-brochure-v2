import type { ProjectData } from "@/lib/brochureTypes";

// ===== DELMON INVESTMENT — BOLD MAGAZINE TEMPLATE =====
// Modern magazine layout: diagonal panel + gold accent bar
// A4 Landscape 1123×794px — RTL, print-ready

const LOGO = "/manus-storage/delmon_logo_19a2386c.png";
const GOLD = "#949437";
const GOLD_LIGHT = "#b8b55a";
const GOLD_PALE = "rgba(148,148,55,0.08)";
const GOLD_BORDER = "rgba(148,148,55,0.25)";
const CYAN = "#8fa9dc";
const CYAN_PALE = "rgba(143,169,220,0.1)";
const BG_PAGE = "#f7f6f2";
const BG_PANEL = "#ffffff";
const BG_SECTION = "#f0efe9";
const TEXT_DARK = "#1a1a1a";
const TEXT_MID = "#555555";
const TEXT_LIGHT = "#888888";
const W = 1123;
const H = 794;

interface Props { data: ProjectData; }

export default function BrochurePreviewMagazine({ data }: Props) {
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);

  return (
    <div id="brochure-content" dir="rtl" style={{ fontFamily: "'Cairo','Noto Kufi Arabic',sans-serif", background: BG_PAGE, width: W }}>

      {/* PAGE 1 — COVER */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", position: "relative", overflow: "hidden", pageBreakAfter: "always" }}>
        {/* Rainbow top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to left, ${GOLD}, ${CYAN}, ${GOLD})`, zIndex: 10 }} />

        {/* LEFT panel — diagonal clip */}
        <div style={{ width: 490, background: BG_PANEL, clipPath: "polygon(0 0, 100% 0, 96% 100%, 0 100%)", display: "flex", flexDirection: "column", position: "relative", zIndex: 2, flexShrink: 0 }}>
          <div style={{ height: 5, background: GOLD, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "14px 22px 0", display: "flex", flexDirection: "column", gap: 7, overflow: "hidden" }}>
            {/* Logo row */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 8, color: TEXT_DARK, fontWeight: 700 }}>شركة دلمون للاستثمار</div>
                <div style={{ fontSize: 7, color: TEXT_LIGHT, letterSpacing: 0.5 }}>DELMON INVESTMENT CO.</div>
              </div>
              <div style={{ width: 1, height: 24, background: "#ddd" }} />
              <img src={LOGO} alt="دلمون" style={{ height: 32, objectFit: "contain" }} />
            </div>
            <div style={{ width: "100%", height: 1, background: `linear-gradient(to left, ${GOLD}, transparent)` }} />
            <div style={{ fontSize: 8, fontWeight: 700, color: CYAN, letterSpacing: 2, textAlign: "right" }}>LEASING BROCHURE | بروشور التأجير</div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: TEXT_DARK, lineHeight: 0.9, margin: 0, textAlign: "right" }}>
              {data.projectName || "اسم المشروع"}
            </h1>
            {data.projectType && (
              <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, textAlign: "right" }}>{data.projectType}</div>
            )}
            {(data.city || data.district) && (
              <div style={{ color: TEXT_MID, fontSize: 10, textAlign: "right" }}>
                📍 {[data.district, data.city].filter(Boolean).join(" — ")}
              </div>
            )}
            {data.description && (
              <div style={{ fontSize: 10, color: TEXT_MID, lineHeight: 1.7, textAlign: "right" }}>
                {data.description.slice(0, 160)}{data.description.length > 160 ? "..." : ""}
              </div>
            )}
            {/* Features */}
            <div style={{ fontSize: 9, fontWeight: 700, color: TEXT_DARK, textAlign: "right", display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
              <span style={{ display: "inline-block", width: 14, height: 2, background: GOLD }} />
              مميزات المشروع
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {[
                { t: "موقع استراتيجي", i: "📍" },
                { t: "مواقف سيارات", i: "🅿️" },
                { t: "أنظمة أمن 24 ساعة", i: "🔒" },
                { t: "تشطيب عالي الجودة", i: "✨" },
              ].map((f, i) => (
                <div key={i} style={{ background: BG_SECTION, borderRadius: 5, padding: "5px 9px", display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", borderRight: `3px solid ${CYAN}` }}>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: TEXT_DARK }}>{f.t}</span>
                  <span style={{ fontSize: 13 }}>{f.i}</span>
                </div>
              ))}
            </div>
            {/* Amenities */}
            {data.amenities && (
              <>
                <div style={{ fontSize: 9, fontWeight: 700, color: TEXT_DARK, textAlign: "right", display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <span style={{ display: "inline-block", width: 14, height: 2, background: CYAN }} />
                  أبرز المرافق
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {data.amenities.split(/[,،]/).slice(0, 6).map((item, i) => (
                    <span key={i} style={{ background: BG_SECTION, color: TEXT_MID, padding: "2px 8px", borderRadius: 14, fontSize: 8.5, fontWeight: 600 }}>
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </>
            )}
            {/* KPIs */}
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { v: data.totalArea ? `${parseFloat(data.totalArea).toLocaleString("ar-SA")}` : "—", l: "المساحة م²" },
                { v: data.floors || "—", l: "الطوابق" },
                { v: String(data.units.length), l: "الوحدات" },
                { v: data.completionYear || "—", l: "الإنجاز" },
              ].map((k, i) => (
                <div key={i} style={{ flex: 1, background: BG_SECTION, borderRadius: 4, padding: "7px 2px", textAlign: "center", borderRight: `4px solid ${GOLD}` }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{k.v}</div>
                  <div style={{ fontSize: 7, color: TEXT_LIGHT, marginTop: 2 }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Terms strip */}
          <div style={{ borderTop: `1px solid ${GOLD_BORDER}`, padding: "5px 22px", display: "flex", gap: 12, justifyContent: "flex-end", alignItems: "center", background: BG_SECTION, flexShrink: 0 }}>
            {["عقد 5 سنوات", "دفع ربع سنوي", "ضمان بنكي", "لا معسلات"].map((t, i) => (
              <span key={i} style={{ fontSize: 8, color: TEXT_MID, display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ color: GOLD, fontWeight: 700 }}>✓</span>{t}
              </span>
            ))}
          </div>
          {/* Footer bar */}
          <div style={{ height: 28, background: GOLD, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 15px", flexShrink: 0 }}>
            <span style={{ fontSize: 8, fontWeight: 600, color: "#fff", letterSpacing: 0.7 }}>01 / 04</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: "#fff", letterSpacing: 0.7 }}>delmoninvest.com | 011-2080129</span>
          </div>
        </div>

        {/* RIGHT — image */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {data.projectImage ? (
            <>
              <img src={data.projectImage} alt={data.projectName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(247,246,242,0.05), transparent 25%)" }} />
              <div style={{ position: "absolute", bottom: 30, right: 0, background: `rgba(148,148,55,0.9)`, color: "#fff", fontSize: 8, fontWeight: 700, padding: "5px 12px", letterSpacing: 1.5 }}>
                {data.projectName?.toUpperCase() || "PROJECT"}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: "#e8e7e3", gap: 12 }}>
              <div style={{ fontSize: 60, color: "#ccc" }}>🏢</div>
              <div style={{ color: TEXT_LIGHT, fontWeight: 700, fontSize: 14 }}>صورة المشروع</div>
            </div>
          )}
        </div>
      </div>

      {/* PAGE 2 — PROJECT DETAILS */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", pageBreakAfter: "always" }}>
        <MagPageHeader name={data.projectName} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 520, padding: "20px 40px", borderLeft: `1px solid ${GOLD_BORDER}` }}>
            <MagSectionTitle title="نبذة عن المشروع" />
            <div style={{ background: BG_PANEL, borderRadius: 8, padding: "14px 18px", borderRight: `5px solid ${GOLD}`, color: TEXT_DARK, fontSize: 13, lineHeight: 2.0, marginBottom: 20 }}>
              {data.description || "يرجى إضافة وصف للمشروع"}
            </div>
            <MagSectionTitle title="المرافق والخدمات" />
            {data.amenities ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.amenities.split(/[,،]/).map((item, i) => (
                  <span key={i} style={{ background: i % 2 === 0 ? GOLD_PALE : CYAN_PALE, color: i % 2 === 0 ? GOLD : CYAN, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${i % 2 === 0 ? GOLD_BORDER : "rgba(143,169,220,0.3)"}` }}>
                    ✓ {item.trim()}
                  </span>
                ))}
              </div>
            ) : <div style={{ color: TEXT_LIGHT, fontSize: 12 }}>لم يتم إدخال المرافق</div>}
          </div>
          <div style={{ flex: 1, padding: "20px 32px" }}>
            <MagSectionTitle title="مواصفات المشروع" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "اسم المشروع", value: data.projectName },
                { label: "نوع المشروع", value: data.projectType },
                { label: "المدينة", value: data.city },
                { label: "الحي / الموقع", value: data.district },
                { label: "إجمالي المساحة", value: data.totalArea ? `${parseFloat(data.totalArea).toLocaleString("ar-SA")} م²` : "" },
                { label: "عدد الطوابق", value: data.floors },
                { label: "سنة الإنجاز", value: data.completionYear },
                { label: "الوحدات الشاغرة", value: String(data.units.length) },
              ].filter(x => x.value).map((item, i) => (
                <div key={i} style={{ background: BG_PANEL, borderRadius: 8, padding: "10px 14px", border: `1px solid ${GOLD_BORDER}`, borderTop: `3px solid ${i % 2 === 0 ? GOLD : CYAN}` }}>
                  <div style={{ fontSize: 9, color: TEXT_LIGHT, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ color: TEXT_DARK, fontWeight: 800, fontSize: 13 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <MagPageFooter />
      </div>

      {/* PAGE 3 — UNITS TABLE */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", pageBreakAfter: "always" }}>
        <MagPageHeader name={data.projectName} />
        <div style={{ padding: "16px 40px", flex: 1, overflow: "hidden" }}>
          <div style={{ marginBottom: 14 }}>
            <MagSectionTitle title={`الوحدات الشاغرة — ${data.projectName || "المشروع"}`} />
            <p style={{ color: TEXT_MID, fontSize: 12, margin: 0 }}>إجمالي {data.units.length} وحدة شاغرة بمساحة إجمالية {totalArea.toLocaleString("ar-SA")} م²</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
            <thead>
              <tr>
                {["#", "رقم الوحدة", "الطابق", "النوع", "المساحة (م²)", "مدة العقد", "الإيجار السنوي (ر.س)", "سعر م²", "ملاحظات"].map((h, i) => (
                  <th key={i} style={{ background: GOLD, color: "#fff", padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 11, borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.units.map((unit, idx) => {
                const annualRent = unit.monthlyRent ? (parseFloat(unit.monthlyRent) * 12).toLocaleString("ar-SA") : "—";
                return (
                  <tr key={unit.id} style={{ background: idx % 2 === 0 ? BG_PANEL : BG_SECTION, borderBottom: `1px solid ${GOLD_BORDER}` }}>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GOLD, fontWeight: 800, fontSize: 12 }}>{idx + 1}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: TEXT_DARK }}>{unit.unitNumber || `وحدة ${idx + 1}`}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: TEXT_MID }}>{unit.floor || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center" }}>
                      <span style={{ background: GOLD_PALE, color: GOLD, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{unit.unitType}</span>
                    </td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, color: TEXT_DARK }}>{unit.area ? parseFloat(unit.area).toLocaleString("ar-SA") : "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: TEXT_MID }}>{(unit as any).contractDuration || "—"}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: GOLD, fontWeight: 700 }}>{annualRent}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", color: TEXT_MID }}>{unit.pricePerMeter ? parseFloat(unit.pricePerMeter).toLocaleString("ar-SA") : "—"}</td>
                    <td style={{ padding: "8px 6px", color: TEXT_LIGHT, fontSize: 10 }}>{unit.features || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: BG_SECTION, borderTop: `2px solid ${GOLD}` }}>
                <td colSpan={4} style={{ padding: "10px 8px", fontWeight: 900, color: GOLD, fontSize: 12 }}>الإجمالي</td>
                <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 900, color: GOLD, fontSize: 13 }}>{totalArea.toLocaleString("ar-SA")} م²</td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { label: "إجمالي الوحدات الشاغرة", value: String(data.units.length), sub: "وحدة", accent: GOLD },
              { label: "إجمالي المساحة الشاغرة", value: totalArea.toLocaleString("ar-SA"), sub: "م²", accent: CYAN },
              { label: "متوسط مساحة الوحدة", value: data.units.length ? Math.round(totalArea / data.units.length).toLocaleString("ar-SA") : "—", sub: "م²", accent: GOLD },
            ].map((c, i) => (
              <div key={i} style={{ flex: 1, background: BG_PANEL, border: `1px solid ${GOLD_BORDER}`, borderTop: `4px solid ${c.accent}`, borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: c.accent, lineHeight: 1 }}>{c.value}<span style={{ fontSize: 11, fontWeight: 600, marginRight: 4, color: TEXT_LIGHT }}>{c.sub}</span></div>
                <div style={{ fontSize: 11, color: TEXT_MID, marginTop: 5 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        <MagPageFooter />
      </div>

      {/* PAGE 4 — CONTACT */}
      <div style={{ width: W, height: H, background: BG_PAGE, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ height: 4, background: `linear-gradient(to left, ${GOLD}, ${CYAN}, ${GOLD})` }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 80px", position: "relative", zIndex: 2 }}>
          <img src={LOGO} alt="دلمون" style={{ height: 64, objectFit: "contain", marginBottom: 12 }} />
          <div style={{ width: 80, height: 3, background: `linear-gradient(90deg, ${GOLD} 0%, ${CYAN} 100%)`, margin: "0 auto 16px", borderRadius: 2 }} />
          <h2 style={{ color: TEXT_DARK, fontSize: 26, fontWeight: 900, margin: "0 0 6px", textAlign: "center" }}>للاستفسار والحجز</h2>
          <p style={{ color: TEXT_MID, fontSize: 12, margin: "0 0 32px", textAlign: "center" }}>فريقنا جاهز لمساعدتك في اختيار الوحدة المناسبة لنشاطك التجاري</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "المسؤول", value: data.contactName, accent: GOLD },
              { label: "الهاتف", value: data.contactPhone, accent: CYAN },
              { label: "البريد الإلكتروني", value: data.contactEmail, accent: GOLD },
              { label: "الموقع الإلكتروني", value: "www.delmoninvest.com", accent: CYAN },
            ].filter(c => c.value).map((c, i) => (
              <div key={i} style={{ background: BG_PANEL, border: `1px solid ${GOLD_BORDER}`, borderTop: `4px solid ${c.accent}`, borderRadius: 12, padding: "18px 26px", minWidth: 160, textAlign: "center" }}>
                <div style={{ color: c.accent, fontSize: 10, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>{c.label}</div>
                <div style={{ color: TEXT_DARK, fontWeight: 700, fontSize: 13 }}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, padding: "16px 0 0", borderTop: `1px solid ${GOLD_BORDER}`, textAlign: "center", width: "100%" }}>
            <div style={{ color: TEXT_LIGHT, fontSize: 11 }}>المقر الرئيسي: الرياض — حي الروابي | هاتف: 011-2080129</div>
            <div style={{ color: GOLD, fontSize: 12, marginTop: 6, fontWeight: 700 }}>شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY</div>
          </div>
        </div>
        <div style={{ height: 4, background: `linear-gradient(to left, ${GOLD}, ${CYAN}, ${GOLD})` }} />
      </div>
    </div>
  );
}

function MagPageHeader({ name }: { name: string }) {
  return (
    <>
      <div style={{ height: 4, background: `linear-gradient(to left, ${GOLD}, ${CYAN}, ${GOLD})`, flexShrink: 0 }} />
      <div style={{ background: BG_PANEL, padding: "10px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GOLD_BORDER}`, flexShrink: 0 }}>
        <img src={LOGO} alt="دلمون" style={{ height: 32, objectFit: "contain" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: GOLD, fontSize: 12, fontWeight: 900 }}>شركة دلمون للاستثمار</div>
          <div style={{ color: TEXT_LIGHT, fontSize: 9, letterSpacing: 1 }}>DELMON INVESTMENT COMPANY</div>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ color: TEXT_LIGHT, fontSize: 9 }}>{name}</div>
          <div style={{ color: TEXT_LIGHT, fontSize: 9 }}>بروشور التأجير</div>
        </div>
      </div>
    </>
  );
}

function MagPageFooter() {
  return (
    <div style={{ height: 28, background: GOLD, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", flexShrink: 0 }}>
      <span style={{ color: "#fff", fontSize: 9, fontWeight: 600 }}>www.delmoninvest.com | 011-2080129</span>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>شركة دلمون للاستثمار</span>
    </div>
  );
}

function MagSectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, justifyContent: "flex-end" }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: TEXT_DARK }}>{title}</span>
      <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
    </div>
  );
}
