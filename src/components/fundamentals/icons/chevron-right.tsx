import React from "react"
import IconProps from "./types/icon-type"

const ChevronRightIcon: React.FC<IconProps> = ({
  size = "24px",
  color = "currentColor",
  attributes,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M17 18L23 12L17 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ChevronRightIcon
