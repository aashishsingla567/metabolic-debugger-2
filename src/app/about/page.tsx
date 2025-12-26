"use client";

import { useRouter } from "next/navigation";
import { MainLayout } from "../_components/templates/MainLayout";
import { NavigationBar } from "../_components/organisms/NavigationBar";
import AboutPage from "../_components/pages/AboutPage";

export default function AboutRoute() {
  const router = useRouter();

  return (
    <MainLayout title="About" subtitle="Understanding Metabolic Health">
      <NavigationBar
        currentPath="/about"
        onNavigate={(path) => router.push(path)}
      />
      <AboutPage />
    </MainLayout>
  );
}
