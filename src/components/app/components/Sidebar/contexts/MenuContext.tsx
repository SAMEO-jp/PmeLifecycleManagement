"use client"

import React, { createContext, useContext, ReactNode, useMemo } from "react"
import { menuItems as rawMenuItems } from "./menuItems"

export interface MenuItem {
  title: string
  url: string
  icon: any
}

interface MenuContextType {
  menuItems: MenuItem[]
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

interface MenuProviderProps {
  children: ReactNode
}

export function MenuProvider({ children }: MenuProviderProps) {
  const menuItems = useMemo(() => rawMenuItems, [])

  const contextValue = useMemo(() => ({ menuItems }), [menuItems])

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
