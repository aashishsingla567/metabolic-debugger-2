"use client";

import type { ReactNode } from "react";
import React, { useState, useEffect, useRef } from "react";
import {
  Moon,
  Clock,
  Utensils,
  Leaf,
  Footprints,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Lock,
  Loader2,
  ShieldCheck,
  Smartphone,
  BrainCircuit,
  ChevronDown,
  Plus,
  Edit2,
  History,
  ArrowRight,
  Target,
} from "lucide-react";

// --- API CONFIGURATION ---
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

// --- Shared Types ---
type StepType = "time-calc" | "meal-log" | "ai-analyze" | "select";

type StepOption = {
  label: string;
  value: string;
  pass: boolean;
};

type Step = {
  id: string;
  title: string;
  question: string;
  inputLabel: string;
  type: StepType;
  icon: ReactNode;
  noAction: string;
  reason: string;
  detail: string;
  options?: StepOption[];
};

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

type StepStatus = "active" | "completed" | "locked" | "issue";

// --- Data & Logic ---

const STEPS: Step[] = [
  {
    id: "sleep",
    title: "Sleep Duration",
    question: "Circadian Foundation",
    inputLabel: "When did you sleep yesterday?",
    type: "time-calc",
    icon: <Moon size={20} />,
    noAction: "Prioritize Sleep Quantity",
    reason: "Willpower is chemically impossible when sleep-deprived.",
    detail:
      "Less than 7 hours spikes ghrelin (hunger) and slashes insulin sensitivity. You cannot out-diet poor sleep.",
  },
  {
    id: "meal-timing",
    title: "Meal Consistency",
    question: "Metabolic Rhythm",
    inputLabel: "Log your meal times",
    type: "meal-log",
    icon: <Clock size={20} />,
    noAction: "Fix Meal Timing",
    reason: "Erratic eating signals 'famine' stress to the body.",
    detail:
      "Your circadian rhythm regulates metabolism. Eating at random times causes the body to hoard fat as a safety mechanism.",
  },
  {
    id: "protein",
    title: "Protein Analysis",
    question: "Satiety Architecture",
    inputLabel: "What did you eat yesterday?",
    type: "ai-analyze",
    icon: <Utensils size={20} />,
    noAction: "Increase Protein Intake",
    reason: "Protein is the biological 'off switch' for hunger.",
    detail:
      "If you don't hit a leucine threshold (~30g/meal), your brain keeps the hunger switch on, searching for amino acids.",
  },
  {
    id: "order",
    title: "Eating Sequence",
    question: "Glucose Control",
    inputLabel: "What did you eat first in your last meal?",
    type: "select",
    options: [
      { label: "Vegetables / Fiber", value: "veg", pass: true },
      { label: "Protein / Meat", value: "protein", pass: true },
      { label: "Carbs (Rice/Bread)", value: "carbs", pass: false },
      { label: "Mixed everything", value: "mixed", pass: false },
    ],
    icon: <Leaf size={20} />,
    noAction: "Sequence Your Meals",
    reason: "Eating carbs first spikes insulin and causes a crash.",
    detail:
      "Fiber first creates a mesh in the gut. Protein second signals satiety. Carbs last have 70% less impact on blood sugar.",
  },
  {
    id: "hygiene",
    title: "Eating Hygiene",
    question: "Sensory Awareness",
    inputLabel: "Were you distracted while eating?",
    type: "select",
    options: [
      { label: "Yes (TV, Phone, Laptop)", value: "distracted", pass: false },
      { label: "No, just eating", value: "mindful", pass: true },
    ],
    icon: <Smartphone size={20} />,
    noAction: "Remove Distractions",
    reason: "Distracted eating blocks the 'I'm Full' signal.",
    detail:
      "Your brain needs to register the sensory experience of eating to start digestion. 'Mindless' eating leads to overconsumption.",
  },
  {
    id: "movement",
    title: "Post-Meal Action",
    question: "Glucose Disposal",
    inputLabel: "Did you move after your last meal?",
    type: "select",
    options: [
      { label: "Yes, took a walk", value: "walk", pass: true },
      { label: "No, stayed sedentary", value: "sit", pass: false },
    ],
    icon: <Footprints size={20} />,
    noAction: "Walk After Meals",
    reason: "Walking uses glucose immediately without insulin.",
    detail:
      "A 10-minute walk creates a 'glucose sink' in your leg muscles, pulling sugar from the blood physically rather than chemically.",
  },
];

// --- Sub-Components ---

type HoldButtonProps = {
  onComplete: () => void;
  label: string;
  holdingLabel: string;
  disabled?: boolean;
  theme?: "emerald" | "rose";
};

const HoldButton: React.FC<HoldButtonProps> = ({
  onComplete,
  label,
  holdingLabel,
  disabled,
  theme = "emerald",
}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const colors = {
    emerald: {
      bg: "bg-emerald-600 hover:bg-emerald-500",
      fill: "bg-emerald-400",
      text: "text-white",
    },
    rose: {
      bg: "bg-rose-600 hover:bg-rose-500",
      fill: "bg-rose-400",
      text: "text-white",
    },
  };
  const currentTheme = colors[theme];

  useEffect(() => {
    if (progress >= 100) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      onComplete();
      setIsHolding(false);
      setProgress(0);
    }
  }, [progress, onComplete]);

  const startHold = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    if (
      disabled ||
      (e.type === "mousedown" &&
        (e as React.MouseEvent<HTMLButtonElement>).button !== 0)
    )
      return;
    setIsHolding(true);
    setShake(false);
    if (navigator.vibrate) navigator.vibrate(15);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 4;
      });
    }, 16);
  };

  const endHold = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    if (progress < 100) {
      if (isHolding) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setIsHolding(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      disabled={disabled}
      className={`relative flex w-full touch-none items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 font-bold shadow-lg transition-all select-none ${currentTheme.bg} ${currentTheme.text} ${disabled ? "cursor-not-allowed opacity-50 grayscale" : "cursor-pointer active:scale-95"}`}
      style={{
        animation: shake
          ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
          : "none",
      }}
    >
      <div
        className={`absolute inset-0 ${currentTheme.fill} opacity-30 transition-none`}
        style={{ width: `${progress}%` }}
      />
      <span className="relative z-10 flex items-center gap-2 text-xs tracking-wider uppercase">
        {progress >= 100 ? (
          <CheckCircle2 size={16} />
        ) : theme === "rose" ? (
          <AlertTriangle size={16} />
        ) : (
          <ShieldCheck size={16} />
        )}
        {isHolding ? holdingLabel : label}
      </span>
    </button>
  );
};

// --- Input Modules ---

type SleepData = {
  duration: number;
  bedtime: string;
  waketime: string;
};

const SleepInput: React.FC<{
  onValidate: ValidateFn<SleepData>;
  isIssue: boolean;
}> = ({ onValidate, isIssue }) => {
  const [bedtime, setBedtime] = useState("23:00");
  const [waketime, setWaketime] = useState("07:00");
  const [duration, setDuration] = useState(8);

  useEffect(() => {
    const [h1, m1] = bedtime.split(":").map(Number);
    const [h2, m2] = waketime.split(":").map(Number);
    const h1Num = h1 ?? 0;
    const m1Num = m1 ?? 0;
    const h2Num = h2 ?? 0;
    const m2Num = m2 ?? 0;
    let diff = h2Num + m2Num / 60 - (h1Num + m1Num / 60);
    if (diff < 0) diff += 24;
    setDuration(parseFloat(diff.toFixed(1)));
  }, [bedtime, waketime]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
            Bedtime
          </label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full bg-transparent text-xl text-white focus:outline-none"
          />
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
            Wake Up
          </label>
          <input
            type="time"
            value={waketime}
            onChange={(e) => setWaketime(e.target.value)}
            className="w-full bg-transparent text-xl text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <span className="text-sm text-slate-400">Total Rest</span>
        <span
          className={`text-2xl font-black ${duration >= 7 ? "text-emerald-400" : "text-rose-400"}`}
        >
          {duration}{" "}
          <span className="text-sm font-normal text-slate-500">hours</span>
        </span>
      </div>

      <button
        onClick={() =>
          onValidate(duration >= 7, { duration, bedtime, waketime })
        }
        disabled={isIssue}
        className={`w-full rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95 ${isIssue ? "cursor-not-allowed border border-rose-500/50 bg-rose-900/20 text-rose-400" : "bg-slate-100 text-slate-900 hover:bg-white"}`}
      >
        {isIssue ? "Insufficient Sleep Detected" : "Confirm Sleep Schedule"}
      </button>
    </div>
  );
};

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

const MealLogInput: React.FC<{
  onValidate: ValidateFn<{
    meals: MealTimes;
    analysis: MealAnalysis;
    isDaily: boolean;
  }>;
  isIssue: boolean;
}> = ({ onValidate, isIssue }) => {
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
        <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
            1
          </div>
          <input
            type="time"
            value={meals.m1}
            onChange={(e) => setMeals({ ...meals, m1: e.target.value })}
            className="bg-transparent text-white focus:outline-none"
          />
          <span className="ml-auto text-xs tracking-wider text-slate-500 uppercase">
            Breakfast
          </span>
        </div>

        {/* Visual Connector 1 */}
        <div className="flex h-6 items-center gap-4 pl-4">
          <div className="mx-3.75 h-full w-0.5 bg-slate-800"></div>
          <span
            className={`font-mono text-xs ${parseFloat(analysis.gap1) >= 3 && parseFloat(analysis.gap1) <= 6.5 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {analysis.gap1}h Fast
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
            2
          </div>
          <input
            type="time"
            value={meals.m2}
            onChange={(e) => setMeals({ ...meals, m2: e.target.value })}
            className="bg-transparent text-white focus:outline-none"
          />
          <span className="ml-auto text-xs tracking-wider text-slate-500 uppercase">
            Lunch
          </span>
        </div>

        {/* Visual Connector 2 */}
        <div className="flex h-6 items-center gap-4 pl-4">
          <div className="mx-3.75 h-full w-0.5 bg-slate-800"></div>
          <span
            className={`font-mono text-xs ${parseFloat(analysis.gap2) >= 3 && parseFloat(analysis.gap2) <= 6.5 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {analysis.gap2}h Fast
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
            3
          </div>
          <input
            type="time"
            value={meals.m3}
            onChange={(e) => setMeals({ ...meals, m3: e.target.value })}
            className="bg-transparent text-white focus:outline-none"
          />
          <span className="ml-auto text-xs tracking-wider text-slate-500 uppercase">
            Dinner
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsDaily(!isDaily)}
        className={`flex w-full items-center justify-center gap-3 rounded-xl border p-4 transition-all ${isDaily ? "border-emerald-500/50 bg-emerald-900/20 text-emerald-100" : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"}`}
      >
        <div
          className={`flex h-5 w-5 items-center justify-center rounded border ${isDaily ? "border-emerald-500 bg-emerald-500" : "border-slate-500"}`}
        >
          {isDaily && <CheckCircle2 size={14} className="text-slate-900" />}
        </div>
        <span className="text-sm font-medium">I eat at these times daily</span>
      </button>

      <button
        onClick={() =>
          onValidate(analysis.isOptimal, { meals, analysis, isDaily })
        }
        disabled={isIssue}
        className={`w-full rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95 ${isIssue ? "cursor-not-allowed border border-rose-500/50 bg-rose-900/20 text-rose-400" : "bg-slate-100 text-slate-900 hover:bg-white"}`}
      >
        {isIssue ? "Rhythm Issues Found" : "Analyze Rhythm"}
      </button>
    </div>
  );
};

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

const AIProteinInput: React.FC<{
  onValidate: ValidateFn<{
    logs: Record<string, string>;
    report: ProteinReport;
  }>;
  isIssue: boolean;
}> = ({ onValidate, isIssue }) => {
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

    // Construct the prompt for AI
    const fullLog = `Meal 1: ${logs.m1}. Meal 2: ${logs.m2}. Meal 3: ${logs.m3}.`;

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Analyze these food inputs for protein sufficiency (target: ~30g/meal) and metabolic quality.
        Detect the user's likely dietary preference (Veg, Vegan, or Non-Veg) based on the inputs.
        CRITICAL: If the user explicitly mentions a protein supplement (whey, shake, powder) or high protein source (chicken, eggs, paneer) in a meal, DO NOT flag it as low protein, even if it has carbs (like oats).
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

        // 0. Check for Supplements/Fortification FIRST
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
        <button
          onClick={() => onValidate(report.overall.pass, { logs, report })}
          disabled={isIssue}
          className={`w-full rounded-xl py-4 font-bold shadow-lg ${isIssue ? "cursor-not-allowed border border-rose-500/50 bg-rose-900/20 text-rose-400" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
        >
          {isIssue ? "Review Issues Above" : "Proceed"}
        </button>
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
      <button
        onClick={analyze}
        disabled={analyzing || (!logs.m1 && !logs.m2 && !logs.m3)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-4 font-bold text-slate-900 shadow-lg transition-all hover:bg-white disabled:opacity-50"
      >
        {analyzing ? (
          <Loader2 className="animate-spin" />
        ) : (
          <BrainCircuit size={18} />
        )}{" "}
        {analyzing ? "Analyzing Ingredients..." : "Generate Nutrition Report"}
      </button>
    </div>
  );
};

const SelectorInput: React.FC<{
  options: StepOption[];
  onValidate: ValidateFn<{ selection: string; value: string }>;
  isIssue: boolean;
}> = ({ options, onValidate, isIssue }) => (
  <div className="grid grid-cols-1 gap-3">
    {options.map((opt) => (
      <button
        key={opt.label}
        onClick={() =>
          onValidate(opt.pass, { selection: opt.label, value: opt.value })
        }
        disabled={isIssue}
        className={`group flex items-center justify-between rounded-xl border bg-slate-900 px-5 py-4 text-left shadow-sm transition-all ${isIssue ? "cursor-not-allowed border-slate-800 opacity-50 grayscale" : "cursor-pointer border-slate-700 hover:border-emerald-500 hover:bg-slate-800"} `}
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

// --- Accordion Item Component ---

const AccordionStep: React.FC<{
  step: Step;
  status: StepStatus;
  onAnswer: ValidateFn;
  index: number;
}> = ({ step, status, onAnswer, index }) => {
  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isIssue = status === "issue";
  const fixRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to fix section when issue is detected
  useEffect(() => {
    if (isIssue && fixRef.current) {
      setTimeout(() => {
        fixRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [isIssue]);

  const renderInput = () => {
    switch (step.type) {
      case "time-calc":
        return <SleepInput onValidate={onAnswer} isIssue={isIssue} />;
      case "meal-log":
        return <MealLogInput onValidate={onAnswer} isIssue={isIssue} />;
      case "ai-analyze":
        return <AIProteinInput onValidate={onAnswer} isIssue={isIssue} />;
      case "select":
        return (
          <SelectorInput
            options={step.options ?? []}
            onValidate={onAnswer}
            isIssue={isIssue}
          />
        );
      default:
        return null;
    }
  };

  const isExpanded = isActive || isIssue;

  return (
    <div
      className={`border-b border-slate-800 transition-all duration-500 last:border-0 ${isExpanded ? "bg-slate-950 py-4" : "bg-transparent py-0"}`}
    >
      <style>{`
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>

      {/* Header Row */}
      <div
        className={`flex items-center gap-4 px-4 py-4 ${isLocked ? "opacity-30" : "opacity-100"} ${isExpanded ? "mb-4" : ""}`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${isCompleted ? "border-emerald-500 bg-emerald-500 text-slate-900" : isActive ? "border-emerald-500 bg-slate-800 text-emerald-400" : "border-slate-700 bg-slate-900 text-slate-500"}`}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : index + 1}
        </div>
        <div className="flex-1">
          <h3
            className={`text-lg font-bold ${isExpanded ? "text-white" : "text-slate-400"}`}
          >
            {step.title}
          </h3>
          {!isExpanded && (
            <p className="text-xs text-slate-600">{step.question}</p>
          )}
        </div>
        {isCompleted && (
          <div className="text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
        )}
        {isIssue && (
          <div className="text-rose-500">
            <AlertTriangle size={20} />
          </div>
        )}
      </div>

      {/* Expandable Body */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "max-h-500 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="grid grid-cols-1 gap-8 px-4 pb-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT COL: Input / Interaction */}
          <div
            className={`animate-in slide-in-from-left-4 order-2 delay-100 duration-700 lg:order-1 ${isIssue ? "pointer-events-none" : "opacity-100"}`}
          >
            <div
              className={`rounded-2xl border bg-slate-900/50 p-6 shadow-2xl transition-colors duration-500 ${isIssue ? "border-rose-900/30" : "border-slate-800"}`}
            >
              <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 uppercase">
                <Edit2 size={14} /> {step.inputLabel}
              </h4>
              {renderInput()}
            </div>
          </div>

          {/* RIGHT COL: Context / Education / Results */}
          <div className="animate-in slide-in-from-right-4 order-1 duration-700 lg:order-2">
            <div
              className={`flex h-full flex-col rounded-2xl border p-6 transition-colors duration-500 ${isIssue ? "border-rose-500/30 bg-rose-950/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]" : "border-slate-700 bg-slate-800/30"}`}
            >
              {/* Educational Header */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-800 p-2 text-emerald-400">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {step.question}
                  </h4>
                </div>
                <p className="text-lg leading-relaxed text-slate-400">
                  {step.detail}
                </p>
              </div>

              {/* Scientific Reason */}
              <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
                <div className="flex items-start gap-3">
                  <BrainCircuit
                    size={20}
                    className="mt-1 shrink-0 text-indigo-400"
                  />
                  <div>
                    <span className="mb-1 block text-xs font-bold tracking-wider text-indigo-300 uppercase">
                      The Science
                    </span>
                    <p className="text-sm text-slate-300 italic">
                      &quot;{step.reason}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottleneck Alert (Only if Issue) */}
              {isIssue && (
                <div
                  ref={fixRef}
                  className="animate-in zoom-in mt-auto duration-300"
                >
                  <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 font-bold text-rose-400">
                      <AlertTriangle size={18} />
                      <span>Bottleneck Detected</span>
                    </div>
                    <p className="mb-4 text-sm text-rose-200/80">
                      Your inputs indicate this area needs optimization before
                      proceeding.
                    </p>
                    <HoldButton
                      onComplete={() => onAnswer(true)}
                      theme="rose"
                      label="I Commit to Fix This"
                      holdingLabel="Locking in..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Final Report Component ---

const FinalReport: React.FC<{
  reportData: Record<string, unknown>;
  onRestart: () => void;
}> = ({ reportData, onRestart }) => {
  // Helper to determine if a step failed based on DATA
  const checkStatus = (id: string) => {
    const data = reportData[id];
    if (!data) return "unknown";

    switch (id) {
      case "sleep":
        return (data as SleepData).duration >= 7 ? "pass" : "fail";
      case "meal-timing":
        const mealData = data as { analysis: MealAnalysis; isDaily: boolean };
        return mealData.analysis?.isOptimal && mealData.isDaily
          ? "pass"
          : "fail";
      case "protein":
        const proteinData = data as { report: ProteinReport };
        return proteinData.report?.overall?.pass ? "pass" : "fail";
      case "order":
      case "hygiene":
      case "movement":
        const selectData = data as { value: string };
        return ["veg", "protein"].includes(selectData.value) ? "pass" : "fail";
      default:
        return "pass";
    }
  };

  const generateActionPlan = () => {
    const actions = [];

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
      const mealTimingData = reportData["meal-timing"] as
        | { meals: MealTimes }
        | undefined;
      const meals = mealTimingData?.meals ?? {
        m1: "08:00",
        m2: "13:00",
        m3: "19:00",
      };
      actions.push({
        step: "Meals",
        title: "Circadian Rhythm",
        detail: "Your eating window is irregular or gaps are suboptimal.",
        steps: [
          `Stick to ${meals.m1 ?? "Breakfast"}, ${meals.m2 ?? "Lunch"}, ${meals.m3 ?? "Dinner"} everyday ±30mins.`,
          "Do not snack between these meals.",
          "Finish dinner 3 hours before sleep.",
        ],
      });
    }

    if (checkStatus("protein") === "fail") {
      const proteinData = reportData.protein as
        | { report: ProteinReport }
        | undefined;
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
  const systemScore = Math.round(
    ((STEPS.length - actionPlan.length) / STEPS.length) * 100,
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
              {STEPS.filter((s) => checkStatus(s.id) === "pass").map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4"
                >
                  <div className="text-emerald-500">{s.icon}</div>
                  <span className="font-medium text-slate-200">{s.title}</span>
                </div>
              ))}
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
            <History size={18} /> Restart Diagnostic
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Top Header Stepper ---

const TopStepper: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => (
  <div className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 scrollbar-hover:scrollbar-thumb-slate-500 sticky top-0 z-50 overflow-x-auto border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur-md">
    <div className="mx-auto flex max-w-6xl min-w-[600px] items-center justify-between">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <div
            key={idx}
            className="group relative flex cursor-default flex-col items-center gap-2"
          >
            <div
              className={`h-3 w-3 rounded-full transition-all duration-500 ${isActive ? "scale-125 bg-emerald-500 shadow-[0_0_10px_emerald]" : isCompleted ? "bg-emerald-800" : "bg-slate-800"}`}
            ></div>
            <span
              className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${isActive ? "text-white" : isCompleted ? "text-emerald-700" : "text-slate-700"}`}
            >
              Step {idx + 1}
            </span>
            {/* Connecting Line */}
            {idx < totalSteps - 1 && (
              <div
                className={`absolute top-1.5 left-[50%] -z-10 h-0.5 w-[calc(100%_+_2rem)] ${idx < currentStep ? "bg-emerald-900" : "bg-slate-900"}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<Record<string, "yes" | "no">>({});
  const [reportData, setReportData] = useState<Record<string, unknown>>({}); // New: Store detailed data

  const handleAnswer: ValidateFn = (isYes, data) => {
    const stepId = STEPS[currentStepIndex]!.id;
    setHistory((prev) => ({ ...prev, [stepId]: isYes ? "yes" : "no" }));

    // Store specific step data if provided (preserve old data if null passed on commit)
    if (data) {
      setReportData((prev) => ({ ...prev, [stepId]: data }));
    }

    if (isYes) {
      if (currentStepIndex < STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500);
      } else {
        setTimeout(() => setShowResult(true), 600);
      }
    }
    // Note: If isYes is false, we stay on the step (Accordion handles the "Issue" state)
    // The user must commit to fix (which calls handleAnswer(true)) to proceed.
  };

  const resetFlow = () => {
    setCurrentStepIndex(0);
    setShowResult(false);
    setHistory({});
    setReportData({});
  };

  return (
    <div className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 scrollbar-hover:scrollbar-thumb-slate-500 min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
      <style>{`
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>

      {!showResult && (
        <TopStepper currentStep={currentStepIndex} totalSteps={STEPS.length} />
      )}

      <div className="mx-auto max-w-5xl pt-8 pb-32">
        {!showResult && (
          <div className="mb-12 px-4 text-center">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              Metabolic{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Debugger
              </span>
            </h1>
            <p className="text-lg text-slate-400">
              Identify the rate-limiting step in your biology.
            </p>
          </div>
        )}

        {/* Main Content Area */}
        {!showResult ? (
          <div className="border-t border-slate-800">
            {STEPS.map((step, idx) => {
              let status: StepStatus = "locked";
              if (idx < currentStepIndex) status = "completed";
              if (idx === currentStepIndex)
                status = history[step.id] === "no" ? "issue" : "active";
              return (
                <AccordionStep
                  key={step.id}
                  step={step}
                  status={status}
                  onAnswer={handleAnswer}
                  index={idx}
                />
              );
            })}
          </div>
        ) : (
          <FinalReport reportData={reportData} onRestart={resetFlow} />
        )}
      </div>
    </div>
  );
}
