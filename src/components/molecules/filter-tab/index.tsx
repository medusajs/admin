import React from "react"
import clsx from "clsx"

import CrossIcon from "../../fundamentals/icons/cross-icon"

type FilterTabProps = {
  label?: string
  isActive?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  removable?: boolean
  onRemove?: () => void
}

export const FilterTab: React.FC<FilterTabProps> = ({
  label,
  isActive,
  onClick,
  removable,
  onRemove,
}) => {
  const handleClick = (e) => {
    if (typeof onClick !== "undefined") {
      onClick(e)
    }
  }

  const handleRemove = () => {
    if (typeof onRemove !== "undefined") {
      onRemove()
    }
  }

  const handleKeyPress = (e) => {
    if (removable && onRemove) {
      if (e.key === "Backspace") {
        onRemove()
      }
    }
  }

  return (
    <button
      onKeyUp={handleKeyPress}
      onClick={handleClick}
      className={clsx(
        "flex items-center bg-grey-5 border border-grey-20 inter-small-regular px-2 h-6 text-grey-50 rounded-rounded focus-visible:outline-none focus-visible:shadow-input focus-visible:border-violet-60 flex items-center space-x-1",
        {
          ["bg-violet-5 border-violet-60 text-violet-60 "]: isActive,
        }
      )}
    >
      {label}
      {removable && (
        <div onClick={handleRemove} className={"ml-1 cursor-pointer"}>
          <CrossIcon size={16} />
        </div>
      )}
    </button>
  )
}

export default FilterTab
