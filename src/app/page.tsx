"use client";

import { MainLayout } from "./_components/templates/MainLayout";
import { MetabolicDebuggerPage } from "./_components/pages";
import { NavigationBar } from "./_components/organisms/NavigationBar";

export default function Home() {
  return (
    <MainLayout>
      <NavigationBar
        currentPath="/"
        onNavigate={(path) => (window.location.href = path)}
      />
      <MetabolicDebuggerPage />
    </MainLayout>
  );
}
