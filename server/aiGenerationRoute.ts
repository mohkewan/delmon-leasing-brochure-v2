/**
 * مسار توليد البروشور بالذكاء الاصطناعي
 * POST /api/ai-brochure/start  — بدء مهمة التوليد
 * GET  /api/ai-brochure/status/:jobId — متابعة حالة المهمة
 * GET  /api/ai-brochure/download/:jobId/:template — تحميل PDF
 */
import { Router, Request, Response } from "express";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import {
  createBrochureJob,
  getBrochureJob,
  getBrochureJobsByUser,
  updateBrochureJob,
  deleteBrochureJob,
} from "./db";
import { classicPrompts, darkPrompts, magazinePrompts, ProjectData } from "./brochurePrompts";
import { sdk } from "./_core/sdk";
import { storageGetSignedUrl } from "./storage";

export const aiGenerationRouter = Router();

// ─── helper: رفع صورة base64 إلى S3 ─────────────────────────────────────────
async function uploadBase64Image(b64: string, filename: string): Promise<string> {
  const match = b64.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid base64 image format");
  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const { url } = await storagePut(`project-images/${filename}`, buffer, mimeType);
  return url;
}

// ─── helper: بناء PDF من مصفوفة URLs صور ─────────────────────────────────────
async function buildPdfFromImageUrls(imageUrls: string[], baseUrl: string): Promise<Buffer> {
  // نستخدم img2pdf عبر Python script مؤقت
  const { execSync } = await import("child_process");
  const { writeFileSync, readFileSync, unlinkSync, mkdtempSync } = await import("fs");
  const { join } = await import("path");
  const os = await import("os");

  const tmpDir = mkdtempSync(join(os.tmpdir(), "brochure-pdf-"));
  const pdfPath = join(tmpDir, "output.pdf");

  // تحميل الصور من S3 إلى ملفات مؤقتة
  const imgPaths: string[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const relUrl = imageUrls[i];
    // تحويل /manus-storage/key إلى signed URL مباشر من S3
    let fetchUrl: string;
    if (relUrl.startsWith("http")) {
      fetchUrl = relUrl;
    } else {
      // استخراج المفتاح من /manus-storage/key_hash.png
      const key = relUrl.replace(/^\/manus-storage\//, "");
      try {
        fetchUrl = await storageGetSignedUrl(key);
      } catch {
        fetchUrl = `${baseUrl}${relUrl}`;
      }
    }
    const resp = await fetch(fetchUrl, { redirect: "follow" });
    if (!resp.ok) throw new Error(`Failed to fetch image: ${relUrl}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    const imgPath = join(tmpDir, `page_${i + 1}.png`);
    writeFileSync(imgPath, buf);
    imgPaths.push(imgPath);
  }

  // بناء PDF
  const imgPathsStr = imgPaths.map(p => `"${p}"`).join(" ");
  execSync(`python3 -c "import img2pdf; open('${pdfPath}', 'wb').write(img2pdf.convert([${imgPaths.map(p => `'${p}'`).join(",")}]))"`, { timeout: 120000 });

  const pdfBuffer = readFileSync(pdfPath);

  // تنظيف الملفات المؤقتة
  try {
    imgPaths.forEach(p => unlinkSync(p));
    unlinkSync(pdfPath);
  } catch {}

  return pdfBuffer;
}

// ─── POST /api/ai-brochure/start ─────────────────────────────────────────────
aiGenerationRouter.post("/start", async (req: Request, res: Response) => {
  try {
    const user = await sdk.authenticateRequest(req).catch(() => null);
    if (!user) {
      res.status(401).json({ error: "يرجى تسجيل الدخول" });
      return;
    }

    const { projectData, projectImageBase64 } = req.body as {
      projectData: ProjectData;
      projectImageBase64?: string;
    };

    if (!projectData?.projectName) {
      res.status(400).json({ error: "بيانات المشروع مطلوبة" });
      return;
    }

    // رفع صورة المشروع إلى S3 إذا وُجدت
    let projectImageUrl: string | undefined;
    if (projectImageBase64 && projectImageBase64.startsWith("data:")) {
      try {
        const safeName = projectData.projectName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_");
        projectImageUrl = await uploadBase64Image(projectImageBase64, `${safeName}_${Date.now()}.png`);
      } catch (e) {
        console.warn("[AI Brochure] Failed to upload project image:", e);
      }
    } else if (projectImageBase64 && projectImageBase64.startsWith("/manus-storage/")) {
      projectImageUrl = projectImageBase64;
    }

    // إنشاء مهمة في قاعدة البيانات
    const jobId = await createBrochureJob({
      userId: user.id,
      projectName: projectData.projectName,
      status: "pending",
      projectData: projectData as any,
      projectImageUrl: projectImageUrl ?? null,
      completedPages: 0,
      totalPages: 21,
    });

    // بدء التوليد في الخلفية (لا ننتظر)
    processJob(jobId, projectData, projectImageUrl, req).catch(err => {
      console.error(`[AI Brochure] Job ${jobId} failed:`, err);
      updateBrochureJob(jobId, { status: "error", errorMessage: String(err) });
    });

    res.json({ jobId, message: "بدأ التوليد — تابع التقدم عبر /status/:jobId" });
  } catch (err) {
    console.error("[AI Brochure] Start error:", err);
    res.status(500).json({ error: "خطأ في بدء التوليد" });
  }
});

// ─── معالجة المهمة في الخلفية ────────────────────────────────────────────────
async function processJob(
  jobId: number,
  projectData: ProjectData,
  projectImageUrl: string | undefined,
  req: Request
): Promise<void> {
  await updateBrochureJob(jobId, { status: "processing", completedPages: 0 });

  const templates = [
    { name: "classic" as const, prompts: classicPrompts(projectData) },
    { name: "dark" as const, prompts: darkPrompts(projectData) },
    { name: "magazine" as const, prompts: magazinePrompts(projectData) },
  ];

  const pageUrls: Record<string, string[]> = { classic: [], dark: [], magazine: [] };
  let completedPages = 0;

  // توليد الصفحات — كل قالب على حدة، كل صفحة بالتسلسل
  for (const template of templates) {
    const urls: string[] = [];
    for (let i = 0; i < template.prompts.length; i++) {
      const prompt = template.prompts[i];
      // إضافة صورة المشروع كمرجع للصفحات التي تحتاجها (ص1، ص2، ص7)
      const useProjectImage = projectImageUrl && [0, 1, 6].includes(i);
      const originalImages = useProjectImage
        ? [{ url: `${req.protocol}://${req.get("host")}${projectImageUrl}` }]
        : undefined;

      try {
        const result = await generateImage({
          prompt,
          ...(originalImages ? { originalImages } : {}),
          model: "MODEL_GPT_IMAGE_2",
          quality: "medium",
        });
        urls.push(result.url ?? "");
      } catch (err) {
        console.error(`[AI Brochure] Page ${i + 1} of ${template.name} failed:`, err);
        urls.push(""); // نكمل بدون الصفحة الفاشلة
      }

      completedPages++;
      await updateBrochureJob(jobId, { completedPages });
    }
    pageUrls[template.name] = urls;
  }

  // بناء ملفات PDF
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const pdfUrls: Record<string, string> = {};

  for (const template of templates) {
    const urls = pageUrls[template.name].filter(Boolean);
    if (urls.length === 0) continue;
    try {
      const pdfBuffer = await buildPdfFromImageUrls(urls, baseUrl);
      const safeName = projectData.projectName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_");
      const { url: pdfUrl } = await storagePut(
        `brochures/${safeName}_${template.name}_${Date.now()}.pdf`,
        pdfBuffer,
        "application/pdf"
      );
      pdfUrls[template.name] = pdfUrl;
    } catch (err) {
      console.error(`[AI Brochure] PDF build failed for ${template.name}:`, err);
    }
  }

  await updateBrochureJob(jobId, {
    status: "done",
    completedPages: 21,
    pageUrls: pageUrls as any,
    pdfUrls: pdfUrls as any,
  });
}

// ─── GET /api/ai-brochure/status/:jobId ──────────────────────────────────────
aiGenerationRouter.get("/status/:jobId", async (req: Request, res: Response) => {
  try {
    const user = await sdk.authenticateRequest(req).catch(() => null);
    if (!user) { res.status(401).json({ error: "يرجى تسجيل الدخول" }); return; }

    const jobId = parseInt(req.params.jobId);
    if (isNaN(jobId)) { res.status(400).json({ error: "معرف المهمة غير صالح" }); return; }

    const job = await getBrochureJob(jobId);
    if (!job || job.userId !== user.id) { res.status(404).json({ error: "المهمة غير موجودة" }); return; }

    res.json({
      id: job.id,
      status: job.status,
      projectName: job.projectName,
      completedPages: job.completedPages,
      totalPages: job.totalPages,
      progress: Math.round((job.completedPages / job.totalPages) * 100),
      pdfUrls: job.pdfUrls,
      pageUrls: job.pageUrls,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (err) {
    console.error("[AI Brochure] Status error:", err);
    res.status(500).json({ error: "خطأ في جلب الحالة" });
  }
});

// ─── GET /api/ai-brochure/list ────────────────────────────────────────────────
aiGenerationRouter.get("/list", async (req: Request, res: Response) => {
  try {
    const user = await sdk.authenticateRequest(req).catch(() => null);
    if (!user) { res.status(401).json({ error: "يرجى تسجيل الدخول" }); return; }
    const jobs = await getBrochureJobsByUser(user.id);
    res.json(jobs.map(j => ({
      id: j.id,
      projectName: j.projectName,
      status: j.status,
      completedPages: j.completedPages,
      totalPages: j.totalPages,
      progress: Math.round((j.completedPages / j.totalPages) * 100),
      pdfUrls: j.pdfUrls,
      createdAt: j.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب القائمة" });
  }
});

// ─── DELETE /api/ai-brochure/:jobId ──────────────────────────────────────────
aiGenerationRouter.delete("/:jobId", async (req: Request, res: Response) => {
  try {
    const user = await sdk.authenticateRequest(req).catch(() => null);
    if (!user) { res.status(401).json({ error: "يرجى تسجيل الدخول" }); return; }
    const jobId = parseInt(req.params.jobId);
    await deleteBrochureJob(jobId, user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الحذف" });
  }
});
