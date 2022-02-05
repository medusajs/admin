import clsx from "clsx"
import React, { Children } from "react"
import { useComputedHeight } from "../../hooks/use-computed-height"

type TwoSplitPaneProps = {
  className?: string
}

const TwoSplitPane: React.FC<TwoSplitPaneProps> = ({ className, children }) => {
  const childrenCount = Children.count(children)
  const { ref, height } = useComputedHeight(32)

  const heightClass = height
    ? {
        gridTemplateRows: `${height}px`,
      }
    : null

  if (childrenCount > 2) {
    throw new Error("TwoSplitPane can only have two or less children")
  }

  return (
    <div
      className={clsx(
        "grid gap-large grid-cols-1 medium:grid-cols-2",
        className
      )}
      style={heightClass}
      ref={ref}
    >
      {Children.map(children, (child, i) => {
        return (
          <div className="w-full h-full" key={i}>
            {child}
          </div>
        )
      })}
    </div>
  )
}

export default TwoSplitPane
