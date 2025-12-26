import React from "react";
import { cn } from "@/lib/utils";

interface TimeRangeDisplayProps {
  duration: number;
  label?: string;
  threshold?: number;
  unit?: string;
  className?: string;
}

export const TimeRangeDisplay: React.FC<TimeRangeDisplayProps> = ({
  duration,
  label = "Duration",
  threshold = 7,
  unit = "hours",
  className = "",
}) => {
  const isOptimal = duration >= threshold;
  const colorClass = isOptimal ? "text-emerald-400" : "text-rose-400";

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4",
        className,
      )}
    >
      <span className="text-sm text-slate-400">{label}</span>
      <span className={cn("text-2xl font-black", colorClass)}>
        {duration}
        <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>
      </span>
    </div>
  );
};

interface GapDisplayProps {
  gap: string;
  isOptimal: boolean;
  className?: string;
}

export const GapDisplay: React.FC<GapDisplayProps> = ({
  gap,
  isOptimal,
  className = "",
}) => {
  const colorClass = isOptimal ? "text-emerald-500" : "text-rose-500";

  return (
    <span className={cn("font-mono text-xs", colorClass, className)}>
      {gap}h Fast
    </span>
  );
};
