import { useEffect, useRef, useState } from "react"

export const useObserveWidth = (ref: { current: Element }): number => {
  const [currentWidth, setCurrentWidth] = useState(0)

  const observer = useRef(
    new ResizeObserver(entries => {
      const { width } = entries[0].contentRect

      setCurrentWidth(width)
    })
  )

  useEffect(() => {
    observer.current.observe(ref.current)

    return () => observer.current.unobserve(ref.current)
  }, [ref, observer])

  return currentWidth
}
