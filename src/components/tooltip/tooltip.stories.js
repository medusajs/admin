import styled from "@emotion/styled"
import React from "react"
import InfoTooltip from "../info-tooltip"
import TooltipComponent from "./index"

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 300px;
`

export const Default = () => {
  return (
    <Container>
      <p data-for={"tooltip"} data-tip={"This is a tooltip!"}>
        Hover over me
      </p>
      <TooltipComponent id="tooltip" />
    </Container>
  )
}

export const Info = () => {
  return (
    <Container>
      <InfoTooltip tooltipText="This is a helpful tooltip" />
    </Container>
  )
}

export default {
  title: "Tooltip",
}
