"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

// 画面サイズの型定義
export interface DisplaySize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
  rightSidebarWidth: number
  mainSidebarWidth: number
  headerHeight: number
}

// ブレークポイント定義
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1024,
} as const

// Context の型定義
interface DisplaySizeContextType {
  displaySize: DisplaySize
  isLoading: boolean
}

// Context 作成
const DisplaySizeContext = createContext<DisplaySizeContextType | undefined>(undefined)

// Provider Props
interface DisplaySizeProviderProps {
  children: ReactNode
}

// デバウンス関数
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Provider コンポーネント
export function DisplaySizeProvider({ children }: DisplaySizeProviderProps) {
  const [displaySize, setDisplaySize] = useState<DisplaySize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: 'desktop',
    rightSidebarWidth: 0,
    mainSidebarWidth: 0,
    headerHeight: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // 画面サイズを計算する関数
  const calculateDisplaySize = (width: number, height: number): DisplaySize => {
    const isMobile = width < BREAKPOINTS.mobile
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet
    const isDesktop = width >= BREAKPOINTS.tablet

    let breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (isMobile) breakpoint = 'mobile'
    else if (isTablet) breakpoint = 'tablet'

    // サイドバーとヘッダーのサイズを計算
    const rightSidebarWidth = Math.floor(width / 8)  // デバッグパネル用
    const mainSidebarWidth = Math.floor(width / 7)   // メインサイドバー用
    const headerHeight = Math.floor(height / 15)     // ヘッダー用

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      breakpoint,
      rightSidebarWidth,
      mainSidebarWidth,
      headerHeight,
    }
  }

  // 初期化処理
  useEffect(() => {
    // SSR 回避のためのクライアントサイドチェック
    if (typeof window === 'undefined') return

    // 初期サイズ設定（同期的実行を避けるためsetTimeoutを使用）
    const initializeSize = () => {
      const initialSize = calculateDisplaySize(window.innerWidth, window.innerHeight)
      setDisplaySize(initialSize)
      setIsLoading(false)
    }

    // 次のレンダリングサイクルで実行
    const timeoutId = setTimeout(initializeSize, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  // リサイズイベントリスナー設定
  useEffect(() => {
    if (typeof window === 'undefined') return

    // リサイズイベントハンドラー（デバウンス適用）
    const handleResize = debounce(() => {
      const newSize = calculateDisplaySize(window.innerWidth, window.innerHeight)
      setDisplaySize(newSize)
    }, 50)

    // イベントリスナー追加
    window.addEventListener('resize', handleResize)

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const contextValue: DisplaySizeContextType = {
    displaySize,
    isLoading,
  }

  return (
    <DisplaySizeContext.Provider value={contextValue}>
      {children}
    </DisplaySizeContext.Provider>
  )
}

// Hook
export function useDisplaySize() {
  const context = useContext(DisplaySizeContext)
  if (context === undefined) {
    throw new Error('useDisplaySize must be used within a DisplaySizeProvider')
  }
  return context
}

// 個別の値を取得する便利なフック
export function useDisplayWidth() {
  const { displaySize } = useDisplaySize()
  return displaySize.width
}

export function useDisplayHeight() {
  const { displaySize } = useDisplaySize()
  return displaySize.height
}

export function useBreakpoint() {
  const { displaySize } = useDisplaySize()
  return displaySize.breakpoint
}

export function useIsMobile() {
  const { displaySize } = useDisplaySize()
  return displaySize.isMobile
}

export function useIsTablet() {
  const { displaySize } = useDisplaySize()
  return displaySize.isTablet
}

export function useIsDesktop() {
  const { displaySize } = useDisplaySize()
  return displaySize.isDesktop
}

export function useRightSidebarWidth() {
  const { displaySize } = useDisplaySize()
  return displaySize.rightSidebarWidth
}

export function useMainSidebarWidth() {
  const { displaySize } = useDisplaySize()
  return displaySize.mainSidebarWidth
}

export function useHeaderHeight() {
  const { displaySize } = useDisplaySize()
  return displaySize.headerHeight
}
