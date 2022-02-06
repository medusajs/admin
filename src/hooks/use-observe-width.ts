import { MutableRefObject, useEffect, useRef, useState } from "react"

export const useObserveWidth = (ref: MutableRefObject<any>): number => {
  const [currentWidth, setCurrentWidth] = useState(0)

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect

      setCurrentWidth(width)
    })
  )

  useEffect(() => {
    if (observer?.current && ref?.current) {
      observer.current.observe(ref.current)
    }

    if (observer?.current && ref?.current) {
      return () => observer.current.unobserve(ref?.current)
    }
  }, [ref, observer])

  return currentWidth
}
