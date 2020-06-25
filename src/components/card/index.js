import React from "react"
import { Card as RebassCard } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledCard = styled(RebassCard)`
  ${Typography.Base}

  ${props => `
    width: ${props.width ? props.width : "inherit"}
  `}

  box-shadow: 0 7px 14px 0 rgba(60,66,87,.08), 0 3px 6px 0 rgba(0,0,0,.12);
  border-radius: 5px;

  height: 100%;

  margin-bottom: 15px;
`

const Card = ({ children, ...props }) => {
  return <StyledCard>{children}</StyledCard>
}

export default Card
