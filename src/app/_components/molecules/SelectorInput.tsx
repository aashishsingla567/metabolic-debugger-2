import React from "react";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type StepOption = {
  label: string;
  value: string;
  pass: boolean;
};

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

interface SelectorInputProps {
  options: StepOption[];
  onValidate: ValidateFn<{ selection: string; value: string }>;
  isIssue: boolean;
}

export const SelectorInput: React.FC<SelectorInputProps> = ({
  options,
  onValidate,
  isIssue,
}) => (
  <div className="grid grid-cols-1 gap-3">
    {options.map((opt) => (
      <button
        key={opt.label}
        onClick={() =>
          onValidate(opt.pass, { selection: opt.label, value: opt.value })
        }
        disabled={isIssue}
        className={cn(
          "group flex items-center justify-between rounded-xl border bg-slate-900 px-5 py-4 text-left shadow-sm transition-all",
          isIssue && "cursor-not-allowed border-slate-800 opacity-50 grayscale",
          !isIssue &&
            "cursor-pointer border-slate-700 hover:border-emerald-500 hover:bg-slate-800",
        )}
      >
        <span className="font-medium text-slate-200 group-hover:text-white">
          {opt.label}
        </span>
        {isIssue ? (
          <Lock size={20} className="text-slate-600" />
        ) : (
          <ChevronDown
            className="-rotate-90 text-emerald-500 opacity-0 transition-all group-hover:opacity-100"
            size={20}
          />
        )}
      </button>
    ))}
  </div>
);
