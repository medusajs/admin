import React from "react"
import IconProps from "../types/icon-type"

const TriangleRightMiniIcon: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.25 6.91312C6.25 6.21963 6.99999 5.78 7.61312 6.1141L13.2736 9.20123C13.9088 9.54748 13.9088 10.4525 13.2736 10.7988L7.61361 13.8859C7.00048 14.22 6.25049 13.7804 6.25049 13.0869L6.25 6.91312Z"
        fill={color}
      />
    </svg>
  )
}

export default TriangleRightMiniIcon
