import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ProjectData } from "@/pages/Home";

// ===== DELMON PDF GENERATOR =====
// Strategy: renders a hidden off-screen clone of BrochurePreview,
// captures each page with html2canvas at 2× scale, exports to A4 PDF.
// Works regardless of whether the preview modal is open or closed.

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
      width: 794px;
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
    width: 794px;
    font-family: 'Cairo', 'Noto Kufi Arabic', sans-serif;
    direction: rtl;
    background: #fff;
  `;
  container.appendChild(clone);

  // ── 3. Wait for fonts & images to settle ─────────────────────────────────
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));

  // ── 4. Capture each page ──────────────────────────────────────────────────
  const pages = clone.querySelectorAll<HTMLElement>(":scope > div");
  if (pages.length === 0) {
    if (wasCreated) document.body.removeChild(container);
    throw new Error("لا توجد صفحات في البروشور");
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const A4_W = 210;
  const A4_H = 297;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement;

    const canvas = await html2canvas(page, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 794,
      logging: false,
      imageTimeout: 10000,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.97);
    const imgH = (canvas.height * A4_W) / canvas.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, A4_W, Math.min(imgH, A4_H));
  }

  // ── 5. Save & cleanup ─────────────────────────────────────────────────────
  const name = data.projectName || "بروشور-التأجير";
  const date = new Date().toISOString().split("T")[0];
  pdf.save(`بروشور-${name}-${date}.pdf`);

  if (wasCreated) document.body.removeChild(container);
}
