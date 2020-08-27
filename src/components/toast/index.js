import React from "react"
import styled from "@emotion/styled"
import { Text } from "rebass"
import Typography from "../typography"

const StyledText = styled(Text)`
  ${Typography.Base};
  font-size: 12px;
`

const ToastLabel = ({ children, ...props }) => {
  return <StyledText {...props}>{children}</StyledText>
}

export default ToastLabel
