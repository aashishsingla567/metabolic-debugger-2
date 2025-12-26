"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "../molecules/Logo";
import { NavigationLinks } from "../molecules/NavigationLinks";

interface NavigationBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPath,
  onNavigate,
  className = "",
}) => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-40 mb-2 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <NavigationLinks currentPath={currentPath} onNavigate={onNavigate} />
      </div>
    </nav>
  );
};
