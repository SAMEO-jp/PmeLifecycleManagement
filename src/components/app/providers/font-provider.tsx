"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Allerta_Stencil, Inter, Russo_One } from "next/font/google";

// フォント定義
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const allertaStencil = Allerta_Stencil({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allerta-stencil",
});

const interBlack = Inter({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-inter-black",
});

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo-one",
});

// フォントコンテキストの型定義
interface FontContextType {
  fonts: {
    geistSans: any;
    geistMono: any;
    allertaStencil: any;
    interBlack: any;
    russoOne: any;
  };
  fontClasses: string;
}

// フォントコンテキストの作成
const FontContext = createContext<FontContextType | undefined>(undefined);

// フォントプロバイダーコンポーネント
export function FontProvider({ children }: { children: ReactNode }) {
  const fonts = {
    geistSans,
    geistMono,
    allertaStencil,
    interBlack,
    russoOne,
  };

  const fontClasses = `${geistSans.variable} ${geistMono.variable} ${allertaStencil.variable} ${interBlack.variable} ${russoOne.variable}`;

  return (
    <FontContext.Provider value={{ fonts, fontClasses }}>
      <div className={fontClasses}>
        {children}
      </div>
    </FontContext.Provider>
  );
}

// フォントコンテキストを使用するカスタムフック
export function useFonts() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFonts must be used within a FontProvider");
  }
  return context;
}
