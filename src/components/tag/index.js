import React from "react"
import { Box } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledTag = styled(Box)`
  ${Typography.Base};

  top: 20%;
  border: 1px solid gray;
  border-radius: 3px;
  font-size: 12px;
  vertical-align: middle;
  line-height: 1.5;
  text-align: center;
`

const Tag = ({ children, ...props }) => {
  return <StyledTag {...props}>{children}</StyledTag>
}

export default Tag
