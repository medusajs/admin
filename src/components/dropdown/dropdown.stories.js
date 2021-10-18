import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import styled from "@emotion/styled"

import Dropdown from "./index"

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

const Container = args => {
  const [values, setValues] = useState([])

  const handleChange = values => {
    setValues(values)
  }

  console.log({ args })

  return (
    <StyledContainer>
      <Dropdown {...args}>
        <div>Prod 1</div>
        <div>Prod 2</div>
        <div>Prod 3</div>
        <div>Prod 4</div>
        <div>Prod 5</div>
        <div>Prod 6</div>
        <div>Prod 7</div>
      </Dropdown>
    </StyledContainer>
  )
}

const Template = args => <Container {...args} />

export const Default = Template.bind({})

Default.args = {
  searchPlaceholder: "SKU, Product Name, Size, etc.",
  showSearch: true,
  showTrigger: true,
  topPlacement: 10,
  placement: "bottom-start",
  dropdownWidth: 160,
  dropdownHeight: 300,
  toggleText: "",
}

export default {
  title: `Dropdown`,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placement: {
      options: [
        "top-start",
        "top",
        "top-end",
        "right-start",
        "right",
        "right-end",
        "bottom-start",
        "bottom",
        "bottom-end",
        "left-start",
        "left",
        "left-end",
      ],
      control: { type: "select" },
    },
  },
}
