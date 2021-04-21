import React from "react"
import { Box } from "rebass"

import { ReactComponent as Oval } from "../../assets/svg/oval.svg"

const Spinner = ({ dark, ...props }) => {
  return (
    <Box {...props}>
      <Oval stroke={dark ? "#212121" : "#ffffff"} height="100%" width="100%" />
    </Box>
  )
}

export default Spinner
