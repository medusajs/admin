import React, { useState } from "react"
import { Text, Flex, Box } from "rebass"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"

import MultiSelect from "react-multi-select-component"
import Input from "../../../components/input"
import Select from "../../../components/select"
import Typography from "../../../components/typography"

const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  line-height: 1.22;

  border: none;
  outline: 0;

  transition: all 0.2s ease;

  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px;

  &:focus: {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }
  &::placeholder: {
    color: #a3acb9;
  }

  .go3433208811 {
    border: none;
    border-radius: 3px;
  }
`

const StyledLabel = styled.div`
  ${Typography.Base}
  padding-bottom: 10px;
`

const NewDiscount = ({}) => {
  const [selected, setSelected] = useState([])

  const options = [
    { label: "20%Sommer", value: "sommer" },
    { label: "FreeShipping", value: "freeshipping" },
    { label: "10%Newsletter", value: "newsletter" },
  ]

  return (
    <Flex as="form" flexDirection="column">
      <Text mb={4}>Discount Details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Input mb={4} label="Code" name="code" />
          <Label htmlFor="rule">
            <StyledLabel>Discount Rule</StyledLabel>
          </Label>
          <Select
            name="discountRule"
            placeholder="Select discount rule"
            options={[
              { key: "test1", value: "test1" },
              { key: "test2", value: "test2" },
            ]}
          />
        </Box>
      </Flex>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Label htmlFor="regions">
            <StyledLabel>Valid Regions</StyledLabel>
          </Label>
          <StyledMultiSelect
            options={options}
            value={selected}
            onChange={setSelected}
            labelledBy={"Select"}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

export default NewDiscount
