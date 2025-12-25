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
}) => {
  return (
    <div className="sticky top-0 z-50 overflow-x-auto border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl min-w-[600px] items-center">
        {steps.map((_, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;

          return (
            <React.Fragment key={idx}>
              {/* Step */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={[
                    "h-3 w-3 rounded-full transition-all duration-300",
                    isActive &&
                      "scale-125 bg-emerald-500 shadow-[0_0_10px_#10b981]",
                    isCompleted && "bg-emerald-700",
                    !isActive && !isCompleted && "bg-slate-800",
                  ].join(" ")}
                />
                <span
                  className={[
                    "text-[10px] font-bold tracking-wider uppercase",
                    isActive && "text-white",
                    isCompleted && "text-emerald-600",
                    !isActive && !isCompleted && "text-slate-600",
                  ].join(" ")}
                >
                  Step {idx + 1}
                </span>
              </div>

              {/* Connector */}
              {idx < totalSteps - 1 && (
                <div className="mx-3 flex-1">
                  <div className="relative h-0.5 w-full overflow-hidden bg-slate-800">
                    <div
                      className={[
                        "absolute inset-0 origin-left bg-emerald-600 transition-transform duration-500 ease-out",
                        idx < currentStep ? "scale-x-100" : "scale-x-0",
                      ].join(" ")}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
