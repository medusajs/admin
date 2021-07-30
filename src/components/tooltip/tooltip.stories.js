import styled from "@emotion/styled"
import React from "react"
import { ReactComponent as InfoIcon } from "../../assets/svg/info.svg"
import TooltipComponent from "./index"

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 300px;
`

export const Default = () => {
  return (
    <Container>
      <InfoIcon data-for={"tooltip"} data-tip={"This is a helpful tooltip!"} />
      <TooltipComponent id="tooltip" />
    </Container>
  )
}

export default {
  title: "Tooltip",
}
