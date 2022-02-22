import React from "react"
import IconProps from "../types/icon-type"

const LockIcon: React.FC<IconProps> = ({
  size = "16",
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
        d="M12.1475 6.66602H3.8512C3.19664 6.66602 2.66602 7.2087 2.66602 7.87814V12.1206C2.66602 12.79 3.19664 13.3327 3.8512 13.3327H12.1475C12.8021 13.3327 13.3327 12.79 13.3327 12.1206V7.87814C13.3327 7.2087 12.8021 6.66602 12.1475 6.66602Z"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33398 6.66667V4.59259C5.33398 3.90499 5.61494 3.24556 6.11503 2.75935C6.61513 2.27315 7.29341 2 8.00065 2C8.7079 2 9.38617 2.27315 9.88627 2.75935C10.3864 3.24556 10.6673 3.90499 10.6673 4.59259V6.66667"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9.33789" r="1" fill="#9CA3AF" />
      <rect x="7.5" y="9.51172" width="1" height="2" rx="0.5" fill="#9CA3AF" />
    </svg>
  )
}

export default LockIcon
