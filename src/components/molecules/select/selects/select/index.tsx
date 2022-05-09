import React, { useEffect, useRef } from "react"
import Base, { ActionMeta, GroupBase, SelectInstance } from "react-select"
import Createable from "react-select/creatable"
import {
  ClearIndicator,
  Control,
  DropdownIndicator,
  IndicatorsContainer,
  Input,
  Menu,
  MultiValue,
  MultiValueLabel,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
} from "../../components"
import { SelectStyle } from "../../constants"
import { SelectProvider } from "../../context"
import { SelectOption, SelectProps } from "../../types"

const Select = ({
  value,
  options,
  isClearable,
  isCreateable,
  isDisabled,
  isSearchable,
  isMulti,
  menuPortalTarget,
  placeholder = "Select...",
  onChange,
  onCreateOption,
  hasSelectAll,
  ...contextProps
}: SelectProps) => {
  const Component = isCreateable ? Createable : Base
  const selectRef = useRef<
    SelectInstance<unknown, boolean, GroupBase<unknown>>
  >(null)

  useEffect(() => {
    const closeOnResize = () => {
      selectRef.current?.blur()
    }

    window.addEventListener("resize", closeOnResize)
    return () => window.removeEventListener("resize", closeOnResize)
  }, [])

  const handleClick = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    if (
      hasSelectAll &&
      (newValue as SelectOption[]).find((option) => option.value === "__ALL__")
    ) {
      if (Array.isArray(value) && value.length === options?.length) {
        onChange([], actionMeta)
      } else {
        onChange(options, actionMeta)
      }
    } else {
      onChange(newValue, actionMeta)
    }
  }

  return (
    <div className="relative">
      <SelectProvider context={{ hasSelectAll, ...contextProps }}>
        <Component
          ref={selectRef}
          value={value}
          options={
            isMulti && hasSelectAll && options
              ? [{ label: "Select all", value: "__ALL__" }, ...options]
              : options
          }
          isClearable={isClearable}
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          isMulti={isMulti}
          closeMenuOnSelect={!isMulti}
          hideSelectedOptions={false}
          onCreateOption={onCreateOption}
          onChange={handleClick}
          backspaceRemovesValue={false}
          closeMenuOnScroll={true}
          menuPlacement="bottom"
          menuPosition="fixed"
          placeholder={placeholder}
          styles={SelectStyle}
          components={{
            Option: Option,
            Menu: Menu,
            ValueContainer: ValueContainer,
            Control: Control,
            DropdownIndicator: DropdownIndicator,
            IndicatorSeparator: () => null,
            Input: Input,
            ClearIndicator: ClearIndicator,
            MultiValueRemove: () => null,
            MultiValue: MultiValue,
            MultiValueLabel: MultiValueLabel,
            IndicatorsContainer: IndicatorsContainer,
            LoadingIndicator: () => null,
            Placeholder: Placeholder,
            LoadingMessage: () => null,
            SingleValue: SingleValue,
          }}
        />
      </SelectProvider>
    </div>
  )
}

export default Select
