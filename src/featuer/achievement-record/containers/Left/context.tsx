"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { LeftSectionContextType, LeftSectionData } from './types'

const LeftSectionContext = createContext<LeftSectionContextType | undefined>(undefined)

const defaultData: LeftSectionData = {
  title: "実績サマリー",
  subtitle: "最新の実績情報",
  content: (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-2">ここに実績データが表示されます</p>
      <p className="text-xs text-gray-500">コンテキストからデータを取得中...</p>
    </div>
  )
}

export function LeftSectionProvider({ children }: { children: ReactNode }) {
  const [leftSectionData, setLeftSectionData] = useState<LeftSectionData>(defaultData)
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const updateLeftSectionData = (data: Partial<LeftSectionData>) => {
    setLeftSectionData(prev => ({ ...prev, ...data }))
  }

  const toggleVisibility = () => {
    setIsVisible(prev => !prev)
  }

  const setVisibility = (visible: boolean) => {
    setIsVisible(visible)
  }

  const value: LeftSectionContextType = {
    leftSectionData,
    updateLeftSectionData,
    isVisible,
    toggleVisibility,
    setVisibility
  }

  return (
    <LeftSectionContext.Provider value={value}>
      {children}
    </LeftSectionContext.Provider>
  )
}

export function useLeftSection() {
  const context = useContext(LeftSectionContext)
  if (context === undefined) {
    throw new Error('useLeftSection must be used within a LeftSectionProvider')
  }
  return context
}
