import { z } from "zod";
import axios, { AxiosError } from "axios";
import { env } from "@/env";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const geminiApiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

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
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: input.systemInstruction
                    ? `${input.systemInstruction}\n\n${input.prompt}`
                    : input.prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        };

        const response = await axios.post<GeminiResponse>(
          `${geminiApiUrl}?key=${env.GEMINI_API_KEY}`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 30000, // 30 second timeout
          },
        );

        const content =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
          throw new Error("Invalid response format from Gemini API");
        }

        return {
          success: true,
          content,
        };
      } catch (error) {
        console.error("Gemini API error:", error);

        if (error instanceof AxiosError && error.response) {
          if (error.response.status === 401) {
            throw new Error("Invalid Gemini API key");
          } else if (error.response.status === 429) {
            throw new Error("Rate limit exceeded");
          } else if (error.response.data?.error?.message) {
            throw new Error(error.response.data.error.message);
          }
        }
        throw new Error("Failed to generate content with Gemini API");
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
      const prompt = `Analyze the following metabolic assessment data and provide personalized recommendations:

Assessment Results:
${Object.entries(input.reportData.history)
  .map(([step, status]) => `${step}: ${status}`)
  .join("\n")}

Step Details:
${Object.entries(input.reportData.stepData)
  .map(([step, data]) => `${step}: ${JSON.stringify(data, null, 2)}`)
  .join("\n")}

Please provide:
1. Overall metabolic health assessment
2. Top 3 priority areas for improvement
3. Specific, actionable recommendations for each priority area
4. Expected timeline for improvements`;

      try {
        if (!env.GEMINI_API_KEY) {
          throw new Error("Gemini API key not configured");
        }

        const response = await axios.post<GeminiResponse>(
          `${geminiApiUrl}?key=${env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are a metabolic health expert. ${prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 30000,
          },
        );

        const analysis =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!analysis) {
          throw new Error("Invalid response format from Gemini API");
        }

        return {
          success: true,
          analysis,
        };
      } catch (error) {
        console.error("Gemini API error:", error);

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
