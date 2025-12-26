"use client";

import React, { useState } from "react";
import { ReferenceLink } from "./ReferenceLink";
import { Button } from "../atoms";

interface ReferenceCardProps {
  title: string;
  explanation: string;
  references: Array<{
    title: string;
    url: string;
    citation: string;
  }>;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  title,
  explanation,
  references,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="mb-4 text-slate-300">{explanation}</p>

      <Button
        variant="slate"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-fit"
      >
        {isExpanded
          ? "Hide References"
          : `Show References (${references.length})`}
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
          {references.map((ref, idx) => (
            <ReferenceLink key={idx} {...ref} />
          ))}
        </div>
      )}
    </div>
  );
};
