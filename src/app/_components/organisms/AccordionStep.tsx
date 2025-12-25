import React, { useEffect, useRef } from "react";
import { Edit2, BrainCircuit, AlertTriangle } from "lucide-react";
import { SleepInput, SelectorInput } from "../molecules";
import { StatusIndicator, Icon } from "../atoms";

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

type StepStatus = "active" | "completed" | "locked" | "issue";

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

interface AccordionStepProps {
  step: Step;
  status: StepStatus;
  onAnswer: ValidateFn;
  index: number;
}

export const AccordionStep: React.FC<AccordionStepProps> = ({
  step,
  status,
  onAnswer,
  index,
}) => {
  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isIssue = status === "issue";
  const fixRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to fix section when issue is detected
  useEffect(() => {
    if (isIssue && fixRef.current) {
      setTimeout(() => {
        fixRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [isIssue]);

  const renderInput = () => {
    switch (step.type) {
      case "time-calc":
        return <SleepInput onValidate={onAnswer} isIssue={isIssue} />;
      case "select":
        return (
          <SelectorInput
            options={step.options ?? []}
            onValidate={onAnswer}
            isIssue={isIssue}
          />
        );
      default:
        return null;
    }
  };

  const isExpanded = isActive || isIssue;

  return (
    <div
      className={`border-b border-slate-800 transition-all duration-500 last:border-0 ${isExpanded ? "bg-slate-950 py-4" : "bg-transparent py-0"}`}
    >
      <style>{`
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>

      {/* Header Row */}
      <div
        className={`flex items-center gap-4 px-4 py-4 ${isLocked ? "opacity-30" : "opacity-100"} ${isExpanded ? "mb-4" : ""}`}
      >
        <StatusIndicator status={status} index={index} />
        <div className="flex-1">
          <h3
            className={`text-lg font-bold ${isExpanded ? "text-white" : "text-slate-400"}`}
          >
            {step.title}
          </h3>
          {!isExpanded && (
            <p className="text-xs text-slate-600">{step.question}</p>
          )}
        </div>
      </div>

      {/* Expandable Body */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "max-h-500 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="grid grid-cols-1 gap-8 px-4 pb-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT COL: Input / Interaction */}
          <div
            className={`animate-in slide-in-from-left-4 order-2 delay-100 duration-700 lg:order-1 ${isIssue ? "pointer-events-none" : "opacity-100"}`}
          >
            <div
              className={`rounded-2xl border bg-slate-900/50 p-6 shadow-2xl transition-colors duration-500 ${isIssue ? "border-rose-900/30" : "border-slate-800"}`}
            >
              <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 uppercase">
                <Edit2 size={14} /> {step.inputLabel}
              </h4>
              {renderInput()}
            </div>
          </div>

          {/* RIGHT COL: Context / Education / Results */}
          <div className="animate-in slide-in-from-right-4 order-1 duration-700 lg:order-2">
            <div
              className={`flex h-full flex-col rounded-2xl border p-6 transition-colors duration-500 ${isIssue ? "border-rose-500/30 bg-rose-950/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]" : "border-slate-700 bg-slate-800/30"}`}
            >
              {/* Educational Header */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-800 p-2 text-emerald-400">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {step.question}
                  </h4>
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
                <div
                  ref={fixRef}
                  className="animate-in zoom-in mt-auto duration-300"
                >
                  <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 font-bold text-rose-400">
                      <AlertTriangle size={18} />
                      <span>Bottleneck Detected</span>
                    </div>
                    <p className="mb-4 text-sm text-rose-200/80">
                      Your inputs indicate this area needs optimization before
                      proceeding.
                    </p>
                    <button
                      onClick={() => onAnswer(true)}
                      className="w-full rounded-xl bg-rose-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-rose-500 active:scale-95"
                    >
                      I Commit to Fix This
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
