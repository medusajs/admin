import React, { useEffect, useRef } from "react"
import { ActionMeta, GroupBase, SelectInstance } from "react-select"
import options from "../../../../../domain/products/details/options"
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
  SelectContainer,
  SingleValue,
  ValueContainer,
} from "../../components"
import { SelectStyle } from "../../constants"
import { SelectProvider } from "../../context"
import { AsyncSelectProps, SelectOption } from "../../types"
import { AsyncPaginate } from "./async-paginate-base"
import { AsyncPaginateCreatable } from "./async-paginate-createable"

const AsyncSelect = ({
  value,
  isClearable,
  isCreateable,
  isDisabled,
  isSearchable,
  isMulti,
  hasSelectAll,
  menuPortalTarget,
  placeholder = "Select...",
  onChange,
  onCreateOption,
  loadOptions,
  ...contextProps
}: AsyncSelectProps) => {
  const Component = isCreateable ? AsyncPaginateCreatable : AsyncPaginate
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
    <SelectProvider context={contextProps}>
      <Component
        selectRef={selectRef}
        value={value}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        onCreateOption={onCreateOption}
        loadOptions={loadOptions}
        onChange={handleClick}
        additional={{
          hasSelectAll,
        }}
        menuPlacement="bottom"
        menuPosition="fixed"
        closeMenuOnScroll={true}
        placeholder={placeholder}
        styles={SelectStyle}
        components={{
          SelectContainer: SelectContainer,
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
  )
}

export default AsyncSelect
