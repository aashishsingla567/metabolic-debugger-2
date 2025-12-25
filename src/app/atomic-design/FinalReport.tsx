"use client";

import React from "react";
import { Button, Icon } from "../_components/atoms";

interface FinalReportProps {
  reportData: Record<string, unknown>;
  onRestart: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({
  reportData,
  onRestart,
}) => {
  return (
    <div className="animate-in fade-in zoom-in mx-auto max-w-4xl p-4 duration-500 md:p-0">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-950 p-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <Icon name="activity" size={14} className="text-emerald-500" />
            Diagnostic Report
          </div>
          <h2 className="mb-2 text-3xl font-black text-white md:text-5xl">
            Metabolic Blueprint
          </h2>
          <p className="text-slate-400">
            System Efficiency: <span className="text-emerald-400">85%</span>
          </p>
        </div>

        {/* Content */}
        <div className="flex justify-center border-t border-slate-800 bg-slate-950 p-8">
          <Button
            onComplete={onRestart}
            label="Restart Diagnostic"
            holdingLabel="Restarting..."
            theme="default"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};
