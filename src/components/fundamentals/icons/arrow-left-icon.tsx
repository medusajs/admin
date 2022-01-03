import React from "react"
import IIconProps from "./icon-interface"

const ArrowLeftIcon: React.FC<IIconProps> = ({
  size = "24px",
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.667 8H3.33366"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 3.33331L3.33333 7.99998L8 12.6666"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default ArrowLeftIcon
