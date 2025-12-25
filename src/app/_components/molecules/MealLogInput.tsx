import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { MealTimeItem } from "./MealTimeItem";
import { Button } from "../atoms";

type MealTimes = {
  m1: string;
  m2: string;
  m3: string;
};

type MealAnalysis = {
  gap1: string;
  gap2: string;
  isOptimal: boolean;
  msg: string;
  isSpacingGood?: boolean;
};

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

interface MealLogInputProps {
  onValidate: ValidateFn<{
    meals: MealTimes;
    analysis: MealAnalysis;
    isDaily: boolean;
  }>;
  isIssue: boolean;
}

export const MealLogInput: React.FC<MealLogInputProps> = ({
  onValidate,
  isIssue,
}) => {
  const [meals, setMeals] = useState({ m1: "08:00", m2: "13:00", m3: "19:00" });
  const [isDaily, setIsDaily] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis>({
    gap1: "0",
    gap2: "0",
    isOptimal: false,
    msg: "",
  });

  useEffect(() => {
    const getHrs = (t: string) => {
      if (!t) return 0;
      const [h, m] = t.split(":").map(Number);
      return (h ?? 0) + (m ?? 0) / 60;
    };
    const t1 = getHrs(meals.m1);
    const t2 = getHrs(meals.m2);
    const t3 = getHrs(meals.m3);
    let g1 = t2 - t1;
    let g2 = t3 - t2;
    if (g1 < 0) g1 = 0;
    if (g2 < 0) g2 = 0;
    const isSpacingGood = g1 >= 3 && g1 <= 6.5 && g2 >= 3 && g2 <= 6.5;
    const isOptimal = isSpacingGood && isDaily;
    let msg = "Check spacing...";
    if (!isSpacingGood) {
      if (g1 < 3 || g2 < 3) msg = "Gaps too short (<3h). Insulin won't reset.";
      else if (g1 > 7 || g2 > 7) msg = "Gaps too long (>7h). Cortisol rising.";
    } else {
      if (!isDaily) msg = "Timing good, but consistency is missing.";
      else msg = "Optimal metabolic rhythm.";
    }
    setAnalysis({
      gap1: g1.toFixed(1),
      gap2: g2.toFixed(1),
      isOptimal,
      msg,
      isSpacingGood,
    });
  }, [meals, isDaily]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <MealTimeItem
          mealNumber={1}
          mealName="Breakfast"
          time={meals.m1}
          onChange={(time) => setMeals({ ...meals, m1: time })}
        />

        {/* Visual Connector 1 */}
        <div className="flex h-6 items-center gap-4 pl-4">
          <div className="mx-3.75 h-full w-0.5 bg-slate-800"></div>
          <span
            className={`font-mono text-xs ${
              parseFloat(analysis.gap1) >= 3 && parseFloat(analysis.gap1) <= 6.5
                ? "text-emerald-500"
                : "text-rose-500"
            }`}
          >
            {analysis.gap1}h Fast
          </span>
        </div>

        <MealTimeItem
          mealNumber={2}
          mealName="Lunch"
          time={meals.m2}
          onChange={(time) => setMeals({ ...meals, m2: time })}
        />

        {/* Visual Connector 2 */}
        <div className="flex h-6 items-center gap-4 pl-4">
          <div className="mx-3.75 h-full w-0.5 bg-slate-800"></div>
          <span
            className={`font-mono text-xs ${
              parseFloat(analysis.gap2) >= 3 && parseFloat(analysis.gap2) <= 6.5
                ? "text-emerald-500"
                : "text-rose-500"
            }`}
          >
            {analysis.gap2}h Fast
          </span>
        </div>

        <MealTimeItem
          mealNumber={3}
          mealName="Dinner"
          time={meals.m3}
          onChange={(time) => setMeals({ ...meals, m3: time })}
        />
      </div>

      <button
        onClick={() => setIsDaily(!isDaily)}
        className={`flex w-full items-center justify-center gap-3 rounded-xl border p-4 transition-all ${
          isDaily
            ? "border-emerald-500/50 bg-emerald-900/20 text-emerald-100"
            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
        }`}
      >
        <div
          className={`flex h-5 w-5 items-center justify-center rounded border ${
            isDaily ? "border-emerald-500 bg-emerald-500" : "border-slate-500"
          }`}
        >
          {isDaily && <CheckCircle2 size={14} className="text-slate-900" />}
        </div>
        <span className="text-sm font-medium">I eat at these times daily</span>
      </button>

      <Button
        mode="instant"
        variant={isIssue ? "rose" : "slate"}
        onClick={() =>
          onValidate(analysis.isOptimal, { meals, analysis, isDaily })
        }
        disabled={isIssue}
      >
        {isIssue ? "Rhythm Issues Found" : "Analyze Rhythm"}
      </Button>
    </div>
  );
};
