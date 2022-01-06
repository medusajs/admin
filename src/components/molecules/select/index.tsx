import React, { ChangeEventHandler, useState } from "react"
import { MultiSelect } from "react-multi-select-component"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"

type Option = React.OptionHTMLAttributes<HTMLOptionElement> & {
  key?: string
}

type ItemRendererProps = {
  checked?: boolean
  onClick?: ChangeEventHandler<HTMLElement>
  disabled?: boolean
  option?: Option
}

type MultiSelectProps = {
  // component props
  label: string
  required?: boolean
  name?: string
  // Multiselect props
  isMultiSelect?: boolean
  labelledBy?: string
  options: { label: string; value: string; disabled?: boolean }[]
  value: { label: string; value: string }[]
  hasSelectAll?: boolean
  isLoading?: boolean
  shouldToggleOnHover?: boolean
  overrideStrings?: object
  onChange: (values: any[]) => void
  disabled?: boolean
  enableSearch?: boolean
  isCreatable?: boolean
  onCreateOption: any
}

const ItemRenderer: React.FC<ItemRendererProps> = ({
  checked,
  option,
  onClick,
  disabled,
}) => (
  <div className={`item-renderer ${disabled && "disabled"} w-full h-full`}>
    <div className="items-center h-full flex">
      <div
        className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
          checked && "bg-violet-60"
        }`}
      >
        <span className="self-center">
          {checked && <CheckIcon size={16} />}
        </span>
      </div>
      <input
        className="hidden"
        type="checkbox"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span className="ml-3 text-grey-90">{option.label}</span>
    </div>
  </div>
)

const Select = React.forwardRef(
  (
    {
      label,
      name,
      required,
      value,
      onChange,
      isMultiSelect,
      hasSelectAll,
      enableSearch,
      overrideStrings,
      labelledBy = "label",
      ...selectOptions
    }: MultiSelectProps,
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = values => {
      if (values.length) {
        onChange(isMultiSelect ? values : [values[values.length - 1]])
      } else {
        onChange([])
      }
    }

    return (
      <InputContainer
        key={name}
        onFocusLost={() => setIsOpen(false)}
        onClick={() => setIsOpen(true)}
      >
        <div className="w-full flex text-grey-50 justify-between">
          <InputHeader {...{ label, required }} />
          <ArrowDownIcon size={16} />
        </div>
        <MultiSelect
          labelledBy={labelledBy}
          value={value}
          isOpen={isOpen}
          hasSelectAll={hasSelectAll}
          ItemRenderer={ItemRenderer}
          className="multiselect-styling"
          overrideStrings={{ search: "Search...", ...overrideStrings }}
          ClearIcon={
            <span className="text-grey-40">
              <XCircleIcon size={20} />
            </span>
          }
          onChange={handleSelect}
          {...selectOptions}
          disableSearch={!enableSearch}
        />
      </InputContainer>
    )
  }
)

export default Select
