import React from "react";
import {
  Moon,
  Clock,
  Utensils,
  Leaf,
  Footprints,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  History,
  Target,
  Activity,
  BrainCircuit,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const iconMap = {
  moon: Moon,
  clock: Clock,
  utensils: Utensils,
  leaf: Leaf,
  footprints: Footprints,
  checkCircle: CheckCircle2,
  xCircle: XCircle,
  alertTriangle: AlertTriangle,
  lock: Lock,
  history: History,
  target: Target,
  activity: Activity,
  brainCircuit: BrainCircuit,
  chevronDown: ChevronDown,
  shieldCheck: ShieldCheck,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = "",
}) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} />;
};
