import type { ProjectData } from "@/pages/Home";

// ===== DELMON INVESTMENT — LEASING BROCHURE PREVIEW =====
// Design: Navy #1A2E5A | Gold #C9A84C | White | Cairo font
// Structure: Cover → Project Details → Units Table → Contact
// RTL, A4 (794×1123px), print-ready

interface Props {
  data: ProjectData;
}

const LOGO = "/manus-storage/delmon_logo_19a2386c.png";
const NAVY = "#1A2E5A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#F5EDD3";
const GRAY_BG = "#F4F6FB";
const BORDER = "#DDE2EF";

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
      style={{ fontFamily: "'Cairo','Noto Kufi Arabic',sans-serif", background: "#fff", width: 794 }}
    >
      {/* ══════════════════════════════════════════════
          PAGE 1 — COVER
      ══════════════════════════════════════════════ */}
      <div
        style={{
          width: 794,
          minHeight: 1123,
          background: NAVY,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          pageBreakAfter: "always",
        }}
      >
        {/* Decorative arcs */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 794 1123"
          preserveAspectRatio="none"
        >
          <circle cx="760" cy="80" r="200" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.15" />
          <circle cx="760" cy="80" r="280" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.10" />
          <circle cx="40" cy="1050" r="180" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.12" />
          <path d="M0 900 Q200 820 400 900 T794 820 L794 1123 L0 1123 Z" fill={GOLD} opacity="0.06" />
        </svg>

        {/* ── Top bar ── */}
        <div
          style={{
            padding: "28px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid rgba(201,168,76,0.25)`,
            position: "relative",
            zIndex: 2,
          }}
        >
          <img src={LOGO} alt="دلمون" style={{ height: 60, objectFit: "contain" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
              DELMON INVESTMENT COMPANY
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>
              www.delmoninvest.com
            </div>
          </div>
        </div>

        {/* ── Project image ── */}
        <div
          style={{
            margin: "28px 48px 0",
            borderRadius: 16,
            overflow: "hidden",
            height: data.projectImage ? 360 : 200,
            position: "relative",
            zIndex: 2,
            background: data.projectImage ? "transparent" : "rgba(255,255,255,0.05)",
            border: data.projectImage ? "none" : `2px dashed rgba(201,168,76,0.3)`,
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 40%, rgba(26,46,90,0.85) 100%)",
                }}
              />
            </>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
              أضف صورة المشروع
            </div>
          )}
        </div>

        {/* ── Main headline ── */}
        <div style={{ padding: "32px 48px 0", position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: GOLD,
              color: NAVY,
              padding: "5px 18px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            ● وحدات شاغرة للتأجير
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: 48,
              fontWeight: 900,
              lineHeight: 1.25,
              margin: "0 0 6px",
            }}
          >
            {data.projectName || "اسم المشروع"}
          </h1>

          {data.projectType && (
            <div style={{ color: GOLD, fontSize: 20, fontWeight: 700, marginBottom: 14 }}>
              {data.projectType}
            </div>
          )}

          {(data.city || data.district) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255,255,255,0.75)",
                fontSize: 15,
                marginBottom: 28,
              }}
            >
              <span style={{ color: GOLD }}>📍</span>
              {[data.district, data.city].filter(Boolean).join(" — ")}
            </div>
          )}

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
            {[
              { v: String(data.units.length), l: "وحدة شاغرة" },
              { v: `${totalArea.toLocaleString("ar-SA")} م²`, l: "إجمالي المساحة" },
              ...(data.floors ? [{ v: data.floors, l: "طابق" }] : []),
              ...(data.completionYear ? [{ v: data.completionYear, l: "سنة الإنجاز" }] : []),
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: `1px solid rgba(201,168,76,0.35)`,
                  borderRadius: 12,
                  padding: "14px 22px",
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <div style={{ color: GOLD, fontSize: 26, fontWeight: 900 }}>{s.v}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature icons row ── */}
        {data.amenities && (
          <div
            style={{
              margin: "0 48px",
              padding: "20px 24px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              border: `1px solid rgba(201,168,76,0.2)`,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              position: "relative",
              zIndex: 2,
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
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: GOLD, fontSize: 14 }}>✓</span>
                  {item.trim()}
                </div>
              ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: "16px 48px",
            borderTop: `1px solid rgba(201,168,76,0.25)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{today}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>📞 {data.contactPhone || "011-2080129"}</span>
            <span style={{ color: GOLD, fontSize: 10, fontWeight: 700 }}>
              شركة دلمون للاستثمار
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 2 — PROJECT DETAILS
      ══════════════════════════════════════════════ */}
      <div
        style={{
          width: 794,
          minHeight: 1123,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          pageBreakAfter: "always",
          position: "relative",
        }}
      >
        <PageHeader name={data.projectName} />

        <div style={{ padding: "36px 48px", flex: 1 }}>
          {/* Section: About */}
          <SectionTitle title="نبذة عن المشروع" />

          {data.description ? (
            <div
              style={{
                background: GRAY_BG,
                borderRadius: 12,
                padding: "18px 22px",
                borderRight: `5px solid ${GOLD}`,
                color: "#374151",
                fontSize: 14,
                lineHeight: 2.1,
                marginBottom: 32,
              }}
            >
              {data.description}
            </div>
          ) : (
            <div
              style={{
                background: GRAY_BG,
                borderRadius: 12,
                padding: "18px 22px",
                borderRight: `5px solid ${GOLD}`,
                color: "#9CA3AF",
                fontSize: 13,
                marginBottom: 32,
              }}
            >
              يرجى إضافة وصف للمشروع من نموذج الإدخال
            </div>
          )}

          {/* Section: Specs */}
          <SectionTitle title="مواصفات المشروع" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginBottom: 32,
            }}
          >
            {[
              { icon: "🏢", label: "اسم المشروع", value: data.projectName },
              { icon: "📋", label: "نوع المشروع", value: data.projectType },
              { icon: "📍", label: "المدينة", value: data.city },
              { icon: "🗺️", label: "الحي / الموقع", value: data.district },
              {
                icon: "📐",
                label: "إجمالي المساحة",
                value: data.totalArea
                  ? `${parseFloat(data.totalArea).toLocaleString("ar-SA")} م²`
                  : "",
              },
              { icon: "🏗️", label: "عدد الطوابق", value: data.floors },
              { icon: "📅", label: "سنة الإنجاز", value: data.completionYear },
              { icon: "🔑", label: "الوحدات الشاغرة", value: String(data.units.length) },
              {
                icon: "📏",
                label: "إجمالي مساحة الشاغر",
                value: totalArea > 0 ? `${totalArea.toLocaleString("ar-SA")} م²` : "",
              },
            ]
              .filter((x) => x.value)
              .map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: GRAY_BG,
                    borderRadius: 10,
                    padding: "14px 16px",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{ color: NAVY, fontWeight: 800, fontSize: 14 }}>{item.value}</div>
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
                  marginBottom: 32,
                }}
              >
                {data.amenities.split(/[,،]/).map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: GOLD_LIGHT,
                      color: NAVY,
                      padding: "6px 16px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      border: `1px solid ${GOLD}55`,
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
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          pageBreakAfter: "always",
          position: "relative",
        }}
      >
        <PageHeader name={data.projectName} />

        <div style={{ padding: "36px 48px", flex: 1 }}>
          {/* Title */}
          <div style={{ marginBottom: 28 }}>
            <SectionTitle title={`الوحدات الشاغرة — ${data.projectName || "المشروع"}`} />
            <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>
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
              marginBottom: 28,
              border: `2px solid ${NAVY}`,
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
                      background: NAVY,
                      color: "#fff",
                      padding: "12px 8px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: 11,
                      borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.15)` : "none",
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
                      background: idx % 2 === 0 ? GRAY_BG : "#fff",
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        color: GOLD,
                        fontWeight: 800,
                        fontSize: 13,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: NAVY,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {unit.unitNumber || `وحدة ${idx + 1}`}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        color: "#374151",
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {unit.floor || "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <span
                        style={{
                          background: `${NAVY}15`,
                          color: NAVY,
                          padding: "3px 10px",
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {unit.unitType}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        fontWeight: 800,
                        color: NAVY,
                        fontSize: 13,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {unit.area
                        ? parseFloat(unit.area).toLocaleString("ar-SA")
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        color: "#374151",
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      5 سنوات
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        color: "#059669",
                        fontWeight: 700,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {annualRent}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        textAlign: "center",
                        color: "#374151",
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {unit.pricePerMeter
                        ? `${parseFloat(unit.pricePerMeter).toLocaleString("ar-SA")}`
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 8px",
                        color: "#6B7280",
                        fontSize: 11,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {unit.features || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr
                style={{
                  background: `${GOLD}22`,
                  borderTop: `2px solid ${GOLD}`,
                }}
              >
                <td
                  colSpan={4}
                  style={{
                    padding: "13px 8px",
                    fontWeight: 900,
                    color: NAVY,
                    fontSize: 13,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  الإجمالي
                </td>
                <td
                  style={{
                    padding: "13px 8px",
                    textAlign: "center",
                    fontWeight: 900,
                    color: NAVY,
                    fontSize: 14,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {totalArea.toLocaleString("ar-SA")} م²
                </td>
                <td colSpan={4} style={{ border: `1px solid ${BORDER}` }} />
              </tr>
            </tfoot>
          </table>

          {/* Summary cards */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "إجمالي الوحدات الشاغرة", value: String(data.units.length), sub: "وحدة" },
              {
                label: "إجمالي المساحة الشاغرة",
                value: totalArea.toLocaleString("ar-SA"),
                sub: "م²",
              },
              {
                label: "متوسط مساحة الوحدة",
                value: data.units.length
                  ? Math.round(totalArea / data.units.length).toLocaleString("ar-SA")
                  : "—",
                sub: "م²",
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: GRAY_BG,
                  border: `1px solid ${BORDER}`,
                  borderTop: `4px solid ${i === 0 ? NAVY : GOLD}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: i === 0 ? NAVY : GOLD,
                    lineHeight: 1,
                  }}
                >
                  {c.value}
                  <span style={{ fontSize: 13, fontWeight: 600, marginRight: 4, color: "#6B7280" }}>
                    {c.sub}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>{c.label}</div>
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
          background: NAVY,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 794 700"
          preserveAspectRatio="none"
        >
          <circle cx="700" cy="100" r="250" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.12" />
          <circle cx="100" cy="600" r="200" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.10" />
        </svg>

        <div style={{ padding: "56px 48px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <img src={LOGO} alt="دلمون" style={{ height: 72, objectFit: "contain", marginBottom: 20 }} />
          <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 900, margin: "0 0 8px" }}>
            للاستفسار والحجز
          </h2>
          <p style={{ color: GOLD, fontSize: 14, margin: "0 0 48px" }}>
            فريقنا جاهز لمساعدتك في اختيار الوحدة المناسبة لنشاطك التجاري
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "👤", label: "المسؤول", value: data.contactName },
              { icon: "📞", label: "الهاتف", value: data.contactPhone },
              { icon: "✉️", label: "البريد الإلكتروني", value: data.contactEmail },
              { icon: "🌐", label: "الموقع الإلكتروني", value: "www.delmoninvest.com" },
            ]
              .filter((c) => c.value)
              .map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1px solid rgba(201,168,76,0.35)`,
                    borderRadius: 16,
                    padding: "22px 30px",
                    minWidth: 160,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ color: GOLD, fontSize: 11, marginBottom: 6, fontWeight: 700 }}>
                    {c.label}
                  </div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{c.value}</div>
                </div>
              ))}
          </div>

          <div
            style={{
              marginTop: 48,
              padding: "20px 0 0",
              borderTop: `1px solid rgba(201,168,76,0.25)`,
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
              المقر الرئيسي: الرياض — حي الروابي | هاتف: 011-2080129
            </div>
            <div style={{ color: GOLD, fontSize: 12, marginTop: 8, fontWeight: 700 }}>
              شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared sub-components ─── */

function PageHeader({ name }: { name: string }) {
  return (
    <div
      style={{
        background: NAVY,
        padding: "14px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img src={LOGO} alt="دلمون" style={{ height: 38, objectFit: "contain" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
          {name || "بروشور التأجير"}
        </div>
        <div style={{ color: GOLD, fontSize: 10 }}>وحدات شاغرة للتأجير</div>
      </div>
      <div style={{ textAlign: "left", color: "rgba(255,255,255,0.45)", fontSize: 10 }}>
        <div>www.delmoninvest.com</div>
        <div>011-2080129</div>
      </div>
    </div>
  );
}

function PageFooter() {
  return (
    <div
      style={{
        background: NAVY,
        padding: "12px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
        شركة دلمون للاستثمار | جميع الحقوق محفوظة
      </span>
      <span style={{ color: GOLD, fontSize: 10, fontWeight: 700 }}>
        www.delmoninvest.com
      </span>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <div
        style={{
          width: 5,
          height: 26,
          background: GOLD,
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <h2 style={{ color: NAVY, fontSize: 17, fontWeight: 900, margin: 0 }}>{title}</h2>
    </div>
  );
}
