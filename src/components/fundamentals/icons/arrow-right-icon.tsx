import React from "react"

interface IArrowRightIconProps {
  size: string | number
  color?: string
}

const ArrowRightIcon = props => {
  const { size = "24px", color = "currentColor" }: IArrowRightIconProps = props
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33301 8H12.6663"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 3.33331L12.6667 7.99998L8 12.6666"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default ArrowRightIcon
