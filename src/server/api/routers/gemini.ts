import { z } from "zod";
import { geminiService } from "@/lib/services";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const geminiRouter = createTRPCRouter({
  generateContent: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        systemInstruction: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await geminiService.generateContent(
          input.prompt,
          input.systemInstruction,
        );

        return result;
      } catch (error) {
        console.error("Gemini generateContent error:", error);
        throw error;
      }
    }),

  analyzeMetabolicData: publicProcedure
    .input(
      z.object({
        reportData: z.object({
          history: z.record(z.enum(["yes", "no"])),
          stepData: z.record(z.unknown()),
          completedAt: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        if (!geminiService.isConfigured()) {
          throw new Error("Gemini API key not configured");
        }

        const result = await geminiService.analyzeMetabolicData(
          input.reportData,
        );

        return result;
      } catch (error) {
        console.error("Gemini analyzeMetabolicData error:", error);

        // Return fallback analysis when API is not available or fails
        const totalSteps = Object.keys(input.reportData.history).length;
        const passedSteps = Object.values(input.reportData.history).filter(
          (status) => status === "yes",
        ).length;
        const systemScore = Math.round((passedSteps / totalSteps) * 100);

        return {
          success: true,
          analysis: `Based on your assessment, your metabolic efficiency score is ${systemScore}%. Focus on areas marked as "needs attention" to improve your overall metabolic health.`,
        };
      }
    }),
});
