"use client";

import { useState, useEffect } from "react";
import type { Step, StepStatus, ValidateFn } from "@/lib/types";
import { store } from "@/lib/store";

export interface UseMetabolicFlowReturn {
  currentStepIndex: number;
  showResult: boolean;
  history: Record<string, "yes" | "no">;
  reportData: Record<string, unknown>;
  currentStep: Step | null;
  stepStatuses: StepStatus[];
  handleAnswer: ValidateFn;
  resetFlow: () => void;
}

export function useMetabolicFlow(steps: Step[]): UseMetabolicFlowReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<Record<string, "yes" | "no">>({});
  const [reportData, setReportData] = useState<Record<string, unknown>>({});

  const currentStep = steps[currentStepIndex] ?? null;
  const stepStatuses: StepStatus[] = steps.map((step, idx) => {
    if (idx < currentStepIndex) return "completed";
    if (idx === currentStepIndex)
      return history[step.id] === "no" ? "issue" : "active";
    return "locked";
  });

  const handleAnswer: ValidateFn = (isYes, data) => {
    const stepId = currentStep?.id;
    if (!stepId) return;

    setHistory((prev) => ({ ...prev, [stepId]: isYes ? "yes" : "no" }));

    if (data) {
      setReportData((prev) => ({ ...prev, [stepId]: data }));
    }

    if (isYes) {
      if (currentStepIndex < steps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500);
      } else {
        setTimeout(() => setShowResult(true), 600);
      }
    }
  };

  useEffect(() => {
    if (showResult && Object.keys(reportData).length > 0) {
      store.set("reportData", reportData);
    }
  }, [showResult, reportData]);

  const resetFlow = () => {
    setCurrentStepIndex(0);
    setShowResult(false);
    setHistory({});
    setReportData({});
    store.remove("reportData");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentStepIndex,
    showResult,
    history,
    reportData,
    currentStep,
    stepStatuses,
    handleAnswer,
    resetFlow,
  };
}
