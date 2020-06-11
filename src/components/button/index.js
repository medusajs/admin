import React from "react"
import { Button as RebassButton } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledButton = styled(RebassButton)`
  ${Typography.Base}
`

const Button = ({ children, variant }) => {
  return <StyledButton variant={`buttons.${variant}`}>{children}</StyledButton>
}

export default Button
