import React, { useContext, useRef } from "react"
import {
  ActionMeta,
  GroupBase,
  OnChangeValue,
  SelectInstance,
} from "react-select"
import options from "../../../../../domain/products/details/options"
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
  SelectContainer,
  SingleValue,
  ValueContainer,
} from "../../components"
import { SelectStyle } from "../../constants"
import { SelectProvider } from "../../context"
import { SelectProps } from "../../types"
import { closeOnScroll, useCloseOnResize } from "../../utils"
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
  name,
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
  const containerRef = useRef<HTMLDivElement>(null)

  useCloseOnResize(selectRef.current)

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
    <div className="relative" ref={containerRef}>
      <SelectProvider context={contextProps}>
        <Component
          id={id}
          name={name}
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
          debounceTimeout={300}
          menuPortalTarget={portalRef?.current?.lastChild || null}
          menuPlacement="bottom"
          menuPosition="fixed"
          closeMenuOnScroll={(e) => closeOnScroll(e, containerRef.current)}
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
    </div>
  )
}

export default AsyncSelect
