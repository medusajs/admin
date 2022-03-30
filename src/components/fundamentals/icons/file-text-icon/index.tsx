import React from "react"
import IconProps from "../types/icon-type"

const FileTextIcon: React.FC<IconProps> = ({
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
        d="M11.875 2.5H5.5C5.10218 2.5 4.72064 2.65804 4.43934 2.93934C4.15804 3.22064 4 3.60218 4 4V16C4 16.3978 4.15804 16.7794 4.43934 17.0607C4.72064 17.342 5.10218 17.5 5.5 17.5H14.5C14.8978 17.5 15.2794 17.342 15.5607 17.0607C15.842 16.7794 16 16.3978 16 16V6.625L11.875 2.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 2.5V7H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 10.75H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 13.75H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 7.75H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default FileTextIcon
