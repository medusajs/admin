import React, { useImperativeHandle, useRef, useState } from "react"
import { MultiSelect as ReactMultiSelect } from "react-multi-select-component"
import InputContainer from "../fundamentals/input-container"
import InputHeader from "../fundamentals/input-header"
import CheckIcon from "../fundamentals/icons/check-icon"
import ArrowDownIcon from "../fundamentals/icons/arrow-down-icon"
import XCircleIcon from "../fundamentals/icons/x-circle-icon"

const ItemRenderer = ({ checked, option, onClick, disabled }) => (
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
      inline,
      label,
      name,
      type,
      required,
      value,
      selectOptions,
      overrideStrings,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useImperativeHandle(ref, () => dropdownRef.current)

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
          name={name}
          isOpen={isOpen}
          ItemRenderer={ItemRenderer}
          type={type}
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
