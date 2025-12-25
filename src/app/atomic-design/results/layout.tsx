import { type Metadata } from "next";

// Results page metadata
export const metadata: Metadata = {
  title: "Metabolic Debugger - Results",
  description: "Your personalized metabolic analysis and action plan",
};

// Inherits layout from parent atomic-design route
export default function ResultsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
