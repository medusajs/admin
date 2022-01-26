import React from "react"
import IconProps from "../types/icon-type"

const DetailsIcon: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M15.4444 17H4.55556C3.7 17 3 16.35 3 15.5556V5.44444C3 4.65 3.7 4 4.55556 4H15.4444C16.3 4 17 4.65 17 5.44444V15.5556C17 16.35 16.3 17 15.4444 17Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2.43994V3.43994"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 2.43994V3.43994"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.7632C11.1046 10.7632 12 9.86775 12 8.76318C12 7.65861 11.1046 6.76318 10 6.76318C8.89543 6.76318 8 7.65861 8 8.76318C8 9.86775 8.89543 10.7632 10 10.7632Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14.2979C12.88 13.6312 11.52 13.2979 10 13.2979C8.48 13.2979 7.12 13.6979 6 14.2979"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DetailsIcon
