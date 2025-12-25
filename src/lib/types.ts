import type { ReactNode } from "react";

// --- Core Step Types ---
export type StepType = "time-calc" | "meal-log" | "ai-analyze" | "select";
export type StepStatus = "active" | "completed" | "locked" | "issue";

export interface StepOption {
  label: string;
  value: string;
  pass: boolean;
}

export interface Step {
  id: string;
  title: string;
  question: string;
  inputLabel: string;
  type: StepType;
  icon: string; // Icon name as string for configuration
  noAction: string;
  reason: string;
  detail: string;
  options?: StepOption[];
}

// --- Data Payload Types ---
export type SleepData = {
  duration: number;
  bedtime: string;
  waketime: string;
};

export type MealTimes = {
  m1: string;
  m2: string;
  m3: string;
};

export type MealAnalysis = {
  gap1: string;
  gap2: string;
  isOptimal: boolean;
  msg: string;
  isSpacingGood?: boolean; // Critical for visual connector coloring
};

export type ProteinLog = {
  m1: string;
  m2: string;
  m3: string;
};

// The complex nested report structure from the Mock AI
export type ProteinReport = {
  detected_diet: "Vegetarian" | "Vegan" | "Non-Veg";
  m1: ProteinMealAnalysis;
  m2: ProteinMealAnalysis;
  m3: ProteinMealAnalysis;
  overall: {
    pass: boolean;
    msg: string;
  };
};

export type ProteinMealAnalysis = {
  input_echo: string;
  ingredients?: string;
  protein: string;
  analysis: string;
  issue: string;
  fix?: string;
};

// --- Final Report Types ---
export type ActionPlan = {
  step: string;
  title: string;
  detail: string;
  steps: string[];
};

export type FinalReportData = {
  sleep?: SleepData;
  "meal-timing"?: {
    meals: MealTimes;
    analysis: MealAnalysis;
    isDaily: boolean;
  };
  protein?: {
    logs: ProteinLog;
    report: ProteinReport;
  };
  order?: { selection: string; value: string };
  hygiene?: { selection: string; value: string };
  movement?: { selection: string; value: string };
};

// --- Validation & Analysis Types ---
export type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

export type AnalysisResult<T> = {
  pass: boolean;
  data: T;
  recommendations?: string[];
};

// --- API Types ---
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export type DietType = "Vegetarian" | "Vegan" | "Non-Veg";

// --- Component Props Types ---

// Atom Props
export interface AtomProps {
  className?: string;
}

// Button Props (Enhanced HoldButton)
export interface ButtonProps {
  mode?: "instant" | "hold";
  children: React.ReactNode;
  onClick?: () => void;
  onComplete?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "slate" | "emerald" | "rose";
  className?: string;
  holdingLabel?: string;
}

// Input Props
export interface InputFieldProps {
  type?: "text" | "time";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

// Chip Props (Protein tags)
export interface ChipProps {
  label: string;
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Status Indicator Props
export interface StatusIndicatorProps {
  status: StepStatus;
  index: number;
  className?: string;
}

// Icon Props
export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

// Loader Props
export interface LoaderProps {
  size?: number;
  className?: string;
}

// Molecule Props
export interface MoleculeProps {
  className?: string;
  children?: ReactNode;
}

// Step Header Props
export interface StepHeaderProps {
  step: Step;
  status: StepStatus;
  index: number;
  isExpanded?: boolean;
  className?: string;
}

// Time Field Props
export interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

// Meal Gap Connector Props
export interface MealGapConnectorProps {
  hours: string;
  isGood: boolean;
  className?: string;
}

// Bottleneck Alert Props
export interface BottleneckAlertProps {
  onCommit: () => void;
  disabled?: boolean;
  className?: string;
}

// Top Stepper Props
export interface TopStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  className?: string;
}

// Organism Props
export interface OrganismProps {
  className?: string;
  children?: ReactNode;
}

// Sleep Calculator Props
export interface SleepCalculatorProps {
  onValidate: ValidateFn<SleepData>;
  isIssue: boolean;
  initialData?: SleepData;
}

// Meal Timeline Props
export interface MealTimelineProps {
  onValidate: ValidateFn<{
    meals: MealTimes;
    analysis: MealAnalysis;
    isDaily: boolean;
  }>;
  isIssue: boolean;
  initialData?: {
    meals: MealTimes;
    isDaily: boolean;
  };
}

// Protein Analyzer Props
export interface ProteinAnalyzerProps {
  onValidate: ValidateFn<{
    logs: ProteinLog;
    report: ProteinReport;
  }>;
  isIssue: boolean;
  initialData?: ProteinLog;
}

// Selector Input Props
export interface SelectorInputProps {
  options: StepOption[];
  onValidate: ValidateFn<{ selection: string; value: string }>;
  isIssue: boolean;
}

// Step Accordion Props
export interface StepAccordionProps {
  step: Step;
  status: StepStatus;
  onAnswer: ValidateFn;
  index: number;
}

// Template Props
export interface TemplateProps {
  className?: string;
  children?: ReactNode;
}

// Wizard Layout Props
export interface WizardLayoutProps {
  step: Step;
  status: StepStatus;
  onAnswer: ValidateFn;
  index: number;
  children: ReactNode; // The input component
}

// Final Report Props
export interface FinalReportProps {
  reportData: FinalReportData;
  onRestart: () => void;
  className?: string;
}

// --- Hook Types ---
export interface UseMetabolicDebuggerReturn {
  currentStepIndex: number;
  showResult: boolean;
  history: Record<string, "yes" | "no">;
  reportData: FinalReportData;
  handleAnswer: ValidateFn;
  resetFlow: () => void;
}

// --- Common Component Props ---
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}
