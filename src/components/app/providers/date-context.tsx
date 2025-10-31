"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

// 日付情報の型定義
export interface DateInfo {
  currentDate: Date
  formattedDate: string
  year: number
  month: number
  day: number
  dayOfWeek: string
  isoString: string
}

// Context の型定義
interface DateContextType {
  dateInfo: DateInfo
  refreshDate: () => void
}

// Context 作成
const DateContext = createContext<DateContextType | undefined>(undefined)

// Provider Props
interface DateProviderProps {
  children: ReactNode
}

// 日付をフォーマットする関数
const formatDateInfo = (date: Date): DateInfo => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const dayOfWeekNames = ['日', '月', '火', '水', '木', '金', '土']
  const dayOfWeek = dayOfWeekNames[date.getDay()]

  return {
    currentDate: date,
    formattedDate: `${year}年${month}月${day}日(${dayOfWeek})`,
    year,
    month,
    day,
    dayOfWeek,
    isoString: date.toISOString(),
  }
}

// Provider コンポーネント
export function DateProvider({ children }: DateProviderProps) {
  const [dateInfo, setDateInfo] = useState<DateInfo>(() => formatDateInfo(new Date()))

  // 日付を更新する関数
  const refreshDate = () => {
    setDateInfo(formatDateInfo(new Date()))
  }

  // 毎分日付を更新（オプション）
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      // 日付が変わった場合のみ更新
      if (now.getDate() !== dateInfo.currentDate.getDate() ||
          now.getMonth() !== dateInfo.currentDate.getMonth() ||
          now.getFullYear() !== dateInfo.currentDate.getFullYear()) {
        setDateInfo(formatDateInfo(now))
      }
    }, 60000) // 1分ごとにチェック

    return () => clearInterval(interval)
  }, [dateInfo.currentDate])

  const contextValue: DateContextType = {
    dateInfo,
    refreshDate,
  }

  return (
    <DateContext.Provider value={contextValue}>
      {children}
    </DateContext.Provider>
  )
}

// Hook
export function useDate() {
  const context = useContext(DateContext)
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider')
  }
  return context
}

// 個別の値を取得する便利なフック
export function useCurrentDate() {
  const { dateInfo } = useDate()
  return dateInfo.currentDate
}

export function useFormattedDate() {
  const { dateInfo } = useDate()
  return dateInfo.formattedDate
}

export function useYear() {
  const { dateInfo } = useDate()
  return dateInfo.year
}

export function useMonth() {
  const { dateInfo } = useDate()
  return dateInfo.month
}

export function useDay() {
  const { dateInfo } = useDate()
  return dateInfo.day
}

export function useDayOfWeek() {
  const { dateInfo } = useDate()
  return dateInfo.dayOfWeek
}
