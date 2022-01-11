import React, { Children } from "react"

const TwoSplitPane: React.FC = ({ children }) => {
  const childrenCount = Children.count(children)

  if (childrenCount > 2) {
    throw new Error("TwoSplitPane can only have two or less children")
  }

  return (
    <div className="flex flex-col gap-large items-baseline h-full medium:flex-row">
      {Children.map(children, (child, i) => {
        return (
          <div className="medium:w-1/2 h-full w-full" key={i}>
            {child}
          </div>
        )
      })}
    </div>
  )
}

export default TwoSplitPane
