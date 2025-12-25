// Server Component for static data
export const dynamic = "force-static"; // Enable static optimization

import type { ReactNode } from "react";
import AtomicDesignClient from "./AtomicDesignClient";

// Static data - Server Component (can be cached)
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

const STEPS: Step[] = [
  {
    id: "sleep",
    title: "Sleep Duration",
    question: "Circadian Foundation",
    inputLabel: "When did you sleep yesterday?",
    type: "time-calc",
    icon: null, // Will be rendered on client
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
    icon: null, // Will be rendered on client
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
    icon: null, // Will be rendered on client
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
    icon: null, // Will be rendered on client
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
    icon: null, // Will be rendered on client
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
    icon: null, // Will be rendered on client
    noAction: "Walk After Meals",
    reason: "Walking uses glucose immediately without insulin.",
    detail:
      "A 10-minute walk creates a 'glucose sink' in your leg muscles, pulling sugar from the blood physically rather than chemically.",
  },
];

// Server Component - handles static content and caching
export default function AtomicDesignPage() {
  return (
    <AtomicDesignClient
      steps={STEPS}
      title="Metabolic Debugger - Atomic Design"
      subtitle="Testing the new atomic design component architecture"
    />
  );
}
