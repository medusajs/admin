import React, { useImperativeHandle, useRef, useState } from "react"
import { Flex } from "rebass"
import { Label } from "@rebass/forms"
import { default as ReactMultiSelect } from "react-multi-select-component"
import styled from "@emotion/styled"
import InputContainer from "../fundamentals/input-container"
import InputHeader from "../fundamentals/input-header"

const StyledMultiSelect = styled(ReactMultiSelect)`
  color: black;
  background-color: inherit;

  padding: 0;

  height: 33px;

  .dropdown-container {
    height: 33px;
  }

  .dropdown-heading {
    height: 33px;
  }

  line-height: 1.22;

  border: none;
  outline: 0;

  transition: all 0.2s ease;

  border-radius: 3px;

  .go3433208811 {
    border: none;
    border-radius: 3px;
  }
`

const MultiSelect = React.forwardRef(
  (
    {
      options,
      onChange,
      inline,
      label,
      name,
      type,
      required,
      value,
      selectOptions,
      overrideStrings,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useImperativeHandle(ref, () => dropdownRef.current)

    return (
      <InputContainer key={name} onClick={() => setIsOpen(!isOpen)}>
        <InputHeader {...{ label, required }} />
        <StyledMultiSelect
          ref={dropdownRef}
          isOpen={isOpen}
          inline={inline}
          name={name}
          type={type}
          value={value}
          options={options}
          onChange={onChange}
          overrideStrings={overrideStrings}
          {...selectOptions}
        />
      </InputContainer>
    )
  }
)

export default MultiSelect
