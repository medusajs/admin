import React, { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { MultiSelect as ReactMultiSelect } from "react-multi-select-component"
import InputContainer from "../fundamentals/input-container"
import InputHeader from "../fundamentals/input-header"
import CheckIcon from "../fundamentals/icons/check-icon"
import ArrowDownIcon from "../fundamentals/icons/arrow-down-icon"
import XCircleIcon from "../fundamentals/icons/x-circle-icon"

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
  options: Option[]
  onChange?: MouseEventHandler<HTMLElement>
  label: string
  name?: string
  type
  required
  value
  selectOptions
  overrideStrings
}

const ItemRenderer: React.FC<ItemRendererProps> = ({
  checked,
  option,
  onClick,
  disabled,
}) => (
  <div className={`item-renderer ${disabled && "disabled"}`}>
    <div className="align-center flex">
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

const MultiSelect = React.forwardRef(
  (
    {
      options,
      onChange,
      label,
      name,
      required,
      value,
      selectOptions,
      overrideStrings,
    }: MultiSelectProps,
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)

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
        <ReactMultiSelect
          ref={ref}
          name={name}
          isOpen={isOpen}
          ItemRenderer={ItemRenderer}
          value={value}
          className="multiselect-styling"
          options={options}
          onChange={onChange}
          overrideStrings={{ search: "Search...", ...overrideStrings }}
          ClearIcon={
            <span className="text-grey-40">
              <XCircleIcon size={20} />{" "}
            </span>
          }
          {...selectOptions}
        />
      </InputContainer>
    )
  }
)

export default MultiSelect
