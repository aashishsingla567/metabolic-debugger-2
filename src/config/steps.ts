import type { Step } from "@/lib/types";

// The main diagnostic steps configuration
export const STEPS: Step[] = [
  {
    id: "sleep",
    title: "Sleep Duration",
    question: "Circadian Foundation",
    inputLabel: "When did you sleep yesterday?",
    type: "time-calc",
    icon: "Moon",
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
    icon: "Clock",
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
    icon: "Utensils",
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
    icon: "Leaf",
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
    icon: "Smartphone",
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
    icon: "Footprints",
    noAction: "Walk After Meals",
    reason: "Walking uses glucose immediately without insulin.",
    detail:
      "A 10-minute walk creates a 'glucose sink' in your leg muscles, pulling sugar from the blood physically rather than chemically.",
  },
];

// Common protein sources for quick tagging
export const COMMON_PROTEINS = [
  { label: "Eggs", icon: "🥚" },
  { label: "Chicken", icon: "🍗" },
  { label: "Beef", icon: "🥩" },
  { label: "Fish", icon: "🐟" },
  { label: "Yogurt", icon: "🥣" },
  { label: "Tofu", icon: "🌱" },
  { label: "Shake", icon: "🥤" },
] as const;

// API Configuration
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

// Icon mapping for step icons
export const STEP_ICONS = {
  Moon: "Moon",
  Clock: "Clock",
  Utensils: "Utensils",
  Leaf: "Leaf",
  Smartphone: "Smartphone",
  Footprints: "Footprints",
} as const;
