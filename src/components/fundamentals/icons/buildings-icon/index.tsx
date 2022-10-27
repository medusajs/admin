import React from "react"
import IconProps from "../types/icon-type"

const BuildingsIcon: React.FC<IconProps> = ({
  size = "24",
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
        d="M17.0138 16.5422V8.79964C17.0138 8.5943 16.9323 8.39736 16.7871 8.25216C16.6419 8.10696 16.4449 8.02539 16.2396 8.02539H13.1426"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.07812 16.5432V4.15511C3.07812 3.94977 3.1597 3.75283 3.3049 3.60763C3.4501 3.46243 3.64703 3.38086 3.85238 3.38086H12.3692C12.5745 3.38086 12.7714 3.46243 12.9166 3.60763C13.0618 3.75283 13.1434 3.94977 13.1434 4.15511V16.5432"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.98047 6.65234H10.2389"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.98047 9.96094H10.2389"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.97989 16.543H10.2383V13.2096H5.97989V16.543Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.7878 16.543H2.30273"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BuildingsIcon
