import React from "react"
import { Text, Flex } from "rebass"
import { Label } from "@rebass/forms"
import { default as ReactMultiSelect } from "react-multi-select-component"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledMultiSelect = styled(ReactMultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  max-width: 350px;
  flex: 50% 0 0;
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
  ${props =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}
  
  ${props =>
    props.required &&
    `
  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
  `}
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
    return (
      <Flex
        alignItems={inline && "center"}
        flexDirection={inline ? "row" : "column"}
        width={props.width}
        {...props}
      >
        {label && (
          <Label
            flex={"30% 0 0"}
            htmlFor={name}
            display={props.start ? "flex" : inline && "inline !important"}
          >
            <StyledLabel required={required} inline={inline}>
              {label}
            </StyledLabel>
          </Label>
        )}
        <StyledMultiSelect
          ref={ref}
          inline={inline}
          name={name}
          type={type}
          value={value}
          options={options}
          onChange={onChange}
          overrideStrings={overrideStrings}
          {...selectOptions}
        />
      </Flex>
    )
  }
)

export default MultiSelect
