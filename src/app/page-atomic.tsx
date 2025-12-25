"use client";

import React, { useState } from "react";
// Atomic Design Imports
import {
  Moon,
  Clock,
  Utensils,
  Leaf,
  Footprints,
  Smartphone,
} from "lucide-react";
import { AccordionStep } from "./_components/organisms";
import { FinalReport } from "./atomic-design/FinalReport";
import { MainLayout } from "./_components/templates";

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
  icon: React.ReactNode;
  noAction: string;
  reason: string;
  detail: string;
  options?: StepOption[];
};

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

type StepStatus = "active" | "completed" | "locked" | "issue";

// --- Data & Logic ---
const STEPS: Step[] = [
  {
    id: "sleep",
    title: "Sleep Duration",
    question: "Circadian Foundation",
    inputLabel: "When did you sleep yesterday?",
    type: "time-calc",
    icon: <Moon size={20} />,
    noAction: "Prioritize Sleep Quantity",
    reason: "Willpower is chemically impossible when sleep-deprived.",
    detail:
      "Less than 7 hours spikes ghrelin (hunger) and slashes insulin sensitivity. You cannot out-diet poor sleep.",
  },
  {
    id: "meal-timing",
    title: "Meal Consistency",
    question: "Metabolic Rhythm",
    inputLabel: "Log your meal times",
    type: "meal-log",
    icon: <Clock size={20} />,
    noAction: "Fix Meal Timing",
    reason: "Erratic eating signals 'famine' stress to the body.",
    detail:
      "Your circadian rhythm regulates metabolism. Eating at random times causes the body to hoard fat as a safety mechanism.",
  },
  {
    id: "protein",
    title: "Protein Analysis",
    question: "Satiety Architecture",
    inputLabel: "What did you eat yesterday?",
    type: "ai-analyze",
    icon: <Utensils size={20} />,
    noAction: "Increase Protein Intake",
    reason: "Protein is the biological 'off switch' for hunger.",
    detail:
      "If you don't hit a leucine threshold (~30g/meal), your brain keeps the hunger switch on, searching for amino acids.",
  },
  {
    id: "order",
    title: "Eating Sequence",
    question: "Glucose Control",
    inputLabel: "What did you eat first in your last meal?",
    type: "select",
    options: [
      { label: "Vegetables / Fiber", value: "veg", pass: true },
      { label: "Protein / Meat", value: "protein", pass: true },
      { label: "Carbs (Rice/Bread)", value: "carbs", pass: false },
      { label: "Mixed everything", value: "mixed", pass: false },
    ],
    icon: <Leaf size={20} />,
    noAction: "Sequence Your Meals",
    reason: "Eating carbs first spikes insulin and causes a crash.",
    detail:
      "Fiber first creates a mesh in the gut. Protein second signals satiety. Carbs last have 70% less impact on blood sugar.",
  },
  {
    id: "hygiene",
    title: "Eating Hygiene",
    question: "Sensory Awareness",
    inputLabel: "Were you distracted while eating?",
    type: "select",
    options: [
      { label: "Yes (TV, Phone, Laptop)", value: "distracted", pass: false },
      { label: "No, just eating", value: "mindful", pass: true },
    ],
    icon: <Smartphone size={20} />,
    noAction: "Remove Distractions",
    reason: "Distracted eating blocks the 'I'm Full' signal.",
    detail:
      "Your brain needs to register the sensory experience of eating to start digestion. 'Mindless' eating leads to overconsumption.",
  },
  {
    id: "movement",
    title: "Post-Meal Action",
    question: "Glucose Disposal",
    inputLabel: "Did you move after your last meal?",
    type: "select",
    options: [
      { label: "Yes, took a walk", value: "walk", pass: true },
      { label: "No, stayed sedentary", value: "sit", pass: false },
    ],
    icon: <Footprints size={20} />,
    noAction: "Walk After Meals",
    reason: "Walking uses glucose immediately without insulin.",
    detail:
      "A 10-minute walk creates a 'glucose sink' in your leg muscles, pulling sugar from the blood physically rather than chemically.",
  },
];

// --- Main Application Component ---
export default function MetabolicDebuggerAtomic() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<Record<string, "yes" | "no">>({});
  const [reportData, setReportData] = useState<Record<string, unknown>>({});

  const handleAnswer: ValidateFn = (isYes, data) => {
    const stepId = STEPS[currentStepIndex]!.id;
    setHistory((prev) => ({ ...prev, [stepId]: isYes ? "yes" : "no" }));

    // Store specific step data if provided
    if (data) {
      setReportData((prev) => ({ ...prev, [stepId]: data }));
    }

    if (isYes) {
      if (currentStepIndex < STEPS.length - 1) {
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
  };

  return (
    <MainLayout
      title="Metabolic Debugger"
      subtitle="Identify the rate-limiting step in your biology."
      showStepper={!showResult}
      stepperProps={{
        currentStep: currentStepIndex,
        totalSteps: STEPS.length,
        steps: STEPS,
      }}
    >
      {!showResult ? (
        <div className="border-t border-slate-800">
          {STEPS.map((step, idx) => {
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
          steps={STEPS}
        />
      )}
    </MainLayout>
  );
}
