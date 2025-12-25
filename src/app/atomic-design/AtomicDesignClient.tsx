"use client";

import React, { useState } from "react";
import {
  Moon,
  Clock,
  Utensils,
  Leaf,
  Smartphone,
  Footprints,
} from "lucide-react";

// Import centralized configuration and components
import { STEPS } from "@/config/steps";
import { AccordionStep, TopStepper } from "../../app/_components/organisms";
import { FinalReport } from "./FinalReport";
import type { StepStatus, ValidateFn, StepOption } from "@/lib/types";

// --- Client-side step type with ReactNode icon ---
interface ClientStep {
  id: string;
  title: string;
  question: string;
  inputLabel: string;
  type: "time-calc" | "meal-log" | "ai-analyze" | "select";
  icon: React.ReactNode;
  noAction: string;
  reason: string;
  detail: string;
  options?: StepOption[];
}

// --- Icon mapping for client-side icons ---
const iconMap: Record<string, React.ReactNode> = {
  Moon: <Moon size={20} />,
  Clock: <Clock size={20} />,
  Utensils: <Utensils size={20} />,
  Leaf: <Leaf size={20} />,
  Smartphone: <Smartphone size={20} />,
  Footprints: <Footprints size={20} />,
};

interface AtomicDesignClientProps {
  steps?: ClientStep[];
}

// --- Main Client Component ---
export default function AtomicDesignClient({
  steps: _passedSteps,
}: AtomicDesignClientProps = {}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<Record<string, "yes" | "no">>({});
  const [reportData, setReportData] = useState<Record<string, unknown>>({});

  // Process steps with client-side icons
  const processedSteps: ClientStep[] = STEPS.map((step) => ({
    ...step,
    icon: iconMap[step.icon] ?? null,
  }));

  const handleAnswer: ValidateFn = (isYes, data) => {
    const stepId = processedSteps[currentStepIndex]!.id;
    setHistory((prev) => ({ ...prev, [stepId]: isYes ? "yes" : "no" }));

    if (data) {
      setReportData((prev) => ({ ...prev, [stepId]: data }));
    }

    if (isYes) {
      if (currentStepIndex < processedSteps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500);
      } else {
        setTimeout(() => setShowResult(true), 600);
      }
    }
  };

  const resetFlow = () => {
    setCurrentStepIndex(0);
    setShowResult(false);
    setHistory({});
    setReportData({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
      {!showResult && (
        <TopStepper
          currentStep={currentStepIndex}
          totalSteps={processedSteps.length}
          steps={processedSteps}
        />
      )}

      {!showResult ? (
        <div className="border-t border-slate-800">
          {processedSteps.map((step, idx) => {
            let status: StepStatus = "locked";
            if (idx < currentStepIndex) status = "completed";
            if (idx === currentStepIndex)
              status = history[step.id] === "no" ? "issue" : "active";

            return (
              <AccordionStep
                key={step.id}
                step={step}
                status={status}
                onAnswer={handleAnswer}
                index={idx}
              />
            );
          })}
        </div>
      ) : (
        <FinalReport
          reportData={reportData}
          onRestart={resetFlow}
          steps={processedSteps}
        />
      )}
    </>
  );
}
