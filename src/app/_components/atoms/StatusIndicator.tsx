import React from "react";
import { CheckCircle2, AlertTriangle, Lock } from "lucide-react";

type StatusType = "active" | "completed" | "locked" | "issue";

interface StatusIndicatorProps {
  status: StatusType;
  index: number;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  index,
  className = "",
}) => {
  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isIssue = status === "issue";

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${isCompleted ? "border-emerald-500 bg-emerald-500 text-slate-900" : isActive ? "border-emerald-500 bg-slate-800 text-emerald-400" : "border-slate-700 bg-slate-900 text-slate-500"} ${className}`}
    >
      {isCompleted ? (
        <CheckCircle2 size={18} />
      ) : isIssue ? (
        <AlertTriangle size={18} />
      ) : (
        index + 1
      )}
    </div>
  );
};

interface StepStatusBadgeProps {
  status: "pass" | "fail" | "unknown";
  className?: string;
}

export const StepStatusBadge: React.FC<StepStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pass":
        return {
          color: "text-emerald-400",
          icon: <CheckCircle2 size={20} />,
        };
      case "fail":
        return {
          color: "text-rose-500",
          icon: <AlertTriangle size={20} />,
        };
      case "unknown":
      default:
        return {
          color: "text-slate-600",
          icon: <Lock size={20} />,
        };
    }
  };

  const config = getStatusConfig();

  return <div className={config.color}>{config.icon}</div>;
};
