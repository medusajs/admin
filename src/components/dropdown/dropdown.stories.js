import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import Dropdown from "./index"

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`

const Container = () => {
  const [values, setValues] = useState([])

  const handleChange = values => {
    setValues(values)
  }

  return (
    <StyledContainer>
      <div>
        <Dropdown
          searchPlaceholder={"SKU, Product Name, Size, etc."}
          showSearch
        >
          <div>Prod 1</div>
          <div>Prod 2</div>
          <div>Prod 3</div>
          <div>Prod 4</div>
          <div>Prod 5</div>
          <div>Prod 6</div>
          <div>Prod 7</div>
        </Dropdown>
      </div>
    </StyledContainer>
  )
}

export default {
  title: `Dropdown`,
}

export const default_ = () => <Container />
