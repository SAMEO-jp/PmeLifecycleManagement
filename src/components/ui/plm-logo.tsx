"use client"

import { cn } from "@/core/shadcn/lib/utils"

interface PLMLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "monochrome" | "stencil" | "bold" | "russo"
}

export function PLMLogo({ className, size = "md", variant = "russo" }: PLMLogoProps) {
  // Russo One SVGスタイル
  if (variant === "russo") {
    return (
      <svg
        className={cn("inline-block", className)}
        viewBox="0 0 300 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "auto",
          minWidth: "240px",
          height: "80px",
        }}
      >
        <text
          x="150"
          y="50"
          fontSize="40"
          fontWeight="400"
          fontFamily="var(--font-russo-one), sans-serif"
          fill="currentColor"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="0.08em"
          style={{ textTransform: "uppercase" }}
        >
          PME SYSTEM
        </text>
      </svg>
    )
  }

  // Boldスタイル（画像のような極太フォント）
  if (variant === "bold") {
    return (
      <div
        className={cn("inline-block", "font-inter-black", className)}
        style={{
          width: "auto",
          minWidth: "180px",
          height: "auto",
          flexShrink: 0,
          color: "#000",
          textAlign: "center",
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 900,
          lineHeight: "1.2",
          textTransform: "none",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            lineHeight: "1.2",
            margin: 0,
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          PME System
        </span>
      </div>
    )
  }

  // Stencilスタイル（指定されたCSS - 2倍サイズ）
  if (variant === "stencil") {
    return (
      <div
        className={cn("inline-block", "font-allerta-stencil", className)}
        style={{
          width: "auto",
          minWidth: "150px",
          height: "24px",
          flexShrink: 0,
          color: "#000",
          textAlign: "center",
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
          textTransform: "none",
          whiteSpace: "nowrap",
          // leading-trim と text-edge は experimental なので、代替手段を使用
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            lineHeight: "24px",
            margin: 0,
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          PME System
        </span>
      </div>
    )
  }

  // デフォルトスタイル（以前のNext.jsスタイル）
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }

  return (
    <div 
      className={cn(
        "inline-flex items-baseline font-bold tracking-tight",
        sizeClasses[size],
        variant === "monochrome" && "text-current",
        className
      )}
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* PLM部分 - 大きく太字 */}
      <span className="inline-block">
        <span className="inline-block" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          PLM
        </span>
      </span>
      {/* .system部分 - 小さく下付き */}
      <span 
        className="inline-block ml-1 align-baseline"
        style={{ 
          fontSize: '0.42em',
          fontWeight: 400,
          opacity: 0.85,
          letterSpacing: '0.01em'
        }}
      >
        .system
      </span>
    </div>
  )
}

