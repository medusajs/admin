import React, { useEffect, useRef, useState } from "react"

type HorizontalScrollFadeProps = {
  children: React.ReactNode[]
}

/**
 * A box that renders horizontal fade areas instead of the scrollbar
 */
function HorizontalScrollFade(props: HorizontalScrollFadeProps) {
  const r = useRef()

  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  useEffect(() => {
    const el = r.current
    if (el) {
      onScroll(el)
    }
  })

  const onScroll = (el: HTMLElement) => {
    const isScrolled = el.scrollWidth > el.clientWidth

    if (isScrolled) {
      setShowLeft(!!el.scrollLeft)
      setShowRight(el.scrollWidth - el.scrollLeft > el.clientWidth)
    } else {
      setShowLeft(false)
      setShowRight(false)
    }
  }

  return (
    <div className="relative">
      <div
        ref={r}
        className="overflow-x-auto hide-scrollbar relative"
        onScroll={(e) => onScroll(e.target)}
      >
        {props.children}
      </div>

      <div className="absolute top-0 w-full h-full flex flex-row justify-between z-[100] pointer-events-none">
        <div
          style={{
            opacity: showLeft ? 1 : 0,
            background: "linear-gradient(to left, transparent 60%, #f3f4f6)",
          }}
          className="w-[30px] h-full"
        />
        <div
          style={{
            opacity: showRight ? 1 : 0,
            background: "linear-gradient(to right, transparent 60%, #f3f4f6)",
          }}
          className="w-[30px] h-full"
        />
      </div>
    </div>
  )
}

export default HorizontalScrollFade
