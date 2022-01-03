import PropTypes from "prop-types"
import React from "react"

interface IArrowLeftIconProps {
  size: string | number
  color?: string
}

const CrossIcon = props => {
  const { size, color, ...rest } = props
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L5 15"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 5L15 15"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

CrossIcon.defaultProps = {
  color: "currentColor",
  size: "24px",
}

CrossIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default CrossIcon
