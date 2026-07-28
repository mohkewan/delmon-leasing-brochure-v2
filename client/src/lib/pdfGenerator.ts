import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ProjectData } from "@/pages/Home";

// ===== DELMON PDF GENERATOR =====
// Uses html2canvas to capture the BrochurePreview component and export to PDF
// A4 format, RTL, Cairo font

export async function generateBrochurePDF(data: ProjectData): Promise<void> {
  // Find the brochure content element
  const element = document.getElementById("brochure-content");
  if (!element) {
    throw new Error("Brochure preview element not found");
  }

  // Ensure the preview modal is open (element must be visible)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  // Capture each page section
  const pages = element.querySelectorAll<HTMLElement>(":scope > div");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const A4_W_MM = 210;
  const A4_H_MM = 297;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: A4_WIDTH_PX,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const imgWidth = A4_W_MM;
    const imgHeight = (canvas.height * A4_W_MM) / canvas.width;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, A4_H_MM));
  }

  // Generate filename
  const projectName = data.projectName || "بروشور-التأجير";
  const date = new Date().toISOString().split("T")[0];
  const filename = `بروشور-${projectName}-${date}.pdf`;

  pdf.save(filename);
}

