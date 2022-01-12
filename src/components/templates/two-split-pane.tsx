import React, { Children } from "react"

const TwoSplitPane: React.FC = ({ children }) => {
  const childrenCount = Children.count(children)

  if (childrenCount > 2) {
    throw new Error("TwoSplitPane can only have two or less children")
  }

  return (
    <div className="grid gap-large grid-cols-1 medium:grid-cols-2">
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
