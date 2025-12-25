import React from "react";
import { InputField, InputLabel } from "../atoms";
import { cn } from "../../../lib/utils";

interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimeField: React.FC<TimeFieldProps> = ({
  label,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700 bg-slate-900 p-4",
        className,
      )}
    >
      <InputLabel>{label}</InputLabel>
      <InputField
        type="time"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full bg-transparent text-xl text-white focus:outline-none"
      />
    </div>
  );
};
