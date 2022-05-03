import React from "react"
import IconProps from "../types/icon-type"

const ShiftIcon: React.FC<IconProps> = ({
  size,
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size || 14}
      height={size || 12}
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M4.55556 10.5932V6.31543H1.5L7.04297 0.81543L12.5 6.31543H9.44444V10.5932H4.55556Z"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ShiftIcon
