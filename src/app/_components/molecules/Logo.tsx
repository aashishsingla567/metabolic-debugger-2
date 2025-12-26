"use client";

import React from "react";
import { Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Activity size={24} className="text-emerald-500" />
      <span className="text-xl font-bold text-white">
        Metabolic<span className="text-emerald-400">Debugger</span>
      </span>
    </Link>
  );
};
