import React, { Children } from "react"
import { useComputedHeight } from "../../hooks/use-computed-height"

const TwoSplitPane: React.FC = ({ children }) => {
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
      className="grid gap-large grid-cols-1 medium:grid-cols-2"
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
