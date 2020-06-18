import React from "react"
import { Button as RebassButton } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledButton = styled(RebassButton)`
  ${Typography.Base}
`

const Button = ({ children, variant, type, onClick }) => {
  return (
    <StyledButton
      onClick={onClick}
      type={type || "button"}
      variant={`buttons.${variant}`}
    >
      {children}
    </StyledButton>
  )
}

export default Button
