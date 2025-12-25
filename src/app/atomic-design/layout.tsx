import { type Metadata } from "next";

// Atomic design route metadata
export const metadata: Metadata = {
  title: "Metabolic Debugger - Atomic Design",
  description:
    "Testing the new atomic design component architecture with React Server Components",
};

// Route-specific layout - common structure for all atomic-design routes
export default function AtomicDesignLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-5xl pt-8 pb-32">
        {/* Common Header for all atomic-design routes */}
        <div className="mb-12 px-4 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Metabolic{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Debugger
            </span>
          </h1>
          <p className="text-lg text-slate-400">
            Testing the new atomic design component architecture with React
            Server Components
          </p>
        </div>

        {/* Page-specific content */}
        {children}
      </div>
    </div>
  );
}
