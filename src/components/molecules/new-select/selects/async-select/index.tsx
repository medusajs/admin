import React from "react"
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
import { AsyncSelectProps } from "../../types"
import { AsyncPaginate } from "./async-paginate-base"
import { AsyncPaginateCreatable } from "./async-paginate-createable"

const AsyncSelect = ({
  value,
  isClearable,
  isCreateAble,
  isDisabled,
  isSearchAble,
  isMulti,
  hasSelectAll,
  menuPortalTarget,
  placeholder = "Select...",
  onChange,
  onCreateOption,
  loadOptions,
  ...contextProps
}: AsyncSelectProps) => {
  const Component = SelectComponent(isCreateAble)

  return (
    <SelectProvider context={contextProps}>
      <Component
        value={value}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isSearchable={isSearchAble}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        onCreateOption={onCreateOption}
        loadOptions={loadOptions}
        onChange={onChange}
        additional={{
          hasSelectAll,
        }}
        menuPortalTarget={menuPortalTarget || document.body}
        menuPlacement="bottom"
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

const SelectComponent = (isCreateAble?: boolean) => {
  if (isCreateAble) {
    return AsyncPaginateCreatable
  } else {
    return AsyncPaginate
  }
}

export default AsyncSelect
