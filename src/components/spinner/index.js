import React from "react"
import styled from "@emotion/styled"
import { Box } from "rebass"

import { ReactComponent as Oval } from "../../assets/svg/oval.svg"

const SpinContent = styled.div``

const Spinner = ({ dark, ...props }) => {
  return (
    <Box {...props}>
      <Oval stroke={dark && "#212121"} height="100%" width="100%" />
    </Box>
  )
}

export default Spinner
