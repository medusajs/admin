import React, { useImperativeHandle, useRef, useState } from "react"
import { MultiSelect as ReactMultiSelect } from "react-multi-select-component"
import InputContainer from "../fundamentals/input-container"
import InputHeader from "../fundamentals/input-header"
import CheckIcon from "../fundamentals/icons/check-icon"
import "./styles.css"

// const StyledMultiSelect = styled()`
//   color: black;

//   padding: 0;

//   outline: none;

//   .dropdown-container {
//     background-color: inherit;
//   }

//   .dropdown-heading {
//     padding-left: 0px;
//     padding-right: 0px;
//     height: 26px;
//     outline: none;
//   }

// .select-item {
// }

//   dropdown-container:focus-within {
//     box-shadow: none;
//   }

//   .dropdown-content {
//     top: 100%;
//   }

//   .dropdown-heading-value {
//   }

//   .dropdown-heading-dropdown-arrow {
//     display: none;
//   }

//   line-height: 1.22;

//   border: none;
//   outline: 0;

//   transition: all 0.2s ease;

//   border-radius: 3px;

//   .go3433208811:focus-within {
//     box-shadow: none;
//   }

//   .go3433208811 {
//     border: none;
//     border-radius: 3px;
//   }
// `
// type DefaultItemRendererProps = {
//   checked: boolean
//   option: {
//     value: string
//     label: string
//     key?: string
//     disabled?: boolean
//   }
//   disabled?: boolean
//   onClick
// }

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
      <span className="ml-3">{option.label}</span>
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
        <InputHeader {...{ label, required }} />
        <ReactMultiSelect
          name={name}
          isOpen={isOpen}
          ItemRenderer={ItemRenderer}
          type={type}
          value={value}
          className="multiselect-styling"
          options={options}
          onChange={onChange}
          overrideStrings={overrideStrings}
          {...selectOptions}
        />
      </InputContainer>
    )
  }
)

export default MultiSelect
