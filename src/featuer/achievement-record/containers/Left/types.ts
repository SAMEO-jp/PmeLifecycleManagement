export interface LeftSectionData {
  title: string
  subtitle: string
  content: React.ReactNode
}

export interface LeftSectionContextType {
  leftSectionData: LeftSectionData
  updateLeftSectionData: (data: Partial<LeftSectionData>) => void
  isVisible: boolean
  toggleVisibility: () => void
  setVisibility: (visible: boolean) => void
}
