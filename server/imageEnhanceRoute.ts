import type { Request, Response } from "express";
import sharp from "sharp";

/**
 * POST /api/enhance-image
 * يستقبل صورة كـ base64 data URL، يُحسّنها بـ sharp (تباين + حدة + ضغط)
 * ويُعيدها كـ base64 data URL محسّن
 */
export async function enhanceImageHandler(req: Request, res: Response) {
  try {
    const { imageDataUrl } = req.body as { imageDataUrl?: string };

    if (!imageDataUrl || !imageDataUrl.startsWith("data:")) {
      res.status(400).json({ error: "imageDataUrl مطلوب وبصيغة data URL" });
      return;
    }

    // استخراج الـ base64 من data URL
    const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: "صيغة data URL غير صحيحة" });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const inputBuffer = Buffer.from(base64Data, "base64");

    // تحسين الصورة بـ sharp:
    // 1. تحديد الحجم الأقصى (2000px عرض) مع الحفاظ على النسبة
    // 2. رفع التباين (clahe) لتحسين الوضوح
    // 3. رفع الحدة (sharpen)
    // 4. تحسين الألوان (modulate saturation)
    // 5. ضغط بجودة عالية (90%)
    const enhanced = await sharp(inputBuffer)
      .resize(2000, 2000, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .sharpen({ sigma: 1.2, m1: 0.5, m2: 0.5 })
      .modulate({ saturation: 1.1, brightness: 1.02 })
      .normalise()
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    const enhancedBase64 = enhanced.toString("base64");
    const enhancedDataUrl = `data:image/jpeg;base64,${enhancedBase64}`;

    // إحصائيات للـ logging
    const originalSize = Math.round(inputBuffer.length / 1024);
    const enhancedSize = Math.round(enhanced.length / 1024);
    console.log(`[Image Enhance] ${originalSize}KB → ${enhancedSize}KB (${mimeType})`);

    res.json({ enhancedDataUrl, originalSizeKB: originalSize, enhancedSizeKB: enhancedSize });
  } catch (err) {
    console.error("[Image Enhance Error]", err);
    res.status(500).json({ error: "فشل تحسين الصورة", details: String(err) });
  }
}
