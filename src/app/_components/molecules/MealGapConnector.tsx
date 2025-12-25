import React from "react";
import { cn } from "../../../lib/utils";

interface MealGapConnectorProps {
  hours: string;
  isGood: boolean;
  className?: string;
}

export const MealGapConnector: React.FC<MealGapConnectorProps> = ({
  hours,
  isGood,
  className = "",
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "h-8 w-1 rounded-full",
          isGood ? "bg-emerald-500" : "bg-rose-500",
        )}
      />
      <span
        className={cn(
          "text-xs font-bold",
          isGood ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {hours}h
      </span>
    </div>
  );
};
