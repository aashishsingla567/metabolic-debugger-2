import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Metabolic Debugger",
  description:
    "Identify rate-limiting step in your metabolism and optimize your health.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(geist.variable)}>
      <body className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 scrollbar-hover:scrollbar-thumb-slate-500">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
