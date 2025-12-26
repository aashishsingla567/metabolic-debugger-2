"use client";

import { useRouter } from "next/navigation";
import { MainLayout } from "../_components/templates/MainLayout";
import { NavigationBar } from "../_components/organisms/NavigationBar";
import ResultsPage from "../_components/pages/ResultsPage";

export default function ResultsRoute() {
  const router = useRouter();

  return (
    <MainLayout title="Your Results" subtitle="Metabolic Blueprint Report">
      <NavigationBar
        currentPath="/results"
        onNavigate={(path) => router.push(path)}
      />
      <ResultsPage />
    </MainLayout>
  );
}
