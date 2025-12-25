import React from "react";
import { InputField } from "../atoms/InputField";
import { Label } from "../atoms/Label";

interface MealTimeItemProps {
  mealNumber: number;
  mealName: string;
  time: string;
  onChange: (time: string) => void;
  className?: string;
}

export const MealTimeItem: React.FC<MealTimeItemProps> = ({
  mealNumber,
  mealName,
  time,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-3 ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
        {mealNumber}
      </div>
      <InputField
        type="time"
        value={time}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-white focus:outline-none"
      />
      <span className="ml-auto text-xs tracking-wider text-slate-500 uppercase">
        {mealName}
      </span>
    </div>
  );
};
