"use client";

import React from "react";
import { NavigationLink } from "./NavigationLink";

interface NavigationLinksProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const links = [
  { path: "/", label: "Home" },
  { path: "/results", label: "Results" },
  { path: "/about", label: "About" },
];

export const NavigationLinks: React.FC<NavigationLinksProps> = ({
  currentPath,
  onNavigate,
}) => {
  return (
    <div className="hidden items-center gap-6 md:flex">
      {links.map((link) => (
        <NavigationLink
          key={link.path}
          label={link.label}
          isActive={currentPath === link.path}
          onClick={() => onNavigate(link.path)}
        />
      ))}
    </div>
  );
};
