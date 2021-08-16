import React from "react"
import styled from "@emotion/styled"
import ReactTooltip from "react-tooltip"
import Typography from "../typography"

const Tooltip = ({ ...props }) => {
  return (
    <ReactTooltip
      textColor="black"
      backgroundColor="white"
      arrowColor="white"
      place="top"
      effect="solid"
      {...props}
    />
  )
}

const StyledTooltip = styled(Tooltip)`
  ${Typography.Base};
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.08),
    0px 0px 0px 1px rgba(136, 152, 170, 0.1),
    0px 4px 4px 0px rgba(136, 152, 170, 0.1) !important;
  padding: 8px 12px;
  &:after {
    margin-right: 4px;
  }
  &.show {
    opacity: 1;
  }
`

export default StyledTooltip
