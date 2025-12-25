import React from "react";
import { StatusIndicator } from "../atoms";
import { cn } from "../../../lib/utils";

type StepStatus = "active" | "completed" | "locked" | "issue";

interface StepHeaderProps {
  step: {
    id: string;
    title: string;
    question: string;
    icon: React.ReactNode;
  };
  status: StepStatus;
  index: number;
  isExpanded?: boolean;
  className?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  step,
  status,
  index,
  isExpanded = false,
  className = "",
}) => {
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-4 transition-all duration-300",
        isLocked ? "opacity-30" : "opacity-100",
        isExpanded ? "mb-4" : "",
        className,
      )}
    >
      <StatusIndicator status={status} index={index} />
      <div className="flex-1">
        <h3
          className={cn(
            "text-lg font-bold transition-colors",
            isExpanded ? "text-white" : "text-slate-400",
          )}
        >
          {step.title}
        </h3>
        {!isExpanded && (
          <p className="text-xs text-slate-600">{step.question}</p>
        )}
      </div>
    </div>
  );
};
