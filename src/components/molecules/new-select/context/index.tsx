import React from "react"
import { SelectContextProps, SelectProviderProps } from "../types"

const SelectContext = React.createContext<SelectContextProps>(null)

export const SelectProvider: React.FC<SelectProviderProps> = ({
  context,
  children,
}) => {
  return (
    <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
  )
}

export const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("useSelectContext must be a child of SelectProvider")
  }
  return { ...context }
}
