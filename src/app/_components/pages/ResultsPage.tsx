"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FinalReport } from "../organisms/FinalReport";
import { store } from "@/lib/store";

export function ResultsPage() {
  const router = useRouter();
  const [reportData, setReportData] = React.useState<Record<
    string,
    unknown
  > | null>(null);

  useEffect(() => {
    const savedData = store.get();
    if (savedData?.reportData) {
      setReportData(savedData.reportData);
    } else {
      router.push("/");
    }
  }, [router]);

  if (!reportData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in mx-auto max-w-4xl p-4 duration-500 md:p-0">
      <FinalReport
        reportData={reportData}
        onRestart={() => {
          store.remove("reportData");
          router.push("/");
        }}
      />
    </div>
  );
}

export default ResultsPage;
