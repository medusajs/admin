import { useLayoutEffect, useRef } from "react"

export const useComputedHeight = (bottomPad: number) => {
  const ref = useRef(null)
  const heightRef = useRef(0)

  useLayoutEffect(() => {
    if (ref.current) {
      let { top } = ref.current.getBoundingClientRect()
      let height = window.innerHeight
      // take the inner height of the window, subtract 32 from it (for the bottom padding), then subtract that from the top position of our grid row (wherever that is)
      heightRef.current = height - bottomPad - top
    }
  }, [bottomPad])
}
