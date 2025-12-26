"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-white",
        isActive ? "text-emerald-400" : "text-slate-400",
      )}
    >
      {label}
    </button>
  );
};
