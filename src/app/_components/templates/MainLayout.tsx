import React from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showStepper?: boolean;
  stepperProps?: {
    currentStep: number;
    totalSteps: number;
    steps: Array<{
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
    }>;
  };
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Metabolic Debugger",
  subtitle = "Identify the rate-limiting step in your biology.",
  showStepper = false,
  stepperProps,
}) => {
  return (
    <div className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 scrollbar-hover:scrollbar-thumb-slate-500 min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
      {showStepper && stepperProps && (
        <div className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 scrollbar-hover:scrollbar-thumb-slate-500 sticky top-0 z-50 overflow-x-auto border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl min-w-150 items-center justify-between">
            {stepperProps.steps.map((step, idx) => {
              const isActive = idx === stepperProps.currentStep;
              const isCompleted = idx < stepperProps.currentStep;
              return (
                <div
                  key={idx}
                  className="group relative flex cursor-default flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full transition-all duration-500",
                      isActive &&
                        "scale-125 bg-emerald-500 shadow-[0_0_10px_emerald]",
                      isCompleted && !isActive && "bg-emerald-800",
                      !isActive && !isCompleted && "bg-slate-800",
                    )}
                  ></div>
                  <span
                    className={cn(
                      "text-[10px] font-bold tracking-wider uppercase transition-colors",
                      isActive && "text-white",
                      isCompleted && !isActive && "text-emerald-700",
                      !isActive && !isCompleted && "text-slate-700",
                    )}
                  >
                    Step {idx + 1}
                  </span>
                  {/* Connecting Line */}
                  {idx < stepperProps.totalSteps - 1 && (
                    <div
                      className={cn(
                        "absolute top-1.5 left-[50%] -z-10 h-0.5 w-[calc(100%+2rem)]",
                        idx < stepperProps.currentStep
                          ? "bg-emerald-900"
                          : "bg-slate-900",
                      )}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl pt-8 pb-32">
        <div className="mb-12 px-4 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            {title.split(" ").map((word, idx) =>
              idx === 1 ? (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
                >
                  {word}
                </span>
              ) : (
                <span key={idx}>{word} </span>
              ),
            )}
          </h1>
          <p className="text-lg text-slate-400">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
};
