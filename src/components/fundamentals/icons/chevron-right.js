import PropTypes from "prop-types"
import React from "react"

const ChevronRightIcon = props => {
  const { size, color, ...rest } = props
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M17 18L23 12L17 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

ChevronRightIcon.defaultProps = {
  color: "currentColor",
  size: "24px",
}

ChevronRightIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default ChevronRightIcon
