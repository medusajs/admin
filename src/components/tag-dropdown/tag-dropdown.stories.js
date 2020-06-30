import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import TagDropdown from "./index"

import { currencies } from "../../utils/currencies"

const StyledContainer = styled.div`
  min-width: 250px;
`

const Currency = styled.div`
  display: flex;
  span {
    &:first-of-type {
      flex: 1;
      text-alignment: center;
      padding-right: 5px;
      border-right: 1px solid ${props => props.theme.colors.dark};
    }

    &:last-of-type {
      padding-left: 8px;
      flex: 2;
    }
  }
`

const Container = () => {
  const [values, setValues] = useState([])

  const handleChange = values => {
    setValues(values)
  }

  const options = Object.keys(currencies).map(k => {
    return {
      symbol: currencies[k].symbol_native,
      value: k,
      code: k,
    }
  })

  return (
    <StyledContainer>
      <TagDropdown
        toggleText="Choose currencies"
        values={values}
        onChange={handleChange}
        options={options}
        optionRender={o => (
          <Currency>
            <span>{o.symbol}</span>
            <span>{o.code}</span>
          </Currency>
        )}
        valueRender={o => (
          <Currency>
            <span>{o.symbol}</span>
            <span>{o.code}</span>
          </Currency>
        )}
      />
    </StyledContainer>
  )
}

export default {
  title: `TagDropdown`,
}

export const default_ = () => <Container />
