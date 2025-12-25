// Server Component for results page
export const dynamic = "force-dynamic"; // Always render dynamically since we need localStorage data

import FinalReportClient from "./FinalReportClient";

export default function ResultsPage() {
  return (
    <div className="mb-8">
      {/* Results-specific subtitle */}
      <div className="mb-8 px-4 text-center">
        <p className="text-lg font-medium text-emerald-400">
          Your personalized metabolic analysis and action plan
        </p>
      </div>

      {/* Client Component with localStorage data */}
      <FinalReportClient />
    </div>
  );
}
