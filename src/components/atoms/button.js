import React, { Children } from "react"

const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "large",
      type = "button",
      onClick = null,
      disabled = false,
      className = "",
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = e => {
      if (!loading && onClick) {
        onClick(e)
      }
    }

    return (
      <button
        className={`btn-${variant}-${size} ${className}`}
        onClick={handleClick}
        disabled={disabled || loading}
        type={type}
        ref={ref}
        {...props}
      >
        {Children.map(children || null, (child, i) => {
          return (
            <span key={i} className="mr-xsmall last:mr-0">
              {child}
            </span>
          )
        })}
      </button>
    )
  }
)

export default Button
