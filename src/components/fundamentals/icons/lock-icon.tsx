import React from "react"
import IconProps from "./types/icon-type"

const LockIcon: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
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
        d="M12.1485 6.66669H3.85218C3.19762 6.66669 2.66699 7.20937 2.66699 7.87881V12.1212C2.66699 12.7907 3.19762 13.3334 3.85218 13.3334H12.1485C12.803 13.3334 13.3337 12.7907 13.3337 12.1212V7.87881C13.3337 7.20937 12.803 6.66669 12.1485 6.66669Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.33301 6.66667V4.59259C5.33301 3.90499 5.61396 3.24556 6.11406 2.75935C6.61415 2.27315 7.29243 2 7.99967 2C8.70692 2 9.3852 2.27315 9.88529 2.75935C10.3854 3.24556 10.6663 3.90499 10.6663 4.59259V6.66667"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="8"
        cy="9.3385"
        r="1"
        fill={color}
      />
      <rect
        x="7.5"
        y="9.51074"
        width="1"
        height="2"
        rx="0.5"
        fill={color}
      />
    </svg>
  )
}

export default LockIcon
