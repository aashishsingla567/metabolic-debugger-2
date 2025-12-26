import React from "react";
import {
  CheckCircle2,
  Target,
  Activity,
  Moon,
  Clock,
  Utensils,
  Leaf,
  Smartphone,
  Footprints,
  ArrowRight,
  History,
} from "lucide-react";

interface SleepData {
  duration: number;
  bedtime: string;
  waketime: string;
}

interface MealAnalysis {
  isOptimal: boolean;
}

interface MealData {
  analysis: MealAnalysis;
  isDaily: boolean;
}

interface ProteinMealReport {
  overall: {
    pass: boolean;
  };
  detected_diet: string;
}

interface ProteinData {
  report: ProteinMealReport;
}

interface SelectData {
  value: string;
}

interface ActionPlan {
  step: string;
  title: string;
  detail: string;
  steps: string[];
}

interface FinalReportProps {
  reportData: Record<string, unknown>;
  onRestart: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({
  reportData,
  onRestart,
}) => {
  const allSteps = [
    { id: "sleep", title: "Sleep Duration", icon: <Moon size={20} /> },
    { id: "meal-timing", title: "Meal Consistency", icon: <Clock size={20} /> },
    { id: "protein", title: "Protein Analysis", icon: <Utensils size={20} /> },
    { id: "order", title: "Eating Sequence", icon: <Leaf size={20} /> },
    { id: "hygiene", title: "Eating Hygiene", icon: <Smartphone size={20} /> },
    {
      id: "movement",
      title: "Post-Meal Action",
      icon: <Footprints size={20} />,
    },
  ];
  // Helper to determine if a step failed based on DATA
  const checkStatus = (id: string): "pass" | "fail" | "unknown" => {
    const data = reportData[id];
    if (!data) return "unknown";

    switch (id) {
      case "sleep":
        const sleepData = data as SleepData;
        return sleepData.duration >= 7 ? "pass" : "fail";
      case "meal-timing":
        const mealData = data as MealData;
        return mealData.analysis?.isOptimal && mealData.isDaily
          ? "pass"
          : "fail";
      case "protein":
        const proteinData = data as ProteinData;
        return proteinData.report?.overall?.pass ? "pass" : "fail";
      case "order":
      case "hygiene":
      case "movement":
        const selectData = data as SelectData;
        return ["veg", "protein"].includes(selectData.value) ? "pass" : "fail";
      default:
        return "pass";
    }
  };

  const generateActionPlan = (): ActionPlan[] => {
    const actions: ActionPlan[] = [];

    if (checkStatus("sleep") === "fail") {
      const d = reportData.sleep as SleepData | undefined;
      actions.push({
        step: "Sleep",
        title: "Sleep Optimization",
        detail: `You averaged ${d?.duration ?? 0}h. Target is 7.5h+.`,
        steps: [
          "Set a hard 'Tech Off' time 45 mins before bed.",
          "Use magnesium glycinate before sleep.",
          "Cool your room to 19°C.",
        ],
      });
    }

    if (checkStatus("meal-timing") === "fail") {
      actions.push({
        step: "Meals",
        title: "Circadian Rhythm",
        detail: "Your eating window is irregular or gaps are suboptimal.",
        steps: [
          "Stick to consistent meal times everyday ±30mins.",
          "Do not snack between these meals.",
          "Finish dinner 3 hours before sleep.",
        ],
      });
    }

    if (checkStatus("protein") === "fail") {
      const proteinData = reportData.protein as ProteinData | undefined;
      const diet = proteinData?.report?.detected_diet ?? "your diet";
      actions.push({
        step: "Protein",
        title: "Protein Thresholds",
        detail: `Your ${diet} meals are missing the leucine threshold for satiety.`,
        steps: [
          "Aim for 30g protein per meal minimum.",
          "Prioritize the protein source first on your plate.",
          "Use the alternatives suggested in the analysis.",
        ],
      });
    }

    if (checkStatus("order") === "fail") {
      actions.push({
        step: "Order",
        title: "Glucose Management",
        detail: "Eating carbs first spikes insulin unnecessarily.",
        steps: [
          "Eat vegetables/fiber first.",
          "Eat protein/fats second.",
          "Eat starches/sugars last.",
        ],
      });
    }

    if (checkStatus("hygiene") === "fail") {
      actions.push({
        step: "Hygiene",
        title: "Mindful Eating",
        detail: "Distracted eating bypasses satiety signals.",
        steps: [
          "No screens while eating.",
          "Chew each bite 20 times.",
          "Put the fork down between bites.",
        ],
      });
    }

    if (checkStatus("movement") === "fail") {
      actions.push({
        step: "Movement",
        title: "Active Glucose Disposal",
        detail: "Sedentary post-meal time leads to fat storage.",
        steps: [
          "10 minute walk immediately after big meals.",
          "Do 20 air squats if you can't walk outside.",
        ],
      });
    }

    return actions;
  };

  const actionPlan = generateActionPlan();
  const totalSteps = allSteps.length;
  const systemScore = Math.round(
    ((totalSteps - actionPlan.length) / totalSteps) * 100,
  );

  return (
    <div className="animate-in fade-in zoom-in mx-auto max-w-4xl p-4 duration-500 md:p-0">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-950 p-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <Activity size={14} className="text-emerald-500" />
            Diagnostic Report
          </div>
          <h2 className="mb-2 text-3xl font-black text-white md:text-5xl">
            Metabolic Blueprint
          </h2>
          <p className="text-slate-400">
            System Efficiency:{" "}
            <span
              className={
                systemScore > 80 ? "text-emerald-400" : "text-amber-400"
              }
            >
              {systemScore}%
            </span>
          </p>
        </div>

        <div className="grid gap-12 p-8 md:grid-cols-2">
          {/* Left: Validated Systems */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-emerald-400 uppercase">
              <CheckCircle2 size={18} /> Optimized Systems
            </h3>
            <div className="space-y-3">
              {allSteps
                .filter(
                  (s: { id: string; title: string; icon: React.ReactNode }) =>
                    checkStatus(s.id) === "pass",
                )
                .map(
                  (s: { id: string; title: string; icon: React.ReactNode }) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4"
                    >
                      <div className="text-emerald-500">{s.icon}</div>
                      <span className="font-medium text-slate-200">
                        {s.title}
                      </span>
                    </div>
                  ),
                )}
              {actionPlan.length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  All systems checks passed. You are metabolically optimized.
                </p>
              )}
            </div>
          </div>

          {/* Right: Action Plan */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-rose-400 uppercase">
              <Target size={18} /> Priority Action Plan
            </h3>
            <div className="space-y-6">
              {actionPlan.map((action, idx) => (
                <div
                  key={idx}
                  className="relative border-l-2 border-slate-800 pl-6"
                >
                  <div className="absolute top-0 -left-[9px] h-4 w-4 rounded-full border-2 border-rose-500 bg-slate-900"></div>
                  <h4 className="mb-1 text-lg font-bold text-white">
                    {action.title}
                  </h4>
                  <p className="mb-3 text-sm text-slate-400">{action.detail}</p>
                  <ul className="space-y-2">
                    {action.steps.map((step, sIdx) => (
                      <li
                        key={sIdx}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <ArrowRight
                          size={14}
                          className="mt-1 shrink-0 text-emerald-500"
                        />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {actionPlan.length === 0 && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center">
                  <span className="mb-2 block text-4xl">🎉</span>
                  <p className="font-medium text-slate-300">
                    No bottlenecks found!
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Maintain current protocols.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center border-t border-slate-800 bg-slate-950 p-8">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-8 py-4 font-bold text-slate-900 shadow-lg transition-all hover:bg-white active:scale-95"
          >
            <History size={18} />
            Restart Diagnostic
          </button>
        </div>
      </div>
    </div>
  );
};
