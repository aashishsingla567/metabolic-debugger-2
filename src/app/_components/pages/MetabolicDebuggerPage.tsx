"use client";

import React from "react";
import {
  Moon,
  Clock,
  Utensils,
  Leaf,
  Smartphone,
  Footprints,
} from "lucide-react";

import { STEPS } from "@/config/steps";
import { AccordionStep, TopStepper } from "../organisms";
import { FinalReport } from "../organisms/FinalReport";
import type { StepStatus, StepOption } from "@/lib/types";
import { useMetabolicFlow } from "@/lib/hooks/useMetabolicFlow";

export interface ClientStep {
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

const iconMap: Record<string, React.ReactNode> = {
  Moon: <Moon size={20} />,
  Clock: <Clock size={20} />,
  Utensils: <Utensils size={20} />,
  Leaf: <Leaf size={20} />,
  Smartphone: <Smartphone size={20} />,
  Footprints: <Footprints size={20} />,
};

export function MetabolicDebuggerPage() {
  const {
    currentStepIndex,
    showResult,
    handleAnswer,
    resetFlow,
    history,
    reportData,
  } = useMetabolicFlow(STEPS);

  const processedSteps: ClientStep[] = STEPS.map((step) => ({
    ...step,
    icon: iconMap[step.icon] ?? null,
  }));

  return (
    <>
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
        <FinalReport reportData={reportData} onRestart={resetFlow} />
      )}
    </>
  );
}

export default MetabolicDebuggerPage;
