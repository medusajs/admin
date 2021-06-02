import React from "react"
import styled from "@emotion/styled"
import Select from "react-select"
import AsyncCreatableSelect from "react-select/async-creatable"

const StyledSelect = styled(Select)`
  font-size: 14px;

  height: 33px;
  min-height: 33px;

  .css-yk16xz-control {
    height: 33px;
    min-height: 33px;

    border-color: transparent;

    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;

    &:hover {
      border-color: transparent;
    }
  }

  .css-1pahdxg-control {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;

    height: 33px;
    min-height: 33px;

    border-color: transparent;

    &:hover {
      border-color: transparent;
    }
  }
`

const StyledCreatableSelect = styled(AsyncCreatableSelect)`
  font-size: 14px;

  height: 33px;
  min-height: 33px;

  .css-yk16xz-control {
    height: 33px;
    min-height: 33px;

    border-color: transparent;

    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;

    &:hover {
      border-color: transparent;
    }
  }

  .css-1pahdxg-control {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;

    height: 33px;
    min-height: 33px;

    border-color: transparent;

    &:hover {
      border-color: transparent;
    }
  }
`

const customSelectStyles = {
  menuPortal: base => ({
    ...base,
    zIndex: 9999,
    fontSize: "14px",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif;",
  }),
  placeholder: (provided, state) => ({
    ...provided,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: "33px",
    minHeight: "33px",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "33px",
  }),
  input: (provided, state) => ({
    ...provided,
    height: "26px",
  }),
}

export const ReactSelect = React.forwardRef(
  (
    {
      options = [],
      placeholder = "",
      value,
      onChange,
      selectStyles,
      cacheOptions = true,
      ...props
    },
    ref
  ) => {
    return (
      <StyledSelect
        styles={{ ...selectStyles, ...customSelectStyles }}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        options={options}
        {...props}
      />
    )
  }
)

export const ReactCreatableSelect = React.forwardRef(
  (
    {
      options = [],
      placeholder = "",
      value,
      onChange,
      selectStyles,
      cacheOptions = true,
      ...props
    },
    ref
  ) => {
    return (
      <StyledCreatableSelect
        styles={{
          ...selectStyles,
          ...customSelectStyles,
        }}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        options={options}
        {...props}
      />
    )
  }
)
