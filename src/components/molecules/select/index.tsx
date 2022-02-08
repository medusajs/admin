import React, { useContext, useRef, useState } from "react"
import Select, {
  ClearIndicatorProps,
  components,
  InputProps,
  MenuProps,
  MultiValueProps,
  OptionProps,
  PlaceholderProps,
} from "react-select"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import CheckIcon from "../../fundamentals/icons/check-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import clsx from "clsx"
import SearchIcon from "../../fundamentals/icons/search-icon"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ModalContext } from "../modal"

type MultiSelectProps = {
  // component props
  label: string
  required?: boolean
  name?: string
  className?: string
  // Multiselect props
  placeholder?: string
  isMultiSelect?: boolean
  labelledBy?: string
  options: { label: string; value: string; disabled?: boolean }[]
  value:
    | { label: string; value: string }[]
    | { label: string; value: string }
    | null
  hasSelectAll?: boolean
  isLoading?: boolean
  shouldToggleOnHover?: boolean
  overrideStrings?: object
  onChange: (values: any[] | any) => void
  disabled?: boolean
  enableSearch?: boolean
  isCreatable?: boolean
  clearSelected?: boolean
  onCreateOption?: (value: string) => { value: string; label: string }
}

const MultiValueLabel = ({ ...props }: MultiValueProps) => {
  const isLast =
    props.data === props.selectProps.value[props.selectProps.value.length - 1]

  if (props.selectProps.menuIsOpen && props.selectProps.isSearchable) {
    return <></>
  }

  return (
    <div
      className={clsx("bg-grey-5 mx-0 inter-base-regular p-0", {
        "after:content-[',']": !isLast,
      })}
    >
      {props.children}
    </div>
  )
}

const Menu = ({ className, ...props }: MenuProps) => {
  return (
    <components.Menu
      className={clsx({ "-mt-1 z-60": !props.selectProps.isSearchable })}
      {...props}
    >
      {props.children}
    </components.Menu>
  )
}

const Placeholder = (props: PlaceholderProps) => {
  return props.selectProps.menuIsOpen ? null : (
    <components.Placeholder {...props} />
  )
}

const Input = (props: InputProps) => {
  if (
    props.isHidden ||
    !props.selectProps.menuIsOpen ||
    !props.selectProps.isSearchable
  ) {
    return <components.Input {...props} />
  }

  return (
    <div className="w-full flex items-center h-full space-between">
      <div className="w-full flex w-full items-center">
        <span className="text-grey-40 mr-2">
          <SearchIcon size={20} />
        </span>
        <components.Input {...props} />
      </div>
      <span className="text-grey-40 hover:bg-grey-5 cursor-pointer rounded">
        {typeof props.value === "string" && props.value !== "" && (
          <XCircleIcon size={20} />
        )}
      </span>
    </div>
  )
}

const ClearIndicator = ({ ...props }: ClearIndicatorProps) => {
  if (props.selectProps.menuIsOpen && props.selectProps.isMulti) {
    return <></>
  }

  return (
    <div className="hover:bg-grey-10 text-grey-40 rounded cursor-pointer">
      <XCircleIcon size={20} />
    </div>
  )
}

const Option = ({ className, ...props }: OptionProps) => {
  // is selected for single select: state.data === state.selectProps.value
  return (
    <components.Option
      {...props}
      className="my-1 py-0 py-0 px-2 bg-grey-0 active:bg-grey-0"
    >
      <div
        className={`item-renderer h-full hover:bg-grey-10 py-2 px-2 cursor-pointer rounded`}
      >
        <div className="items-center h-full flex">
          <div
            className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
              props.isSelected && "bg-violet-60"
            }`}
          >
            <span className="self-center">
              {props.isSelected && <CheckIcon size={16} />}
            </span>
          </div>
          <span className="ml-3 text-grey-90 inter-base-regular">
            {props.data.label}
          </span>
        </div>
      </div>
    </components.Option>
  )
}

const SSelect = React.forwardRef(
  (
    {
      label,
      name,
      required,
      value,
      onChange,
      className,
      isMultiSelect,
      hasSelectAll,
      enableSearch = false,
      overrideStrings,
      clearSelected,
      placeholder = "Search...",
      labelledBy = "label",
      options,
      ...selectOptions
    }: MultiSelectProps,
    ref
  ) => {
    const { portalRef } = useContext(ModalContext)

    const [isOpen, setIsOpen] = useState(false)

    const selectRef = useRef(null)
    const onClick = () => {
      setIsOpen(true)
      selectRef.current?.focus()
    }

    const onClickOption = (val) => {
      console.log("clicked")
      onChange(val)
    }

    return (
      <InputContainer
        key={name}
        onFocusLost={() => setIsOpen(false)}
        onClick={onClick}
        className={clsx(className, { "bg-white rounded-t-rounded": isOpen })}
      >
        {isOpen && enableSearch ? (
          <></>
        ) : (
          <div className="w-full flex text-grey-50 pr-0.5 justify-between">
            <InputHeader {...{ label, required }} />
            <ArrowDownIcon size={16} />
          </div>
        )}
        <CacheProvider
          value={createCache({
            key: "my-select-cache",
            prepend: true,
          })}
        >
          <Select
            options={options}
            ref={selectRef}
            value={value}
            isMulti={isMultiSelect}
            isSearchable={enableSearch}
            menuIsOpen={isOpen}
            isClearable={clearSelected}
            onChange={onClickOption}
            closeMenuOnSelect={!isMultiSelect}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 60 }) }}
            hideSelectedOptions={false}
            menuPortalTarget={portalRef?.current?.lastChild || document.body}
            menuPlacement="auto"
            backspaceRemovesValue={false}
            classNamePrefix="react-select"
            placeholder={placeholder}
            className="react-select-container"
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              MultiValueRemove: () => null,
              Placeholder,
              MultiValueLabel,
              Option,
              ClearIndicator,
              Input,
              Menu,
            }}
          />
        </CacheProvider>
        {isOpen && enableSearch && <div className="w-full h-5" />}
      </InputContainer>
    )
  }
)

export default SSelect
