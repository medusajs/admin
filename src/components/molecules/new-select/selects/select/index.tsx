import Base from "react-select"
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
import { SelectProps } from "../../types"

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
  ...contextProps
}: SelectProps) => {
  const Component = SelectComponent(isCreateable)

  return (
    <SelectProvider context={contextProps}>
      <Component
        value={value}
        options={options}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        onCreateOption={onCreateOption}
        onChange={onChange}
        menuPortalTarget={menuPortalTarget || document.body}
        menuPlacement="bottom"
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
  )
}

const SelectComponent = (isCreateAble?: boolean) => {
  if (isCreateAble) {
    return Createable
  } else {
    return Base
  }
}

export default Select
