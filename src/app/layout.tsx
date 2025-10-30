import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/app/providers/auth-provider";
import { FontProvider } from "@/components/app/providers/font-provider";
import { AppLayout } from "@/components/app/components/AppLayout";

export const metadata: Metadata = {
  title: "PME Lifecycle Management",
  description: "PME設備のライフサイクル管理システム",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <FontProvider>
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </FontProvider>
      </body>
    </html>
  );
}
