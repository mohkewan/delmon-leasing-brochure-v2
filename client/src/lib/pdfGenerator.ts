import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ProjectData } from "@/pages/Home";

// ===== DELMON PDF GENERATOR =====
// Strategy: renders a hidden off-screen clone of BrochurePreview,
// captures each page with html2canvas at 3× scale, exports to A4 Landscape PDF.
// Output: A4 Landscape (297×210mm) — matching the reference brochure format.

export async function generateBrochurePDF(data: ProjectData): Promise<void> {
  // ── 1. Find or create the brochure container ──────────────────────────────
  let container = document.getElementById("pdf-render-container");
  let wasCreated = false;

  if (!container) {
    container = document.createElement("div");
    container.id = "pdf-render-container";
    container.style.cssText = `
      position: fixed;
      top: 0; left: -9999px;
      width: 1123px;
      visibility: hidden;
      pointer-events: none;
      z-index: -1;
      font-family: 'Cairo', 'Noto Kufi Arabic', sans-serif;
    `;
    document.body.appendChild(container);
    wasCreated = true;
  }

  // ── 2. Find the brochure content (in modal or in mini-preview) ────────────
  let source = document.getElementById("brochure-content");
  if (!source) {
    if (wasCreated) document.body.removeChild(container);
    throw new Error("لم يتم العثور على محتوى البروشور");
  }

  // Clone the brochure into the off-screen container
  container.innerHTML = "";
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    width: 1123px;
    font-family: 'Cairo', 'Noto Kufi Arabic', sans-serif;
    direction: rtl;
    background: #fff;
  `;
  container.appendChild(clone);

  // ── 3. Wait for fonts & images to settle ─────────────────────────────────
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 400));

  // ── 4. Capture each page ──────────────────────────────────────────────────
  const pages = clone.querySelectorAll<HTMLElement>(":scope > div");
  if (pages.length === 0) {
    if (wasCreated) document.body.removeChild(container);
    throw new Error("لا توجد صفحات في البروشور");
  }

  // A4 Landscape: 297mm × 210mm
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const A4_W = 297;
  const A4_H = 210;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement;

    const canvas = await html2canvas(page, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 1123,
      logging: false,
      imageTimeout: 10000,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.97);
    const imgH = (canvas.height / canvas.width) * A4_W;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, A4_W, Math.min(imgH, A4_H), undefined, "FAST");
  }

  // ── 5. Save & cleanup ─────────────────────────────────────────────────────
  const name = data.projectName || "بروشور-التأجير";
  const city = data.city ? `-${data.city}` : "";
  const date = new Date().toISOString().split("T")[0];
  pdf.save(`بروشور-دلمون-${name}${city}-${date}.pdf`);

  if (wasCreated) document.body.removeChild(container);
}
