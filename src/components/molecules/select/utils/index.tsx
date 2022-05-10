import { useEffect } from "react"
import { GroupBase, SelectInstance } from "react-select"

export const closeOnScroll = (event: Event, node: HTMLDivElement | null) => {
  if ((event.target as Element)?.contains(node) && event.target !== document) {
    return true
  }

  return false
}

export const useCloseOnResize = (
  ref: SelectInstance<unknown, boolean, GroupBase<unknown>> | null
) => {
  useEffect(() => {
    const closeOnResize = () => {
      ref?.blur()
    }

    window.addEventListener("resize", closeOnResize)
    return () => window.removeEventListener("resize", closeOnResize)
  }, [])
}
