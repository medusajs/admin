import React from "react"
import IconProps from "../types/icon-type"

const ListArrowIcon: React.FC<IconProps> = ({
  size = "10",
  color = "currentColor",
  stroke = "#9CA3AF",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path d="M10.832 4.16699H2.4987" stroke={stroke} strokeWidth="1.5" />
      <path d="M10.832 7.5H4.9987" stroke={stroke} strokeWidth="1.5" />
      <path d="M10.832 10.833H7.4987" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M17.5 14.167L15 16.667L12.5 14.167"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M15 14.9997V3.33301" stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

export default ListArrowIcon
