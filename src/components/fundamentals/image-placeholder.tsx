import React from "react"
import IconProps from "./icons/types/icon-type"

const ImagePlaceholder: React.FC<IconProps> = ({
  size = "38",
  color = "#b8b8bf",
  ...attributes
}) => {
  const height = +size * 0.75
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height}
      viewBox="0 0 64 48"
    >
      <path
        fill={color}
        d="M56,0H8A8,8,0,0,0,0,8V40a7.27,7.27,0,0,0,.48,2.64A8.05,8.05,0,0,0,4,46.91,8.1,8.1,0,0,0,8,48H56a8.08,8.08,0,0,0,6.72-3.65A8.18,8.18,0,0,0,64,40V8A8,8,0,0,0,56,0ZM33,42.67H8a2.35,2.35,0,0,1-.83-.16L21.65,22.75,33.52,34.61l3.76,3.76,4.27,4.3ZM58.67,40A2.68,2.68,0,0,1,56,42.67H49.12l-8-8.06,6.82-6.74,10.78,12Zm0-8.13L50,22.21a2.72,2.72,0,0,0-1.89-.88,2.53,2.53,0,0,0-1.95.78l-8.82,8.74L23.23,16.77A2.84,2.84,0,0,0,21.12,16a2.76,2.76,0,0,0-1.95,1.09L5.33,36V8A2.68,2.68,0,0,1,8,5.33H56A2.68,2.68,0,0,1,58.67,8Z"
      />
      <circle fill={color} cx="37.33" cy="18.67" r="5.33" />
    </svg>
  )
}

export default ImagePlaceholder
