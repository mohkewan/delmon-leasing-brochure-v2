import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { saveBrochure, getBrochuresByUser, getBrochureById, deleteBrochure, trackEvent, getAnalyticsSummary, getUnitsByBrochureId, replaceAllUnits, getOrCreateBrochure, updateBrochureData } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  brochures: router({
    // حفظ بروشور جديد في الأرشيف
    save: protectedProcedure
      .input(z.object({
        projectName: z.string(),
        projectType: z.string().optional(),
        city: z.string().optional(),
        data: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        await saveBrochure({
          userId: ctx.user.id,
          projectName: input.projectName,
          projectType: input.projectType ?? null,
          city: input.city ?? null,
          data: input.data,
        });
        return { success: true };
      }),

    // جلب كل البروشورات الخاصة بالمستخدم
    list: protectedProcedure.query(async ({ ctx }) => {
      return getBrochuresByUser(ctx.user.id);
    }),

    // جلب بروشور واحد بالـ id
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const brochure = await getBrochureById(input.id);
        if (!brochure || brochure.userId !== ctx.user.id) return null;
        return brochure;
      }),

    // حذف بروشور
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteBrochure(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  analytics: router({
    // تسجيل حدث استخدام (public — لا يتطلب تسجيل دخول)
    track: publicProcedure
      .input(z.object({
        eventType: z.enum(["pdf_export", "json_export", "excel_export", "archive_save"]),
        template: z.string().optional(),
        projectName: z.string().optional(),
        projectType: z.string().optional(),
        city: z.string().optional(),
        unitsCount: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await trackEvent({
          userId: ctx.user?.id ?? null,
          eventType: input.eventType,
          template: input.template ?? null,
          projectName: input.projectName ?? null,
          projectType: input.projectType ?? null,
          city: input.city ?? null,
          unitsCount: input.unitsCount ?? null,
        });
        return { success: true };
      }),

    // جلب ملخص الإحصاءات (للمدير فقط)
    summary: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") return null;
      return getAnalyticsSummary();
    }),
  }),

  units: router({
    // جلب الوحدات لمشروع معين (بـ brochureId)
    list: protectedProcedure
      .input(z.object({ brochureId: z.number() }))
      .query(async ({ ctx, input }) => {
        // التحقق من أن البروشور يخص المستخدم الحالي
        const brochure = await getBrochureById(input.brochureId);
        if (!brochure || brochure.userId !== ctx.user.id) return [];
        return getUnitsByBrochureId(input.brochureId);
      }),

    // حفظ كل الوحدات دفعة واحدة (replace all) مع autosave
    saveAll: protectedProcedure
      .input(z.object({
        brochureId: z.number(),
        units: z.array(z.object({
          unitKey: z.string(),
          unitNumber: z.string().optional(),
          floor: z.string().optional(),
          area: z.string().optional(),
          unitType: z.string().optional(),
          description: z.string().optional(),
          features: z.string().optional(),
          pricePerMeter: z.string().optional(),
          monthlyRent: z.string().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        // التحقق من أن البروشور يخص المستخدم الحالي
        const brochure = await getBrochureById(input.brochureId);
        if (!brochure || brochure.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        await replaceAllUnits(input.brochureId, input.units);
        return { success: true, count: input.units.length };
      }),

    // إنشاء أو جلب brochureId لمشروع معين (للاستخدام قبل autosave)
    getOrCreate: protectedProcedure
      .input(z.object({
        projectName: z.string(),
        projectType: z.string().optional(),
        city: z.string().optional(),
        data: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        const brochureId = await getOrCreateBrochure(
          ctx.user.id,
          input.projectName,
          input.projectType,
          input.city,
          input.data,
        );
        return { brochureId };
      }),

    // تحديث بيانات البروشور الأساسية (بدون الوحدات)
    updateData: protectedProcedure
      .input(z.object({
        brochureId: z.number(),
        data: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateBrochureData(input.brochureId, ctx.user.id, input.data);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
