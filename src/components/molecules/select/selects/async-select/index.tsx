import React, { useEffect, useRef } from "react"
import {
  ActionMeta,
  GroupBase,
  OnChangeValue,
  SelectInstance,
} from "react-select"
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
import { SelectOption, SelectProps } from "../../types"
import { AsyncPaginate } from "./async-paginate-base"
import { AsyncPaginateCreatable } from "./async-paginate-createable"

const AsyncSelect = <
  Option extends unknown,
  Group extends GroupBase<Option>,
  IsAsync extends true,
  IsCreateable extends boolean = false,
  IsMulti extends boolean = false
>({
  id,
  value,
  isClearable,
  isCreateable,
  isDisabled,
  isSearchable,
  isMulti,
  hasSelectAll,
  placeholder = "Select...",
  onChange,
  onCreateOption,
  loadOptions,
  ...contextProps
}: SelectProps<Option, IsMulti, Group, IsCreateable, IsAsync>) => {
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

  const handleClick = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    // If option clicked is not "Select all"
    if (
      !isMulti &&
      !(newValue as SelectOption[]).find((option) => option.value === "__ALL__")
    ) {
      onChange(newValue as Option, actionMeta)
      return
    }

    // If option clicked is "Select all", determine if we should select all or deselect all
    if (Array.isArray(value) && value.length === options?.length) {
      onChange([] as Option, actionMeta)
    } else {
      onChange(options as Option, actionMeta)
    }
  }

  return (
    <SelectProvider context={contextProps}>
      <Component
        id={id}
        selectRef={selectRef}
        value={value}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        onCreateOption={onCreateOption}
        loadOptions={loadOptions as any}
        onChange={
          handleClick as (
            newValue: unknown,
            actionMeta: ActionMeta<unknown>
          ) => void
        }
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
