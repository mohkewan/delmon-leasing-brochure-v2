import type { ProjectData } from "@/pages/Home";

// ===== DELMON INVESTMENT — LEASING BROCHURE PREVIEW =====
// Official Brand Identity from DELMON1PPTtemplatev1.pptx
// Deep GOLD: #949437 | Cyan: #8fa9dc | BG: #F0F0F0 / White
// NO dark navy — light background system throughout
// RTL, A4 portrait (794×1123px), print-ready

interface Props {
  data: ProjectData;
}

const LOGO = "/manus-storage/delmon_logo_19a2386c.png";
const GOLD = "#949437";          // Deep GOLD — primary brand color
const GOLD_80 = "#b8b55a";       // 80% tint
const GOLD_40 = "#d4d2a0";       // 40% tint
const CYAN = "#8fa9dc";          // Cyan — secondary brand color
const CYAN_40 = "#c7d6ee";       // 40% tint
const DARK_TEXT = "#2d2d2d";     // Near-black for body text
const MID_TEXT = "#5a5a5a";      // Mid-gray for secondary text
const LIGHT_TEXT = "#8a8a8a";    // Light gray for captions
const BG_PAGE = "#FFFFFF";       // Page background
const BG_SECTION = "#F5F5F3";    // Section background (light warm gray)
const BG_ACCENT = "#F0EFE8";     // Accent background (gold tint)
const BORDER_LIGHT = "#E0DDD0";  // Light border
const BORDER_GOLD = "#C8C580";   // Gold border

export default function BrochurePreview({ data }: Props) {
  const totalArea = data.units.reduce((s, u) => s + (parseFloat(u.area) || 0), 0);
  const today = new Date().toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      id="brochure-content"
      dir="rtl"
      style={{ fontFamily: "'Cairo','Noto Kufi Arabic',sans-serif", background: BG_PAGE, width: 794 }}
    >
      {/* ══════════════════════════════════════════════
          PAGE 1 — COVER
      ══════════════════════════════════════════════ */}
      <div
        style={{
          width: 794,
          minHeight: 1123,
          background: BG_PAGE,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          pageBreakAfter: "always",
        }}
      >
        {/* ── Top bar — GOLD strip ── */}
        <div
          style={{
            background: GOLD,
            padding: "0 48px",
            height: 8,
            flexShrink: 0,
          }}
        />

        {/* ── Header ── */}
        <div
          style={{
            padding: "20px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${BORDER_GOLD}`,
            background: BG_PAGE,
          }}
        >
          <img src={LOGO} alt="دلمون" style={{ height: 56, objectFit: "contain" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
              DELMON INVESTMENT COMPANY
            </div>
            <div style={{ color: LIGHT_TEXT, fontSize: 10, marginTop: 2 }}>
              www.delmoninvest.com
            </div>
          </div>
        </div>

        {/* ── Project image ── */}
        <div
          style={{
            margin: "24px 48px 0",
            borderRadius: 12,
            overflow: "hidden",
            height: data.projectImage ? 340 : 220,
            position: "relative",
            background: data.projectImage ? "transparent" : BG_SECTION,
            border: data.projectImage ? `2px solid ${BORDER_GOLD}` : `2px dashed ${BORDER_GOLD}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.projectImage ? (
            <>
              <img
                src={data.projectImage}
                alt={data.projectName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Subtle gradient overlay for text readability */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)",
                }}
              />
            </>
          ) : (
            <div style={{ color: LIGHT_TEXT, fontSize: 13, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10, color: GOLD_40 }}>🏢</div>
              <div style={{ color: MID_TEXT, fontWeight: 600 }}>صورة المشروع</div>
              <div style={{ color: LIGHT_TEXT, fontSize: 11, marginTop: 4 }}>أضف صورة من نموذج الإدخال</div>
            </div>
          )}
        </div>

        {/* ── Cyan accent bar ── */}
        <div style={{ margin: "0 48px", height: 4, background: CYAN, borderRadius: "0 0 4px 4px", marginTop: 0 }} />

        {/* ── Main content ── */}
        <div style={{ padding: "28px 48px 0", flex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: BG_ACCENT,
              color: GOLD,
              padding: "5px 18px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              border: `1px solid ${BORDER_GOLD}`,
              marginBottom: 16,
            }}
          >
            ● وحدات شاغرة للتأجير
          </div>

          <h1
            style={{
              color: DARK_TEXT,
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.3,
              margin: "0 0 6px",
            }}
          >
            {data.projectName || "اسم المشروع"}
          </h1>

          {data.projectType && (
            <div style={{ color: GOLD, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              {data.projectType}
            </div>
          )}

          {(data.city || data.district) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: MID_TEXT,
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              <span style={{ color: CYAN, fontSize: 16 }}>📍</span>
              {[data.district, data.city].filter(Boolean).join(" — ")}
            </div>
          )}

          {/* Stats cards */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
            {[
              { v: String(data.units.length), l: "وحدة شاغرة" },
              { v: `${totalArea.toLocaleString("ar-SA")} م²`, l: "إجمالي المساحة" },
              ...(data.floors ? [{ v: data.floors, l: "طابق" }] : []),
              ...(data.completionYear ? [{ v: data.completionYear, l: "سنة الإنجاز" }] : []),
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: i === 0 ? GOLD : BG_ACCENT,
                  border: `1px solid ${i === 0 ? GOLD : BORDER_GOLD}`,
                  borderRadius: 10,
                  padding: "14px 22px",
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <div style={{ color: i === 0 ? "#fff" : GOLD, fontSize: 24, fontWeight: 900 }}>{s.v}</div>
                <div style={{ color: i === 0 ? "rgba(255,255,255,0.85)" : MID_TEXT, fontSize: 11, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Amenities */}
          {data.amenities && (
            <div
              style={{
                padding: "16px 20px",
                background: BG_SECTION,
                borderRadius: 10,
                border: `1px solid ${BORDER_LIGHT}`,
                borderRight: `4px solid ${CYAN}`,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {data.amenities
                .split(/[,،]/)
                .slice(0, 6)
                .map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: DARK_TEXT,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ color: GOLD, fontSize: 14, fontWeight: 900 }}>✓</span>
                    {item.trim()}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: "14px 48px",
            borderTop: `1px solid ${BORDER_GOLD}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: BG_SECTION,
          }}
        >
          <span style={{ color: LIGHT_TEXT, fontSize: 10 }}>{today}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: MID_TEXT, fontSize: 10 }}>📞 {data.contactPhone || "011-2080129"}</span>
            <span style={{ color: GOLD, fontSize: 10, fontWeight: 700 }}>
              شركة دلمون للاستثمار
            </span>
          </div>
        </div>
        {/* Bottom gold bar */}
        <div style={{ height: 6, background: GOLD }} />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 2 — PROJECT DETAILS
      ══════════════════════════════════════════════ */}
      <div
        style={{
          width: 794,
          minHeight: 1123,
          background: BG_PAGE,
          display: "flex",
          flexDirection: "column",
          pageBreakAfter: "always",
          position: "relative",
        }}
      >
        <PageHeader name={data.projectName} />

        <div style={{ padding: "32px 48px", flex: 1 }}>
          {/* Section: About */}
          <SectionTitle title="نبذة عن المشروع" />

          <div
            style={{
              background: BG_SECTION,
              borderRadius: 10,
              padding: "18px 22px",
              borderRight: `5px solid ${GOLD}`,
              color: DARK_TEXT,
              fontSize: 14,
              lineHeight: 2.1,
              marginBottom: 28,
            }}
          >
            {data.description || "يرجى إضافة وصف للمشروع من نموذج الإدخال"}
          </div>

          {/* Section: Specs */}
          <SectionTitle title="مواصفات المشروع" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {[
              { label: "اسم المشروع", value: data.projectName },
              { label: "نوع المشروع", value: data.projectType },
              { label: "المدينة", value: data.city },
              { label: "الحي / الموقع", value: data.district },
              {
                label: "إجمالي المساحة",
                value: data.totalArea
                  ? `${parseFloat(data.totalArea).toLocaleString("ar-SA")} م²`
                  : "",
              },
              { label: "عدد الطوابق", value: data.floors },
              { label: "سنة الإنجاز", value: data.completionYear },
              { label: "الوحدات الشاغرة", value: String(data.units.length) },
              {
                label: "إجمالي مساحة الشاغر",
                value: totalArea > 0 ? `${totalArea.toLocaleString("ar-SA")} م²` : "",
              },
            ]
              .filter((x) => x.value)
              .map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: BG_SECTION,
                    borderRadius: 8,
                    padding: "12px 16px",
                    border: `1px solid ${BORDER_LIGHT}`,
                    borderTop: `3px solid ${i % 2 === 0 ? GOLD : CYAN}`,
                  }}
                >
                  <div style={{ fontSize: 10, color: LIGHT_TEXT, marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ color: DARK_TEXT, fontWeight: 800, fontSize: 14 }}>{item.value}</div>
                </div>
              ))}
          </div>

          {/* Section: Amenities */}
          {data.amenities && (
            <>
              <SectionTitle title="المرافق والخدمات المتاحة" />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {data.amenities.split(/[,،]/).map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: i % 2 === 0 ? BG_ACCENT : "#EEF3FA",
                      color: i % 2 === 0 ? GOLD : CYAN,
                      padding: "6px 16px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      border: `1px solid ${i % 2 === 0 ? BORDER_GOLD : CYAN_40}`,
                    }}
                  >
                    ✓ {item.trim()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 3 — VACANT UNITS TABLE
      ══════════════════════════════════════════════ */}
      <div
        style={{
          width: 794,
          minHeight: 1123,
          background: BG_PAGE,
          display: "flex",
          flexDirection: "column",
          pageBreakAfter: "always",
          position: "relative",
        }}
      >
        <PageHeader name={data.projectName} />

        <div style={{ padding: "32px 48px", flex: 1 }}>
          <div style={{ marginBottom: 24 }}>
            <SectionTitle title={`الوحدات الشاغرة — ${data.projectName || "المشروع"}`} />
            <p style={{ color: MID_TEXT, fontSize: 13, margin: 0 }}>
              إجمالي {data.units.length} وحدة شاغرة بمساحة إجمالية{" "}
              {totalArea.toLocaleString("ar-SA")} م²
            </p>
          </div>

          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12.5,
              marginBottom: 24,
              border: `2px solid ${BORDER_GOLD}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                {[
                  "#",
                  "رقم الوحدة",
                  "الطابق",
                  "النوع",
                  "المساحة (م²)",
                  "مدة العقد",
                  "الإيجار السنوي (ر.س)",
                  "السعر / م²",
                  "ملاحظات",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      background: GOLD,
                      color: "#fff",
                      padding: "12px 8px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: 11,
                      borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.2)` : "none",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.units.map((unit, idx) => {
                const annualRent = unit.monthlyRent
                  ? (parseFloat(unit.monthlyRent) * 12).toLocaleString("ar-SA")
                  : "—";
                return (
                  <tr
                    key={unit.id}
                    style={{
                      background: idx % 2 === 0 ? BG_PAGE : BG_SECTION,
                      borderBottom: `1px solid ${BORDER_LIGHT}`,
                    }}
                  >
                    <td style={{ padding: "10px 8px", textAlign: "center", color: GOLD, fontWeight: 800, fontSize: 13, border: `1px solid ${BORDER_LIGHT}` }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, color: DARK_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>
                      {unit.unitNumber || `وحدة ${idx + 1}`}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", color: MID_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>
                      {unit.floor || "—"}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", border: `1px solid ${BORDER_LIGHT}` }}>
                      <span style={{ background: CYAN_40, color: CYAN, padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                        {unit.unitType}
                      </span>
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 800, color: DARK_TEXT, fontSize: 13, border: `1px solid ${BORDER_LIGHT}` }}>
                      {unit.area ? parseFloat(unit.area).toLocaleString("ar-SA") : "—"}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", color: MID_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>
                      {(unit as any).contractDuration || "5 سنوات"}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", color: "#1a7a4a", fontWeight: 700, border: `1px solid ${BORDER_LIGHT}` }}>
                      {annualRent}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", color: MID_TEXT, border: `1px solid ${BORDER_LIGHT}` }}>
                      {unit.pricePerMeter ? `${parseFloat(unit.pricePerMeter).toLocaleString("ar-SA")}` : "—"}
                    </td>
                    <td style={{ padding: "10px 8px", color: LIGHT_TEXT, fontSize: 11, border: `1px solid ${BORDER_LIGHT}` }}>
                      {unit.features || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: BG_ACCENT, borderTop: `2px solid ${GOLD}` }}>
                <td colSpan={4} style={{ padding: "12px 8px", fontWeight: 900, color: GOLD, fontSize: 13, border: `1px solid ${BORDER_GOLD}` }}>
                  الإجمالي
                </td>
                <td style={{ padding: "12px 8px", textAlign: "center", fontWeight: 900, color: GOLD, fontSize: 14, border: `1px solid ${BORDER_GOLD}` }}>
                  {totalArea.toLocaleString("ar-SA")} م²
                </td>
                <td colSpan={4} style={{ border: `1px solid ${BORDER_GOLD}` }} />
              </tr>
            </tfoot>
          </table>

          {/* Summary cards */}
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { label: "إجمالي الوحدات الشاغرة", value: String(data.units.length), sub: "وحدة", accent: GOLD },
              { label: "إجمالي المساحة الشاغرة", value: totalArea.toLocaleString("ar-SA"), sub: "م²", accent: CYAN },
              {
                label: "متوسط مساحة الوحدة",
                value: data.units.length ? Math.round(totalArea / data.units.length).toLocaleString("ar-SA") : "—",
                sub: "م²",
                accent: GOLD_80,
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: BG_SECTION,
                  border: `1px solid ${BORDER_LIGHT}`,
                  borderTop: `4px solid ${c.accent}`,
                  borderRadius: 10,
                  padding: "16px 18px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 900, color: c.accent, lineHeight: 1 }}>
                  {c.value}
                  <span style={{ fontSize: 12, fontWeight: 600, marginRight: 4, color: LIGHT_TEXT }}>{c.sub}</span>
                </div>
                <div style={{ fontSize: 11, color: MID_TEXT, marginTop: 6 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 4 — CONTACT
      ══════════════════════════════════════════════ */}
      <div
        style={{
          width: 794,
          minHeight: 700,
          background: BG_PAGE,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: 8, background: GOLD }} />

        {/* Decorative background shapes */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 794 700"
          preserveAspectRatio="none"
        >
          <circle cx="700" cy="100" r="250" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.15" />
          <circle cx="700" cy="100" r="350" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.10" />
          <circle cx="80" cy="620" r="200" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.10" />
          <path d="M0 580 Q200 520 400 580 T794 500 L794 700 L0 700 Z" fill={GOLD} opacity="0.04" />
        </svg>

        <div style={{ padding: "48px 48px 40px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <img src={LOGO} alt="دلمون" style={{ height: 68, objectFit: "contain", marginBottom: 16 }} />

          {/* Gold divider line */}
          <div style={{ width: 80, height: 3, background: GOLD, margin: "0 auto 20px", borderRadius: 2 }} />

          <h2 style={{ color: DARK_TEXT, fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>
            للاستفسار والحجز
          </h2>
          <p style={{ color: MID_TEXT, fontSize: 13, margin: "0 0 40px" }}>
            فريقنا جاهز لمساعدتك في اختيار الوحدة المناسبة لنشاطك التجاري
          </p>

          <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "المسؤول", value: data.contactName, accent: GOLD },
              { label: "الهاتف", value: data.contactPhone, accent: CYAN },
              { label: "البريد الإلكتروني", value: data.contactEmail, accent: GOLD_80 },
              { label: "الموقع الإلكتروني", value: "www.delmoninvest.com", accent: CYAN },
            ]
              .filter((c) => c.value)
              .map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: BG_SECTION,
                    border: `1px solid ${BORDER_LIGHT}`,
                    borderTop: `4px solid ${c.accent}`,
                    borderRadius: 12,
                    padding: "20px 28px",
                    minWidth: 155,
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: c.accent, fontSize: 10, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>
                    {c.label}
                  </div>
                  <div style={{ color: DARK_TEXT, fontWeight: 700, fontSize: 13 }}>{c.value}</div>
                </div>
              ))}
          </div>

          <div
            style={{
              marginTop: 44,
              padding: "18px 0 0",
              borderTop: `1px solid ${BORDER_GOLD}`,
            }}
          >
            <div style={{ color: LIGHT_TEXT, fontSize: 11 }}>
              المقر الرئيسي: الرياض — حي الروابي | هاتف: 011-2080129
            </div>
            <div style={{ color: GOLD, fontSize: 12, marginTop: 8, fontWeight: 700 }}>
              شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY
            </div>
          </div>
        </div>

        {/* Bottom gold bar */}
        <div style={{ flex: 1 }} />
        <div style={{ height: 8, background: GOLD }} />
      </div>
    </div>
  );
}

/* ─── Shared sub-components ─── */

function PageHeader({ name }: { name: string }) {
  return (
    <>
      {/* Gold top strip */}
      <div style={{ height: 6, background: GOLD }} />
      <div
        style={{
          background: BG_PAGE,
          padding: "12px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BORDER_GOLD}`,
        }}
      >
        <img src={LOGO} alt="دلمون" style={{ height: 36, objectFit: "contain" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: DARK_TEXT, fontWeight: 700, fontSize: 13 }}>
            {name || "بروشور التأجير"}
          </div>
          <div style={{ color: GOLD, fontSize: 10 }}>وحدات شاغرة للتأجير</div>
        </div>
        <div style={{ textAlign: "left", color: LIGHT_TEXT, fontSize: 10 }}>
          <div>www.delmoninvest.com</div>
          <div>011-2080129</div>
        </div>
      </div>
      {/* Cyan accent line */}
      <div style={{ height: 3, background: CYAN }} />
    </>
  );
}

function PageFooter() {
  return (
    <>
      {/* Cyan accent line */}
      <div style={{ height: 3, background: CYAN }} />
      <div
        style={{
          background: BG_SECTION,
          padding: "10px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${BORDER_GOLD}`,
        }}
      >
        <span style={{ color: LIGHT_TEXT, fontSize: 10 }}>
          شركة دلمون للاستثمار | جميع الحقوق محفوظة
        </span>
        <span style={{ color: GOLD, fontSize: 10, fontWeight: 700 }}>
          www.delmoninvest.com
        </span>
      </div>
      {/* Gold bottom bar */}
      <div style={{ height: 5, background: GOLD }} />
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div
        style={{
          width: 5,
          height: 24,
          background: GOLD,
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <h2 style={{ color: DARK_TEXT, fontSize: 16, fontWeight: 900, margin: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: BORDER_GOLD, marginRight: 8 }} />
    </div>
  );
}
