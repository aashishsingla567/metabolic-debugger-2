import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { env } from "@/env";

// Gemini API interfaces
export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
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

export interface GenerateContentRequest extends GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

export interface AnalyzeMetabolicDataRequest extends GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

export interface GenerateContentResponse {
  success: boolean;
  content: string;
}

export interface AnalyzeMetabolicDataResponse {
  success: boolean;
  analysis: string;
}

// Create and configure axios instance for Gemini API
const createGeminiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add API key
  client.interceptors.request.use(
    (config) => {
      const apiKey = String(env.GEMINI_API_KEY ?? "");
      if (apiKey) {
        config.url = `${config.url}?key=${apiKey}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(
        new Error(error instanceof Error ? error.message : "Request failed"),
      );
    },
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse<GeminiResponse>) => {
      return response;
    },
    (error: unknown) => {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const errorData = error.response.data as { error?: { message?: string } } | null;
        const message = errorData?.error?.message ?? error.message;

        switch (status) {
          case 401:
            throw new Error("Invalid Gemini API key");
          case 429:
            throw new Error("Rate limit exceeded");
          default:
            throw new Error(`Gemini API error (${status}): ${message}`);
        }
      } else if (error instanceof AxiosError && error.request) {
        throw new Error("Network error: Unable to reach Gemini API");
      } else {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(`Request error: ${message}`);
      }
    },
  );

  return client;
};

const geminiClient = createGeminiClient();

// Service functions
export const geminiService = {
  /**
   * Generate content using Gemini API
   */
  async generateContent(
    prompt: string,
    systemInstruction?: string,
  ): Promise<GenerateContentResponse> {
    try {
      const text = systemInstruction
        ? `${systemInstruction}\n\n${prompt}`
        : prompt;

      const requestBody: GenerateContentRequest = {
        contents: [
          {
            parts: [
              {
                text,
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

      const response = await geminiClient.post<
        GenerateContentRequest,
        AxiosResponse<GeminiResponse>
      >("", requestBody);

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error("Invalid response format from Gemini API");
      }

      return {
        success: true,
        content,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  },

  /**
   * Analyze metabolic assessment data using Gemini API
   */
  async analyzeMetabolicData(reportData: {
    history: Record<string, "yes" | "no">;
    stepData: Record<string, unknown>;
    completedAt: string;
  }): Promise<AnalyzeMetabolicDataResponse> {
    try {
      const prompt = `Analyze the following metabolic assessment data and provide personalized recommendations:

Assessment Results:
${Object.entries(reportData.history)
  .map(([step, status]) => `${step}: ${status}`)
  .join("\n")}

Step Details:
${Object.entries(reportData.stepData)
  .map(([step, data]) => `${step}: ${JSON.stringify(data, null, 2)}`)
  .join("\n")}

Please provide:
1. Overall metabolic health assessment
2. Top 3 priority areas for improvement
3. Specific, actionable recommendations for each priority area
4. Expected timeline for improvements`;

      const requestBody: AnalyzeMetabolicDataRequest = {
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
      };

      const response = await geminiClient.post<
        AnalyzeMetabolicDataRequest,
        AxiosResponse<GeminiResponse>
      >("", requestBody);

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
      throw error;
    }
  },

  /**
   * Check if Gemini API is properly configured
   */
  isConfigured(): boolean {
    return Boolean(env.GEMINI_API_KEY);
  },
};
