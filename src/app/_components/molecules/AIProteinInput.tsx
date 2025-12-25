import React, { useState } from "react";
import {
  BrainCircuit,
  Plus,
  History,
  XCircle,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import { Button } from "../atoms";

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

type ProteinMealReport = {
  input_echo: string;
  ingredients?: string;
  protein: string;
  analysis: string;
  issue: string;
  fix?: string;
};

type ProteinReport = {
  detected_diet: "Vegetarian" | "Vegan" | "Non-Veg";
  m1: ProteinMealReport;
  m2: ProteinMealReport;
  m3: ProteinMealReport;
  overall: {
    pass: boolean;
    msg: string;
  };
};

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// --- SIMULATION DATABASE FOR FIXES ---
const FIX_DB = {
  Vegetarian: [
    "Starter: Cucumber sticks with hummus -> Main: Paneer Bhurji + 1 Roti.",
    "Starter: Small Bowl of Sprout Salad -> Main: Dal Tadka + Rice.",
    "Starter: Tomato Soup -> Main: Soya Chunk Curry + Quinoa.",
    "Add a side of Greek Yogurt (Curd) to this meal.",
    "Add a scoop of Whey Protein in water before the meal.",
  ],
  Vegan: [
    "Starter: Carrot sticks -> Main: Tofu Scramble + Toast.",
    "Starter: Green Salad -> Main: Chickpea Curry + Rice.",
    "Starter: Clear Soup -> Main: Tempeh Stir-fry.",
    "Add a scoop of Pea/Rice Protein shake.",
    "Increase portion of lentils/beans by 50%.",
  ],
  "Non-Veg": [
    "Starter: 2 Boiled Eggs -> Main: Chicken Curry + Rice.",
    "Starter: Bone Broth -> Main: Grilled Fish + Salad.",
    "Starter: Minced Meat (Keema) + Roti.",
    "Add 150g Grilled Chicken Breast side.",
    "Add a can of Tuna in water.",
  ],
};

const getRandomFix = (diet: string) => {
  const fixes = FIX_DB[diet as keyof typeof FIX_DB] || FIX_DB.Vegetarian;
  return fixes[Math.floor(Math.random() * fixes.length)];
};

const COMMON_PROTEINS = [
  { label: "Eggs", icon: "🥚" },
  { label: "Chicken", icon: "🍗" },
  { label: "Beef", icon: "🥩" },
  { label: "Fish", icon: "🐟" },
  { label: "Yogurt", icon: "🥣" },
  { label: "Tofu", icon: "🌱" },
  { label: "Shake", icon: "🥤" },
];

// --- API CONFIGURATION ---
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

interface AIProteinInputProps {
  onValidate: ValidateFn<{
    logs: Record<string, string>;
    report: ProteinReport;
  }>;
  isIssue: boolean;
}

export const AIProteinInput: React.FC<AIProteinInputProps> = ({
  onValidate,
  isIssue,
}) => {
  const [logs, setLogs] = useState({ m1: "", m2: "", m3: "" });
  const [activeMeal, setActiveMeal] = useState<keyof typeof logs | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<ProteinReport | null>(null);

  const addTag = (text: string) => {
    if (!activeMeal) return;
    setLogs((prev) => ({
      ...prev,
      [activeMeal]: prev[activeMeal] ? `${prev[activeMeal]}, ${text}` : text,
    }));
  };

  const analyze = async () => {
    if (!logs.m1 && !logs.m2 && !logs.m3) return;
    setAnalyzing(true);

    // Construct prompt for AI
    const fullLog = `Meal 1: ${logs.m1}. Meal 2: ${logs.m2}. Meal 3: ${logs.m3}.`;

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Analyze these food inputs for protein sufficiency (target: ~30g/meal) and metabolic quality.
        Detect user's likely dietary preference (Veg, Vegan, or Non-Veg) based on inputs.
        CRITICAL: If user explicitly mentions a protein supplement (whey, shake, powder) or high protein source (chicken, eggs, paneer) in a meal, DO NOT flag it as low protein, even if it has carbs (like oats).
        If they seem Vegetarian/Vegan, ONLY suggest Veg/Vegan replacements.
        Return strict JSON (no markdown):
        {
          "detected_diet": "Veg/Non-Veg/Vegan",
          "m1": { "input_echo": "original text", "ingredients": "extracted items", "protein": "est. Xg", "analysis": "brief critique", "issue": "problem found (e.g. 'Low Leucine', 'High Carb') or None", "fix": "specific food alternative matching diet" },
          "m2": {...},
          "m3": {...},
          "overall": { "pass": boolean, "msg": "summary" }
        }. Logs: "${fullLog}"`;

        const apiUrl =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" +
          (GEMINI_API_KEY || "demo");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        const responseData = (await response.json()) as GeminiResponse;
        const candidate = responseData.candidates?.[0];
        const part = candidate?.content?.parts?.[0];
        const text =
          part?.text?.replace(/```json/g, "").replace(/```/g, "") ?? "";
        setReport(JSON.parse(text) as ProteinReport);
      } catch {
        fallbackSimulation();
      }
    } else {
      fallbackSimulation();
    }
    setAnalyzing(false);
  };

  const fallbackSimulation = () => {
    setTimeout(() => {
      const allText = (logs.m1 + " " + logs.m2 + " " + logs.m3).toLowerCase();

      const isNonVeg =
        /chicken|beef|steak|fish|salmon|tuna|pork|turkey|meat|egg|omelet/.test(
          allText,
        );
      const isVegan =
        !isNonVeg &&
        !/yogurt|curd|paneer|cheese|milk|whey|butter|ghee/.test(allText);
      const dietType = isNonVeg ? "Non-Veg" : isVegan ? "Vegan" : "Vegetarian";

      const analyzeMeal = (text: string) => {
        const t = (text || "").toLowerCase();
        const echo = text || "Skipped";
        if (!t)
          return {
            input_echo: echo,
            protein: "0g",
            analysis: "Skipped.",
            issue: "Fasting",
            fix: "Add a meal.",
          };

        // 0. Check for Supplements/Protein sources FIRST
        const hasSupplement =
          t.includes("whey") ||
          t.includes("protein") ||
          t.includes("shake") ||
          t.includes("powder");

        // 1. Carb Heavy Breakfasts (Oats/Toast)
        if (
          t.includes("cereal") ||
          t.includes("toast") ||
          t.includes("bagel") ||
          t.includes("oat") ||
          t.includes("poha") ||
          t.includes("upma") ||
          t.includes("paratha")
        ) {
          // If they added protein, it's good!
          if (
            hasSupplement ||
            t.includes("egg") ||
            t.includes("paneer") ||
            t.includes("tofu") ||
            t.includes("yogurt")
          ) {
            return {
              input_echo: echo,
              protein: "~25-30g",
              ingredients: "Carbs + Protein",
              analysis: "Balanced with protein.",
              issue: "None",
              fix: "Great job fortification.",
            };
          }

          const fix = getRandomFix(dietType);
          return {
            input_echo: echo,
            protein: "< 8g",
            ingredients: "Grains/Carbs",
            analysis: "Carb-dominant start.",
            issue: "High Glycemic Load",
            fix,
          };
        }

        // 2. Vegetarian Common Meals (Dal/Rice)
        if (
          (t.includes("dal") ||
            t.includes("rice") ||
            t.includes("roti") ||
            t.includes("sabzi") ||
            t.includes("curry")) &&
          !isNonVeg &&
          !hasSupplement
        ) {
          // Check if they mentioned paneer/soya
          if (
            t.includes("paneer") ||
            t.includes("soya") ||
            t.includes("tofu")
          ) {
            return {
              input_echo: echo,
              protein: "~20g",
              ingredients: "Mixed Meal",
              analysis: "Decent protein.",
              issue: "None",
              fix: "Ensure portion is sufficient.",
            };
          }
          return {
            input_echo: echo,
            protein: "~10-15g",
            ingredients: "Lentils/Grains",
            analysis: "Incomplete protein profile.",
            issue: "Low bioavailability",
            fix: getRandomFix(dietType),
          };
        }

        // 3. Salads/Light meals
        if (
          t.includes("salad") &&
          !t.includes("chicken") &&
          !t.includes("tofu") &&
          !t.includes("paneer") &&
          !t.includes("egg") &&
          !hasSupplement
        ) {
          return {
            input_echo: echo,
            protein: "< 5g",
            ingredients: "Vegetables",
            analysis: "Fiber rich, protein poor.",
            issue: "Catabolic Risk",
            fix: getRandomFix(dietType),
          };
        }

        // 4. Good Protein Sources
        if (
          t.includes("chicken") ||
          t.includes("beef") ||
          t.includes("fish") ||
          t.includes("paneer") ||
          t.includes("tofu") ||
          hasSupplement
        ) {
          return {
            input_echo: echo,
            protein: "~25-30g",
            ingredients: "Protein Source",
            analysis: "Good source.",
            issue: "None",
            fix: "Perfect.",
          };
        }

        // 5. Eggs specific
        if (t.includes("egg") || t.includes("omelet")) {
          if (t.includes("1") || t.includes("one"))
            return {
              input_echo: echo,
              protein: "~6g",
              ingredients: "1 Egg",
              analysis: "Volume too low.",
              issue: "Insufficient Protein",
              fix: "Increase to 3 eggs minimum.",
            };
          return {
            input_echo: echo,
            protein: "~18g+",
            ingredients: "Eggs",
            analysis: "Bioavailable gold standard.",
            issue: "None",
            fix: "Perfect.",
          };
        }

        return {
          input_echo: echo,
          protein: "Unknown",
          ingredients: "Mixed",
          analysis: "Unclear profile.",
          issue: "Potential low protein",
          fix: "Ensure 30g protein source is present.",
        };
      };

      const m1 = analyzeMeal(logs.m1);
      const m2 = analyzeMeal(logs.m2);
      const m3 = analyzeMeal(logs.m3);

      const pass =
        (m1.issue === "None" ||
          m1.protein.includes("30") ||
          m1.protein.includes("25")) &&
        (m2.issue === "None" ||
          m2.protein.includes("30") ||
          m2.protein.includes("25")) &&
        (m3.issue === "None" ||
          m3.protein.includes("30") ||
          m3.protein.includes("25"));

      setReport({
        detected_diet: dietType,
        m1,
        m2,
        m3,
        overall: {
          pass,
          msg: pass
            ? `Optimal ${dietType} distribution.`
            : `Protein intake inconsistent for ${dietType} diet.`,
        },
      });
      setAnalyzing(false);
    }, 1200);
  };

  if (report) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Detected Preference:
          </span>
          <span className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-bold text-emerald-400">
            <Leaf size={10} /> {report.detected_diet}
          </span>
        </div>

        <div className="grid gap-4">
          {(["m1", "m2", "m3"] as const).map((key, _i) => {
            const meal = report[key];
            const isGood = meal.issue === "None";
            return (
              <div
                key={key}
                className={`rounded-xl border p-5 ${isGood ? "border-emerald-500/30 bg-slate-900" : "border-rose-500/30 bg-slate-900"}`}
              >
                {/* Echo User Input */}
                <div className="mb-3 border-b border-slate-800/50 pb-3">
                  <div className="mb-1 flex items-center gap-2">
                    <History size={12} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      You ate:
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 italic">
                    &quot;{meal.input_echo}&quot;
                  </p>
                </div>

                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Stats
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      {meal.ingredients}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${isGood ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {meal.protein}
                    </span>
                  </div>
                </div>
                {!isGood ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <XCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-rose-500"
                      />
                      <div>
                        <span className="mb-0.5 block text-xs font-bold text-rose-400">
                          Problem: {meal.issue}
                        </span>
                        <p className="text-xs text-slate-400">
                          {meal.analysis}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-emerald-500/10 bg-emerald-950/20 p-3">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      <div>
                        <span className="mb-0.5 block text-xs font-bold text-emerald-400">
                          Easy Fix ({report.detected_diet}):
                        </span>
                        <p className="text-xs text-slate-300">{meal.fix}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span className="text-xs">{meal.analysis}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Button
          mode="instant"
          variant={isIssue ? "rose" : "emerald"}
          onClick={() => onValidate(report.overall.pass, { logs, report })}
          disabled={isIssue}
        >
          {isIssue ? "Review Issues Above" : "Proceed"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 scrollbar-hover:scrollbar-thumb-slate-500 flex gap-2 overflow-x-auto pb-2">
        {COMMON_PROTEINS.map((item) => (
          <button
            key={item.label}
            onClick={() => addTag(item.label)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${!activeMeal ? "cursor-not-allowed border-slate-700 opacity-50" : "border-slate-600 bg-slate-800 text-slate-300 hover:border-emerald-500"}`}
          >
            <span>{item.icon}</span> {item.label}{" "}
            {activeMeal && <Plus size={10} />}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {(["m1", "m2", "m3"] as const).map((m, i) => (
          <div key={m} className="group relative">
            <label className="absolute -top-2.5 left-3 bg-slate-900 px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {i === 0 ? "Breakfast" : i === 1 ? "Lunch" : "Dinner"}
            </label>
            <input
              placeholder={
                i === 0 ? "e.g. 2 parathas with curd" : "e.g. Bowl of dal rice"
              }
              value={logs[m]}
              onFocus={() => setActiveMeal(m)}
              onChange={(e) => setLogs({ ...logs, [m]: e.target.value })}
              className={`w-full rounded-xl border-2 border-slate-800 bg-transparent p-4 text-sm text-white transition-colors outline-none placeholder:text-slate-700 focus:border-emerald-500 ${activeMeal === m ? "border-emerald-500" : ""}`}
            />
          </div>
        ))}
      </div>
      <Button
        mode="instant"
        variant="slate"
        onClick={analyze}
        disabled={analyzing || (!logs.m1 && !logs.m2 && !logs.m3)}
        loading={analyzing}
      >
        <BrainCircuit size={18} />
        {analyzing ? "Analyzing Ingredients..." : "Generate Nutrition Report"}
      </Button>
    </div>
  );
};
