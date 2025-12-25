"use client";

import React, { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/app/_components/atoms/Button";

interface ReportData {
  history: Record<string, "yes" | "no">;
  stepData: Record<string, unknown>;
  completedAt: string;
}

interface GeminiAnalysisExampleProps {
  reportData: ReportData;
}

export default function GeminiAnalysisExample({
  reportData,
}: GeminiAnalysisExampleProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // tRPC hook for Gemini analysis
  const analyzeData = api.gemini.analyzeMetabolicData.useMutation<{
    analysis: string;
  }>({
    onSuccess: (data) => {
      setAnalysis((data as { analysis: string }).analysis);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      // Fallback analysis
      const totalSteps = Object.keys(reportData.history).length;
      const passedSteps = Object.values(reportData.history).filter(
        (status) => status === "yes",
      ).length;
      const systemScore = Math.round((passedSteps / totalSteps) * 100);
      setAnalysis(
        `Based on your assessment, your metabolic efficiency score is ${systemScore}%. Focus on areas marked as "needs attention" to improve your overall metabolic health.`,
      );
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    analyzeData.mutate({ reportData });
  };

  return (
    <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">
        AI-Powered Metabolic Analysis
      </h3>

      {!analysis && !isAnalyzing && (
        <Button
          onComplete={handleAnalyze}
          label="Get AI Analysis"
          holdingLabel="Analyzing..."
          theme="default"
          variant="primary"
        />
      )}

      {isAnalyzing && (
        <div className="flex items-center gap-2 text-blue-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
          Analyzing your metabolic data with AI...
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-300">{analysis}</div>
          </div>
          <Button
            onComplete={handleAnalyze}
            label="Re-analyze"
            holdingLabel="Analyzing..."
            theme="default"
            variant="secondary"
          />
        </div>
      )}
    </div>
  );
}
