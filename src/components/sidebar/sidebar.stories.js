import React from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import Sidebar from "./index"

const Container = styled.div`
  width: 300px;
  height: calc(100vh - 30px);
`

export default {
  title: `Sidebar`,
}

export const default_ = () => (
  <Container>
    <Sidebar />
  </Container>
)
