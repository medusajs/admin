import React from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import TagInput from "./index"

const Container = styled.div`
  width: 250px;
`

export default {
  title: `TagInput`,
}

export const default_ = () => (
  <Container>
    <TagInput />
  </Container>
)
