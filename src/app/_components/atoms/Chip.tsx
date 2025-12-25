import React from "react";
import { cn } from "../../../lib/utils";

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
        "border border-slate-700 bg-slate-900 text-slate-300",
        "hover:border-emerald-500 hover:bg-emerald-950/30 hover:text-emerald-300",
        "active:scale-95",
        isActive &&
          "border-emerald-500 bg-emerald-950/50 text-emerald-300 shadow-lg",
        onClick && !disabled && "cursor-pointer",
        disabled && "cursor-not-allowed opacity-50 grayscale",
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
