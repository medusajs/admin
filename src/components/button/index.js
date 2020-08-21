import React from "react"
import { Button as RebassButton } from "rebass"
import styled from "@emotion/styled"

const Button = ({ children, variant, type, onClick, disabled, ...props }) => {
  return (
    <RebassButton
      disabled={disabled}
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
