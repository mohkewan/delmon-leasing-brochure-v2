import type { ProjectData } from "@/pages/Home";

// ===== DELMON INVESTMENT BROCHURE PREVIEW =====
// Mirrors the PDF output exactly - Navy #1A2E5A, Gold #C9A84C, Cairo font
// RTL layout, A4 proportions

interface Props {
  data: ProjectData;
}

const LOGO_URL = "/manus-storage/delmon_logo_19a2386c.png";
const DELMON_NAVY = "#1A2E5A";
const DELMON_GOLD = "#C9A84C";

export default function BrochurePreview({ data }: Props) {
  const totalArea = data.units.reduce((sum, u) => sum + (parseFloat(u.area) || 0), 0);
  const today = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div
      id="brochure-content"
      dir="rtl"
      style={{
        fontFamily: "'Cairo', 'Noto Kufi Arabic', sans-serif",
        width: "794px",
        background: "#fff",
        color: DELMON_NAVY,
      }}
    >
      {/* ===== PAGE 1: COVER ===== */}
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          background: DELMON_NAVY,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(201,168,76,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(201,168,76,0.10) 0%, transparent 50%)`,
          }}
        />
        {/* Diagonal accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "300px",
            background: "linear-gradient(135deg, transparent 60%, rgba(201,168,76,0.12) 100%)",
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "40px 48px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
          }}
        >
          <img src={LOGO_URL} alt="دلمون" style={{ height: "70px", objectFit: "contain" }} />
          <div style={{ textAlign: "left", color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
            <div>DELMON INVESTMENT COMPANY</div>
            <div>www.delmoninvest.com</div>
          </div>
        </div>

        {/* Project image */}
        {data.projectImage && (
          <div
            style={{
              margin: "32px 48px 0",
              borderRadius: "16px",
              overflow: "hidden",
              height: "320px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <img
              src={data.projectImage}
              alt={data.projectName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 50%, rgba(26,46,90,0.7) 100%)",
              }}
            />
          </div>
        )}

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: "40px 48px",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: DELMON_GOLD,
              color: DELMON_NAVY,
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "20px",
              width: "fit-content",
            }}
          >
            وحدات شاغرة للتأجير
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "42px",
              fontWeight: "900",
              lineHeight: "1.3",
              margin: "0 0 8px",
            }}
          >
            {data.projectName || "اسم المشروع"}
          </h1>

          {data.projectType && (
            <div style={{ color: DELMON_GOLD, fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
              {data.projectType}
            </div>
          )}

          {(data.city || data.district) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "15px",
                marginBottom: "32px",
              }}
            >
              <span>📍</span>
              <span>{[data.district, data.city].filter(Boolean).join(" - ")}</span>
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "عدد الوحدات", value: data.units.length.toString() },
              { label: "إجمالي المساحة", value: `${totalArea.toLocaleString("ar-SA")} م²` },
              ...(data.floors ? [{ label: "عدد الطوابق", value: data.floors }] : []),
              ...(data.completionYear ? [{ label: "سنة الإنجاز", value: data.completionYear }] : []),
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid rgba(201,168,76,0.3)`,
                  borderRadius: "12px",
                  padding: "12px 20px",
                  textAlign: "center",
                  minWidth: "100px",
                }}
              >
                <div style={{ color: DELMON_GOLD, fontSize: "22px", fontWeight: "800" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid rgba(201,168,76,0.3)`,
            padding: "16px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{today}</span>
          <span style={{ color: DELMON_GOLD, fontSize: "11px", fontWeight: "600" }}>
            شركة دلمون للاستثمار | DELMON INVESTMENT COMPANY
          </span>
        </div>
      </div>

      {/* ===== PAGE 2: PROJECT DETAILS ===== */}
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          padding: "0",
          pageBreakBefore: "always",
        }}
      >
        {/* Page header */}
        <PageHeader projectName={data.projectName} />

        <div style={{ padding: "32px 48px" }}>
          <SectionTitle title="نبذة عن المشروع" />

          {data.description && (
            <p
              style={{
                color: "#374151",
                fontSize: "14px",
                lineHeight: "2",
                marginBottom: "28px",
                background: "#F8F9FD",
                padding: "16px 20px",
                borderRadius: "10px",
                borderRight: `4px solid ${DELMON_GOLD}`,
              }}
            >
              {data.description}
            </p>
          )}

          {/* Project specs grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            {[
              { label: "اسم المشروع", value: data.projectName },
              { label: "نوع المشروع", value: data.projectType },
              { label: "المدينة", value: data.city },
              { label: "الحي / الموقع", value: data.district },
              { label: "إجمالي المساحة", value: data.totalArea ? `${parseFloat(data.totalArea).toLocaleString("ar-SA")} م²` : "" },
              { label: "عدد الطوابق", value: data.floors },
              { label: "سنة الإنجاز", value: data.completionYear },
              { label: "عدد الوحدات الشاغرة", value: data.units.length.toString() },
            ]
              .filter((item) => item.value)
              .map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#F8F9FD",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    border: "1px solid #E8EAF0",
                  }}
                >
                  <div style={{ color: "#9CA3AF", fontSize: "11px", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ color: DELMON_NAVY, fontWeight: "700", fontSize: "14px" }}>{item.value}</div>
                </div>
              ))}
          </div>

          {data.amenities && (
            <>
              <SectionTitle title="المرافق والخدمات" />
              <div
                style={{
                  background: "#F8F9FD",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  border: "1px solid #E8EAF0",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {data.amenities.split(/[,،]/).map((item, i) => (
                    <span
                      key={i}
                      style={{
                        background: `${DELMON_NAVY}10`,
                        color: DELMON_NAVY,
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: `1px solid ${DELMON_NAVY}20`,
                      }}
                    >
                      ✓ {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <PageFooter />
      </div>

      {/* ===== PAGE 3: UNITS TABLE ===== */}
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          pageBreakBefore: "always",
        }}
      >
        <PageHeader projectName={data.projectName} />

        <div style={{ padding: "32px 48px" }}>
          <SectionTitle title="جدول الوحدات الشاغرة" />

          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              marginBottom: "28px",
            }}
          >
            <thead>
              <tr style={{ background: DELMON_NAVY }}>
                {["#", "رقم الوحدة", "الطابق", "النوع", "المساحة (م²)", "الإيجار الشهري", "السعر/م²", "المميزات"].map(
                  (h, i) => (
                    <th
                      key={i}
                      style={{
                        color: "#fff",
                        padding: "12px 10px",
                        textAlign: "right",
                        fontWeight: "700",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.units.map((unit, idx) => (
                <tr
                  key={unit.id}
                  style={{
                    background: idx % 2 === 0 ? "#F8F9FD" : "#fff",
                    borderBottom: "1px solid #E8EAF0",
                  }}
                >
                  <td style={{ padding: "11px 10px", color: DELMON_GOLD, fontWeight: "700", textAlign: "center" }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: "11px 10px", fontWeight: "600", color: DELMON_NAVY }}>
                    {unit.unitNumber || `وحدة ${idx + 1}`}
                  </td>
                  <td style={{ padding: "11px 10px", color: "#374151" }}>{unit.floor || "—"}</td>
                  <td style={{ padding: "11px 10px" }}>
                    <span
                      style={{
                        background: `${DELMON_NAVY}15`,
                        color: DELMON_NAVY,
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {unit.unitType}
                    </span>
                  </td>
                  <td style={{ padding: "11px 10px", fontWeight: "700", color: DELMON_NAVY, textAlign: "center" }}>
                    {unit.area ? parseFloat(unit.area).toLocaleString("ar-SA") : "—"}
                  </td>
                  <td style={{ padding: "11px 10px", color: "#059669", fontWeight: "600", textAlign: "center" }}>
                    {unit.monthlyRent
                      ? `${parseFloat(unit.monthlyRent).toLocaleString("ar-SA")} ر.س`
                      : "—"}
                  </td>
                  <td style={{ padding: "11px 10px", color: "#374151", textAlign: "center" }}>
                    {unit.pricePerMeter
                      ? `${parseFloat(unit.pricePerMeter).toLocaleString("ar-SA")} ر.س`
                      : "—"}
                  </td>
                  <td style={{ padding: "11px 10px", color: "#6B7280", fontSize: "11px" }}>
                    {unit.features || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr style={{ background: `${DELMON_GOLD}20`, borderTop: `2px solid ${DELMON_GOLD}` }}>
                <td colSpan={4} style={{ padding: "12px 10px", fontWeight: "800", color: DELMON_NAVY }}>
                  الإجمالي
                </td>
                <td
                  style={{
                    padding: "12px 10px",
                    fontWeight: "800",
                    color: DELMON_NAVY,
                    textAlign: "center",
                  }}
                >
                  {totalArea.toLocaleString("ar-SA")} م²
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>

          {/* Summary cards */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "إجمالي الوحدات", value: data.units.length.toString(), color: DELMON_NAVY },
              { label: "إجمالي المساحة", value: `${totalArea.toLocaleString("ar-SA")} م²`, color: DELMON_NAVY },
              {
                label: "متوسط مساحة الوحدة",
                value: data.units.length
                  ? `${Math.round(totalArea / data.units.length).toLocaleString("ar-SA")} م²`
                  : "—",
                color: DELMON_NAVY,
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  flex: "1",
                  minWidth: "160px",
                  background: `${DELMON_NAVY}08`,
                  border: `1px solid ${DELMON_NAVY}20`,
                  borderRadius: "12px",
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "900", color: card.color }}>{card.value}</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>{card.label}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter />
      </div>

      {/* ===== PAGE 4: CONTACT ===== */}
      <div
        style={{
          width: "794px",
          minHeight: "600px",
          background: DELMON_NAVY,
          pageBreakBefore: "always",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(201,168,76,0.15) 0%, transparent 50%)`,
          }}
        />

        <div style={{ padding: "60px 48px", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <img src={LOGO_URL} alt="دلمون" style={{ height: "80px", objectFit: "contain", marginBottom: "16px" }} />
            <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", margin: "0 0 8px" }}>
              تواصل معنا
            </h2>
            <div style={{ color: DELMON_GOLD, fontSize: "14px" }}>نحن هنا لمساعدتك في اختيار الوحدة المناسبة</div>
          </div>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "👤", label: "المسؤول", value: data.contactName },
              { icon: "📞", label: "الهاتف", value: data.contactPhone },
              { icon: "✉️", label: "البريد الإلكتروني", value: data.contactEmail },
              { icon: "🌐", label: "الموقع الإلكتروني", value: "www.delmoninvest.com" },
            ]
              .filter((c) => c.value)
              .map((contact, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: `1px solid rgba(201,168,76,0.3)`,
                    borderRadius: "16px",
                    padding: "20px 28px",
                    textAlign: "center",
                    minWidth: "160px",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{contact.icon}</div>
                  <div style={{ color: DELMON_GOLD, fontSize: "11px", marginBottom: "6px" }}>{contact.label}</div>
                  <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{contact.value}</div>
                </div>
              ))}
          </div>

          <div
            style={{
              marginTop: "48px",
              textAlign: "center",
              borderTop: `1px solid rgba(201,168,76,0.3)`,
              paddingTop: "24px",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
              المقر الرئيسي: الرياض - حي الروابي | هاتف: 011-2080129
            </div>
            <div style={{ color: DELMON_GOLD, fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>
              شركة دلمون للاستثمار — DELMON INVESTMENT COMPANY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== REUSABLE COMPONENTS =====

function PageHeader({ projectName }: { projectName: string }) {
  return (
    <div
      style={{
        background: DELMON_NAVY,
        padding: "16px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img src={LOGO_URL} alt="دلمون" style={{ height: "40px", objectFit: "contain" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>{projectName || "بروشور التأجير"}</div>
        <div style={{ color: DELMON_GOLD, fontSize: "10px" }}>وحدات شاغرة للتأجير</div>
      </div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textAlign: "left" }}>
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
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: DELMON_NAVY,
        padding: "12px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>
        شركة دلمون للاستثمار | جميع الحقوق محفوظة
      </span>
      <span style={{ color: DELMON_GOLD, fontSize: "10px", fontWeight: "600" }}>
        www.delmoninvest.com
      </span>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "4px",
          height: "28px",
          background: DELMON_GOLD,
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          color: DELMON_NAVY,
          fontSize: "18px",
          fontWeight: "800",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}
