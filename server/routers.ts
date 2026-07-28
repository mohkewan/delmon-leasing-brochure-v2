import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { saveBrochure, getBrochuresByUser, getBrochureById, deleteBrochure } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
});

export type AppRouter = typeof appRouter;
