import { useContext, useEffect } from "react"
import Base from "react-select"
import Createable from "react-select/creatable"
import { ModalContext } from "../../../modal"
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
  const Component = isCreateable ? Createable : Base

  const { portalRef } = useContext(ModalContext)

  useEffect(() => {
    console.log("portalRef", portalRef?.current?.lastChild)
  }, [portalRef])

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
        backspaceRemovesValue={false}
        menuPortalTarget={portalRef?.current?.lastChild || document.body}
        menuPlacement="auto"
        className="react-select-container"
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

export default Select
