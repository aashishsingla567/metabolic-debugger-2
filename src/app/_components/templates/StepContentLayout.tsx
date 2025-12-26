"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StepContentLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  isIssue?: boolean;
  className?: string;
}

export const StepContentLayout: React.FC<StepContentLayoutProps> = ({
  leftContent,
  rightContent,
  isIssue = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 px-4 pb-8 lg:grid-cols-2 lg:gap-12",
        className,
      )}
    >
      <div className={cn("order-2 opacity-100 lg:order-1")}>
        <div
          className={cn(
            "rounded-2xl border bg-slate-900/50 p-6 shadow-2xl transition-colors duration-500",
            isIssue ? "border-rose-900/30" : "border-slate-800",
          )}
        >
          {leftContent}
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div
          className={cn(
            "flex h-full flex-col rounded-2xl border p-6 transition-colors duration-500",
            isIssue
              ? "border-rose-500/30 bg-rose-950/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]"
              : "border-slate-700 bg-slate-800/30",
          )}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
};
