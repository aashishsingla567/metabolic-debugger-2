import React from "react";
import { BrainCircuit } from "lucide-react";
import type { Step, StepStatus, ValidateFn } from "../../../lib/types";
import { BottleneckAlert } from "../molecules";
import { cn } from "../../../lib/utils";

interface WizardLayoutProps {
  step: Step;
  status: StepStatus;
  onAnswer: ValidateFn;
  index: number;
  children: React.ReactNode; // The input organism component
  isIssue?: boolean;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  step,
  status: _status,
  onAnswer,
  index: _index,
  children,
  isIssue = false,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 px-4 pb-8 lg:grid-cols-2 lg:gap-12",
        "animate-in slide-in-from-left-4 order-2 delay-100 duration-700 lg:order-1",
        isIssue ? "pointer-events-none" : "opacity-100",
      )}
    >
      {/* LEFT COL: Input / Interaction */}
      <div
        className={cn(
          "order-2 lg:order-1",
          isIssue ? "pointer-events-none" : "opacity-100",
        )}
      >
        <div
          className={cn(
            "rounded-2xl border bg-slate-900/50 p-6 shadow-2xl transition-colors duration-500",
            isIssue ? "border-rose-900/30" : "border-slate-800",
          )}
        >
          <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 uppercase">
            {/* Edit icon would go here */}
            {step.inputLabel}
          </h4>
          {children}
        </div>
      </div>

      {/* RIGHT COL: Context / Education / Results */}
      <div className="animate-in slide-in-from-right-4 order-1 duration-700 lg:order-2">
        <div
          className={cn(
            "flex h-full flex-col rounded-2xl border p-6 transition-colors duration-500",
            isIssue
              ? "border-rose-500/30 bg-rose-950/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]"
              : "border-slate-700 bg-slate-800/30",
          )}
        >
          {/* Educational Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-lg bg-slate-800 p-2 text-emerald-400">
                {/* Icon would be passed from step.icon */}
                {step.icon}
              </div>
              <h4 className="text-xl font-bold text-white">{step.question}</h4>
            </div>
            <p className="text-lg leading-relaxed text-slate-400">
              {step.detail}
            </p>
          </div>

          {/* Scientific Reason */}
          <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
            <div className="flex items-start gap-3">
              <BrainCircuit
                size={20}
                className="mt-1 shrink-0 text-indigo-400"
              />
              <div>
                <span className="mb-1 block text-xs font-bold tracking-wider text-indigo-300 uppercase">
                  The Science
                </span>
                <p className="text-sm text-slate-300 italic">
                  &ldquo;{step.reason}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Bottleneck Alert (Only if Issue) */}
          {isIssue && (
            <div className="mt-auto">
              <BottleneckAlert
                onConfirm={() => onAnswer(true)}
                className="animate-in zoom-in duration-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
