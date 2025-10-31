"use client"

import React, { createContext, useContext, ReactNode, useMemo, useState } from "react"
import { menuItems as rawMenuItems } from "./menuItems"

export interface MenuItem {
  title: string
  url: string
  icon: any
}

export type ActiveView = 'default' | 'project-join' | 'project-create' | 'project-task-create' | 'project-list' | 'tasks' | 'past-records' | 'task-types-management' | 'equipment-management' | 'task-create'

interface MenuContextType {
  menuItems: MenuItem[]
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

interface MenuProviderProps {
  children: ReactNode
}

export function MenuProvider({ children }: MenuProviderProps) {
  const menuItems = useMemo(() => rawMenuItems, [])
  const [activeView, setActiveView] = useState<ActiveView>('default')

  const contextValue = useMemo(() => ({
    menuItems,
    activeView,
    setActiveView
  }), [menuItems, activeView])

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenuContext() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenuContext must be used within a MenuProvider")
  }
  return context
}
