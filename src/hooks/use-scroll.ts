import { useState } from "react"

export const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  const scrollListener = e => {
    const currentScrollY = e.target.scrollTop
    if (currentScrollY > 16) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  return { isScrolled, scrollListener }
}
