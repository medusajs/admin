import { SalesChannel } from "@medusajs/medusa"
import React, { useContext } from "react"

type SalesChannelsModalContext = {
  source: SalesChannel[]
  onClose: () => void
  onSave: (channels: SalesChannel[]) => void
}

export const SalesChannelsModalContext = React.createContext<SalesChannelsModalContext | null>(
  null
)

export const useSalesChannelsModal = () => {
  const context = useContext(SalesChannelsModalContext)

  if (context === null) {
    throw new Error(
      "useSalesChannelsModal must be used within a SalesChannelsModalProvider"
    )
  }

  return context
}
