import { z } from "zod";
import { geminiService } from "@/lib/services";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const MAX_PROMPT_LENGTH = 2000;
const MAX_SYSTEM_INSTRUCTION_LENGTH = 500;

const sleepStepDataSchema = z.object({
  duration: z.number().min(0).max(24).optional(),
  bedtime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  waketime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
});

const mealTimingStepDataSchema = z.object({
  meals: z
    .object({
      m1: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
      m2: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
      m3: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
    })
    .optional(),
  analysis: z
    .object({
      gap1: z.string().optional(),
      gap2: z.string().optional(),
      isOptimal: z.boolean().optional(),
      msg: z.string().optional(),
      isSpacingGood: z.boolean().optional(),
    })
    .optional(),
  isDaily: z.boolean().optional(),
});

const proteinStepDataSchema = z.object({
  logs: z
    .object({
      m1: z.string().optional(),
      m2: z.string().optional(),
      m3: z.string().optional(),
    })
    .optional(),
  report: z
    .object({
      detected_diet: z.enum(["Vegetarian", "Vegan", "Non-Veg"]).optional(),
      overall: z
        .object({
          pass: z.boolean().optional(),
          msg: z.string().optional(),
        })
        .optional(),
      m1: z
        .object({
          input_echo: z.string().optional(),
          protein: z.string().optional(),
          analysis: z.string().optional(),
          issue: z.string().optional(),
          fix: z.string().optional(),
        })
        .optional(),
      m2: z
        .object({
          input_echo: z.string().optional(),
          protein: z.string().optional(),
          analysis: z.string().optional(),
          issue: z.string().optional(),
          fix: z.string().optional(),
        })
        .optional(),
      m3: z
        .object({
          input_echo: z.string().optional(),
          protein: z.string().optional(),
          analysis: z.string().optional(),
          issue: z.string().optional(),
          fix: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

const selectorStepDataSchema = z.object({
  selection: z.string().optional(),
  value: z.string().optional(),
});

const stepDataSchema = z.object({
  sleep: sleepStepDataSchema.optional(),
  "meal-timing": mealTimingStepDataSchema.optional(),
  protein: proteinStepDataSchema.optional(),
  order: selectorStepDataSchema.optional(),
  hygiene: selectorStepDataSchema.optional(),
  movement: selectorStepDataSchema.optional(),
});

const reportDataSchema = z
  .object({
    history: z.record(z.enum(["yes", "no"])),
    stepData: stepDataSchema,
    completedAt: z.string().datetime(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data.history).length > 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "History cannot exceed 50 entries",
        path: ["history"],
      });
    }
  });

export const geminiRouter = createTRPCRouter({
  generateContent: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(MAX_PROMPT_LENGTH),
        systemInstruction: z
          .string()
          .max(MAX_SYSTEM_INSTRUCTION_LENGTH)
          .optional(),
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
        throw new Error("Failed to generate content");
      }
    }),

  analyzeMetabolicData: publicProcedure
    .input(
      z.object({
        reportData: reportDataSchema,
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
