import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/app/providers/auth-provider";
import { FontProvider } from "@/components/app/providers/font-provider";
import { DisplaySizeProvider } from "@/components/app/providers/display-size-context";
import { DateProvider } from "@/components/app/providers/date-context";
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
      <body className="antialiased overflow-hidden">
        <DisplaySizeProvider>
          <DateProvider>
            <FontProvider>
              <AuthProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </AuthProvider>
            </FontProvider>
          </DateProvider>
        </DisplaySizeProvider>
      </body>
    </html>
  );
}
