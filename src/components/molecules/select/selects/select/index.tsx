import React, { useContext, useEffect, useRef } from "react"
import Base, {
  ActionMeta,
  GroupBase,
  OnChangeValue,
  SelectInstance,
} from "react-select"
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

const Select = <
  Option extends unknown,
  Group extends GroupBase<Option>,
  IsCreateable extends boolean = false,
  IsAsync extends boolean = false,
  IsMulti extends boolean = false
>({
  value,
  options,
  isClearable,
  isCreateable,
  isDisabled,
  isSearchable,
  isMulti,
  placeholder = "Select...",
  onChange,
  onCreateOption,
  hasSelectAll,
  id,
  name,
  ...contextProps
}: SelectProps<Option, IsMulti, Group, IsCreateable, IsAsync>) => {
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

  const handleClick = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    // If option clicked is not "Select all"
    if (!hasSelectAll) {
      onChange(newValue as Option, actionMeta)
      return
    }

    // If option clicked is "Select all", determine if we should select all or deselect all
    if (
      Array.isArray(value) &&
      value.length === options?.length &&
      (newValue as any[]).find((option) => option.value === "__ALL__")
    ) {
      onChange([] as Option, actionMeta)
    } else {
      onChange(options as Option, actionMeta)
    }
  }

  const { portalRef } = useContext(ModalContext)

  return (
    <div className="relative">
      <SelectProvider context={{ hasSelectAll, ...contextProps }}>
        <Component
          id={id}
          name={name}
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
          onChange={
            handleClick as (
              newValue: unknown,
              actionMeta: ActionMeta<unknown>
            ) => void
          }
          menuPortalTarget={portalRef?.current?.lastChild || null}
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
