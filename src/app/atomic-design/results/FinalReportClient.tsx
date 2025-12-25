"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon } from "../../_components/atoms";
import { api } from "@/trpc/react";

interface ReportData {
  history: Record<string, "yes" | "no">;
  stepData: Record<string, unknown>;
  completedAt: string;
}

export default function FinalReportClient() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("metabolic-debugger-results");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as ReportData;
        setReportData(parsed);
      } catch (error) {
        console.error("Failed to parse saved report data:", error);
        // Redirect back to main page if data is corrupted
        router.push("/atomic-design");
      }
    } else {
      // No data found, redirect back to main page
      router.push("/atomic-design");
    }
    setLoading(false);
  }, [router]);

  const handleRestart = () => {
    localStorage.removeItem("metabolic-debugger-results");
    router.push("/atomic-design");
  };

  const handleBackToMain = () => {
    router.push("/atomic-design");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading your results...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 text-slate-400">No results found</div>
        <Button
          onComplete={handleBackToMain}
          label="Start New Assessment"
          holdingLabel="Redirecting..."
          theme="emerald"
          variant="primary"
        />
      </div>
    );
  }

  // Calculate some basic metrics
  const totalSteps = Object.keys(reportData.history).length;
  const passedSteps = Object.values(reportData.history).filter(
    (status) => status === "yes",
  ).length;
  const systemScore = Math.round((passedSteps / totalSteps) * 100);

  const completedDate = new Date(reportData.completedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="animate-in fade-in zoom-in mx-auto max-w-4xl p-4 duration-500 md:p-0">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-950 p-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <Icon name="activity" size={14} className="text-emerald-500" />
            Diagnostic Report
          </div>
          <h2 className="mb-2 text-3xl font-black text-white md:text-5xl">
            Metabolic Blueprint
          </h2>
          <p className="mb-2 text-slate-400">Completed on {completedDate}</p>
          <p className="text-slate-400">
            System Efficiency:{" "}
            <span
              className={
                systemScore > 80 ? "text-emerald-400" : "text-amber-400"
              }
            >
              {systemScore}%
            </span>
          </p>
        </div>

        {/* Summary Stats */}
        <div className="border-b border-slate-800 bg-slate-900 p-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{totalSteps}</div>
              <div className="text-sm text-slate-400">Total Checks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {passedSteps}
              </div>
              <div className="text-sm text-slate-400">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-400">
                {totalSteps - passedSteps}
              </div>
              <div className="text-sm text-slate-400">Need Attention</div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="p-8">
          <h3 className="mb-6 text-xl font-bold text-white">
            Priority Action Plan
          </h3>
          <div className="space-y-4">
            {Object.entries(reportData.history)
              .filter(([, status]) => status === "no")
              .map(([stepId]) => {
                // Get step details from the step data
                const stepData = reportData.stepData[stepId];
                const stepTitle = getStepTitle(stepId);

                return (
                  <div
                    key={stepId}
                    className="flex items-center gap-4 rounded-lg border border-rose-500/20 bg-rose-950/10 p-4"
                  >
                    <Icon
                      name="alertTriangle"
                      size={20}
                      className="shrink-0 text-rose-500"
                    />
                    <div>
                      <div className="font-medium text-white">{stepTitle}</div>
                      <div className="text-sm text-slate-400">
                        Requires optimization based on your inputs
                      </div>
                    </div>
                  </div>
                );
              })}

            {Object.values(reportData.history).every(
              (status) => status === "yes",
            ) && (
              <div className="py-8 text-center">
                <div className="mb-4 text-4xl">🎉</div>
                <div className="text-lg font-medium text-emerald-400">
                  Excellent! All systems are optimized.
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Continue your current protocols.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 border-t border-slate-800 bg-slate-950 p-8">
          <Button
            onComplete={handleBackToMain}
            label="View Detailed Analysis"
            holdingLabel="Loading..."
            theme="default"
            variant="primary"
          />
          <Button
            onComplete={handleRestart}
            label="Start New Assessment"
            holdingLabel="Restarting..."
            theme="emerald"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to get step titles
function getStepTitle(stepId: string): string {
  const titles: Record<string, string> = {
    sleep: "Sleep Duration Optimization",
    "meal-timing": "Meal Consistency",
    protein: "Protein Analysis",
    order: "Eating Sequence",
    hygiene: "Eating Hygiene",
    movement: "Post-Meal Activity",
  };
  return titles[stepId] ?? "Metabolic Factor";
}
