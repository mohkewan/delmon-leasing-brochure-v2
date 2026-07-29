import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import React from "react";
import type { ProjectData } from "@/lib/brochureTypes";
import type { BrochureTemplate } from "@/lib/brochureTypes";

// ===== DELMON PDF GENERATOR =====
// Strategy: renders the correct template component into a hidden off-screen div,
// captures each page with html2canvas at 3× scale, exports to A4 Landscape PDF.
// Output: A4 Landscape (297×210mm) — matching the reference brochure format.

export async function generateBrochurePDF(
  data: ProjectData,
  template: BrochureTemplate = "classic"
): Promise<void> {
  // ── 1. Dynamically import the correct template component ─────────────────
  let PreviewComponent: React.ComponentType<{ data: ProjectData }>;
  if (template === "dark") {
    const mod = await import("@/components/BrochurePreviewDark");
    PreviewComponent = mod.default;
  } else if (template === "magazine") {
    const mod = await import("@/components/BrochurePreviewMagazine");
    PreviewComponent = mod.default;
  } else {
    const mod = await import("@/components/BrochurePreview");
    PreviewComponent = mod.default;
  }

  // ── 2. Create an off-screen container ─────────────────────────────────────
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: -9999px;
    width: 1123px;
    visibility: hidden;
    pointer-events: none;
    z-index: -1;
    font-family: 'Cairo', 'Noto Kufi Arabic', sans-serif;
  `;
  document.body.appendChild(container);

  // ── 3. Render the component into the container ────────────────────────────
  const root = createRoot(container);
  await new Promise<void>((resolve) => {
    root.render(
      React.createElement(PreviewComponent, { data })
    );
    // Wait for React to flush + fonts/images to settle
    setTimeout(resolve, 800);
  });

  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));

  // ── 4. Find the brochure content wrapper ──────────────────────────────────
  const brochureEl = container.querySelector<HTMLElement>("#brochure-content");
  if (!brochureEl) {
    root.unmount();
    document.body.removeChild(container);
    throw new Error("لم يتم العثور على محتوى البروشور");
  }

  // ── 5. Capture each page ──────────────────────────────────────────────────
  const pages = brochureEl.querySelectorAll<HTMLElement>(":scope > div");
  if (pages.length === 0) {
    root.unmount();
    document.body.removeChild(container);
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
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const imgH = (canvas.height / canvas.width) * A4_W;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, A4_W, Math.min(imgH, A4_H), undefined, "FAST");
  }

  // ── 6. Save & cleanup ─────────────────────────────────────────────────────
  const name = data.projectName || "بروشور-التأجير";
  const city = data.city ? `-${data.city}` : "";
  const date = new Date().toISOString().split("T")[0];
  pdf.save(`بروشور-دلمون-${name}${city}-${date}.pdf`);

  root.unmount();
  document.body.removeChild(container);
}
