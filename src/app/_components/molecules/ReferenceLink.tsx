"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface ReferenceLinkProps {
  title: string;
  url: string;
  citation: string;
}

export const ReferenceLink: React.FC<ReferenceLinkProps> = ({
  title,
  url,
  citation,
}) => {
  return (
    <div className="flex items-start gap-3">
      <ExternalLink size={16} className="mt-1 shrink-0 text-emerald-500" />
      <div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-white hover:text-emerald-400"
        >
          {title}
        </a>
        <p className="mt-1 text-xs text-slate-500">{citation}</p>
      </div>
    </div>
  );
};
