"use client";

import type { ReactNode } from "react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Moon,
  Clock,
  Utensils,
  Leaf,
  Footprints,
  CheckCircle2,
  Activity,
} from "lucide-react";

// Import atomic design components
import { StatusIndicator } from "../_components/atoms";
import { SleepInput, SelectorInput } from "../_components/molecules";
import { AccordionStep, TopStepper } from "../_components/organisms";
import { FinalReport } from "./FinalReport";

// --- Shared Types ---
type StepType = "time-calc" | "meal-log" | "ai-analyze" | "select";

type StepOption = {
  label: string;
  value: string;
  pass: boolean;
};

type Step = {
  id: string;
  title: string;
  question: string;
  inputLabel: string;
  type: StepType;
  icon: ReactNode;
  noAction: string;
  reason: string;
  detail: string;
  options?: StepOption[];
};

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

type StepStatus = "active" | "completed" | "locked" | "issue";

// Icon mapping for client-side icons
const iconMap = {
  sleep: <Moon size={20} />,
  "meal-timing": <Clock size={20} />,
  protein: <Utensils size={20} />,
  order: <Leaf size={20} />,
  hygiene: <Footprints size={20} />,
  movement: <Footprints size={20} />,
};

interface AtomicDesignClientProps {
  steps: Step[];
  title: string;
  subtitle: string;
}

// --- Main Client Component ---
export default function AtomicDesignClient({
  steps,
  title,
  subtitle,
}: AtomicDesignClientProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [history, setHistory] = useState<Record<string, "yes" | "no">>({});
  const [reportData, setReportData] = useState<Record<string, unknown>>({});

  // Process steps with client-side icons
  const processedSteps = steps.map((step) => ({
    ...step,
    icon: iconMap[step.id as keyof typeof iconMap] || step.icon,
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
        // Save to localStorage and navigate to results page
        const finalReportData = {
          history,
          stepData: { ...reportData, [stepId]: data },
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "metabolic-debugger-results",
          JSON.stringify(finalReportData),
        );
        router.push("/atomic-design/results");
      }
    }
  };

  const resetFlow = () => {
    setCurrentStepIndex(0);
    setHistory({});
    setReportData({});
    localStorage.removeItem("metabolic-debugger-results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Stepper Navigation */}
      <TopStepper
        currentStep={currentStepIndex}
        totalSteps={processedSteps.length}
        steps={processedSteps}
      />

      {/* Main Content */}
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
    </div>
  );
}
