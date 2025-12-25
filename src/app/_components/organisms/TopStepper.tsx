import React from "react";

interface Step {
  id: string;
  title: string;
  question: string;
  inputLabel: string;
  type: string;
  icon: React.ReactNode;
  noAction: string;
  reason: string;
  detail: string;
  options?: Array<{
    label: string;
    value: string;
    pass: boolean;
  }>;
}

interface TopStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export const TopStepper: React.FC<TopStepperProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => (
  <div className="no-scrollbar sticky top-0 z-50 overflow-x-auto border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur-md">
    <div className="mx-auto flex max-w-6xl min-w-[600px] items-center justify-between">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <div
            key={idx}
            className="group relative flex cursor-default flex-col items-center gap-2"
          >
            <div
              className={`h-3 w-3 rounded-full transition-all duration-500 ${isActive ? "scale-125 bg-emerald-500 shadow-[0_0_10px_emerald]" : isCompleted ? "bg-emerald-800" : "bg-slate-800"}`}
            ></div>
            <span
              className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${isActive ? "text-white" : isCompleted ? "text-emerald-700" : "text-slate-700"}`}
            >
              Step {idx + 1}
            </span>
            {/* Connecting Line */}
            {idx < totalSteps - 1 && (
              <div
                className={`absolute top-1.5 left-[50%] -z-10 h-0.5 w-[calc(100%_+_2rem)] ${idx < currentStep ? "bg-emerald-900" : "bg-slate-900"}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
