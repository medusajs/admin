import React from "react"
import Collapsible from "react-collapsible"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledLabel = styled(Label)`
  ${Typography.Base}
`

const StyledCollapsible = styled(Collapsible)`
  ${Typography.Base}
`

const DefaultTrigger = props => <StyledLabel>{props.triggerTitle}</StyledLabel>

const Collapse = ({ children, ...props }) => {
  return (
    <StyledCollapsible trigger={<DefaultTrigger {...props} />}>
      {children}
    </StyledCollapsible>
  )
}

export default Collapse
