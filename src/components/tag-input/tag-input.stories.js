import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import TagInput from "./index"

const StyledContainer = styled.div`
  width: 250px;
`

const Container = () => {
  const [values, setValues] = useState([])

  const handleChange = values => {
    setValues(values)
  }

  return (
    <StyledContainer>
      <TagInput values={values} onChange={handleChange} />
    </StyledContainer>
  )
}

export default {
  title: `TagInput`,
}

export const default_ = () => <Container />
