import React from "react"
import { Button as RebassButton } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledButton = styled(RebassButton)`
  ${Typography.Base}

  border-radius: 2px;
`

const Button = ({ active, children, type, onClick, ...props }) => {
  return (
    <StyledButton
      onClick={onClick}
      type={type || "button"}
      variant={active ? `pillActive` : `pill`}
      {...props}
    >
      {children}
    </StyledButton>
  )
}

export default Button
