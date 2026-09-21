import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/shared/AppHeader";
import { Footer } from "@/components/shared/Footer";
import { AuthProvider } from "@/components/shared/AuthProvider";

export const metadata: Metadata = {
  title: "CodeMentor AI — 苏格拉底式启发教学",
  description: "面向高校新工科实验的智能排错与学情诊断平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
