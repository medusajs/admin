import React from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledBox = styled(Flex)`
  ${Typography.Base};
  display: inline-block;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
`

const Badge = ({ children, variant, type, onClick, ...props }) => {
  return (
    <StyledBox alignItems="center" px={2} py={1} onClick={onClick} {...props}>
      {children}
    </StyledBox>
  )
}

export default Badge
