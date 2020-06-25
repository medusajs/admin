import React from "react"
import { Button as RebassButton } from "rebass"

const Button = ({ children, variant, type, onClick, ...props }) => {
  return (
    <RebassButton
      onClick={onClick}
      type={type || "button"}
      variant={`buttons.${variant}`}
      {...props}
    >
      {children}
    </RebassButton>
  )
}

export default Button
