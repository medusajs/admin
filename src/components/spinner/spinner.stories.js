import React from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import Spinner from "./index"

const Container = styled.div`
  background-color: ${props => props.theme.colors.darkest};
  padding: 10px;
`

export default {
  title: `Spinner`,
}

export const default_ = () => (
  <Container>
    <Spinner width="20px" height="20px" />
  </Container>
)
