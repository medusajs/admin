import React from "react"
import IconProps from "./icon-type"

const MinusIcon: React.FC<IconProps> = ({
  size = "24px",
  color = "currentColor",
  attributes,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M3.33301 8H12.6663"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default MinusIcon
