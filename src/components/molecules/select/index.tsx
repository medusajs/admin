import clsx from "clsx"
import React, { useContext, useEffect, useRef, useState } from "react"
import Select, {
  ClearIndicatorProps,
  components,
  InputProps,
  MenuProps,
  MultiValueProps,
  OptionProps,
  PlaceholderProps,
  SingleValueProps,
} from "react-select"
import AsyncSelect from "react-select/async"
import AsyncCreatableSelect from "react-select/async-creatable"
import CreatableSelect from "react-select/creatable"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import CheckIcon from "../../fundamentals/icons/check-icon"
import SearchIcon from "../../fundamentals/icons/search-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader, { InputHeaderProps } from "../../fundamentals/input-header"
import { ModalContext } from "../modal"

type MultiSelectProps = InputHeaderProps & {
  // component props
  label: string
  required?: boolean
  name?: string
  className?: string
  fullWidth?: boolean
  // Multiselect props
  placeholder?: string
  isMultiSelect?: boolean
  labelledBy?: string
  options: { label: string; value: string | null; disabled?: boolean }[]
  value:
    | { label: string; value: string }[]
    | { label: string; value: string }
    | null
  filterOptions?: (q: string) => any[]
  hasSelectAll?: boolean
  isLoading?: boolean
  shouldToggleOnHover?: boolean
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
      className={clsx({
        "-mt-1 z-60": !props.selectProps.isSearchable,
      })}
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

const SingleValue = ({ children, ...props }: SingleValueProps) => {
  if (props.selectProps.menuIsOpen && props.selectProps.isSearchable) {
    return null
  }

  return <components.SingleValue {...props}>{children}</components.SingleValue>
}

const Input = (props: InputProps) => {
  if (
    props.isHidden ||
    !props.selectProps.menuIsOpen ||
    !props.selectProps.isSearchable
  ) {
    return <components.Input {...props} className="pointer-events-none" />
  }

  return (
    <div className="w-full flex items-center h-full space-between">
      <div className="w-full flex items-center">
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

  const {
    innerProps: { ref, ...restInnerProps },
  } = props

  return (
    <div
      onMouseDown={(e) => {
        restInnerProps.onMouseDown(e)
      }}
      ref={ref}
      className="hover:bg-grey-10 text-grey-40 rounded cursor-pointer"
    >
      <XCircleIcon size={20} />
    </div>
  )
}

const CheckboxAdornment = ({ isSelected }) => {
  return (
    <div
      className={clsx(
        `w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base`,
        {
          "bg-violet-60": isSelected,
        }
      )}
    >
      <span className="self-center">
        {isSelected && <CheckIcon size={16} />}
      </span>
    </div>
  )
}

const RadioAdornment = ({ isSelected }) => {
  return (
    <div
      className={clsx(
        "radio-outer-ring outline-0",
        "shrink-0 w-[20px] h-[20px] rounded-circle",
        {
          "shadow-[0_0_0_1px] shadow-[#D1D5DB]": !isSelected,
          "shadow-[0_0_0_2px] shadow-violet-60": isSelected,
        }
      )}
    >
      {isSelected && (
        <div
          className={clsx(
            "group flex items-center justify-center w-full h-full relative",
            "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
          )}
        />
      )}
    </div>
  )
}

const Option = ({ className, ...props }: OptionProps) => {
  return (
    <components.Option
      {...props}
      className="my-1 py-0 py-0 px-2 bg-grey-0 active:bg-grey-0"
    >
      <div
        className={`item-renderer h-full hover:bg-grey-10 py-2 px-2 cursor-pointer rounded`}
      >
        <div className="items-center h-full flex">
          {props.data?.value !== "all" && props.data?.label !== "Select All" ? (
            <>
              {props.isMulti ? (
                <CheckboxAdornment {...props} />
              ) : (
                <RadioAdornment {...props} />
              )}
              <span className="ml-3 text-grey-90 inter-base-regular">
                {props.data.label}
              </span>
            </>
          ) : (
            <span className="text-grey-90 inter-base-regular">
              {props.data.label}
            </span>
          )}
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
      fullWidth = false,
      required,
      value,
      onChange,
      className,
      isMultiSelect,
      hasSelectAll,
      tooltipContent,
      tooltip,
      enableSearch = false,
      clearSelected = false,
      isCreatable,
      filterOptions,
      placeholder = "Search...",
      options,
      onCreateOption,
    }: MultiSelectProps,
    ref
  ) => {
    const { portalRef } = useContext(ModalContext)

    const [isFocussed, setIsFocussed] = useState(false)
    const [scrollBlocked, setScrollBlocked] = useState(true)

    useEffect(() => {
      window.addEventListener("resize", () => {
        setIsFocussed(false)
        selectRef?.current?.blur()
      })
    }, [])

    const selectRef = useRef(null)
    const containerRef = useRef(null)

    const onClick = (e) => {
      if (!isFocussed) {
        setIsFocussed(true)
        selectRef?.current?.focus()
      }
    }

    const onClickOption = (val, ...args) => {
      if (
        val?.length &&
        val?.find((option) => option.value === "all") &&
        hasSelectAll &&
        isMultiSelect
      ) {
        onChange(options)
      } else {
        onChange(val)
        if (!isMultiSelect) {
          selectRef?.current?.blur()
          setIsFocussed(false)
        }
      }
    }

    const handleOnCreateOption = (val) => {
      if (onCreateOption) {
        onCreateOption(val)
        setIsFocussed(false)
        selectRef?.current?.blur()
      }
    }

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (isFocussed) {
          setScrollBlocked(false)
        }
      }, 50)

      return () => clearTimeout(delayDebounceFn)
    }, [isFocussed])

    return (
      <div
        ref={containerRef}
        className={clsx({
          "w-full": fullWidth,
        })}
      >
        <InputContainer
          key={name}
          onFocusLost={() => {
            setIsFocussed(false)
            selectRef.current?.blur()
          }}
          onClick={onClick}
          className={clsx(className, {
            "bg-white rounded-t-rounded": isFocussed,
          })}
        >
          {isFocussed && enableSearch ? (
            <></>
          ) : (
            <div className="w-full flex text-grey-50 pr-0.5 justify-between pointer-events-none cursor-pointer">
              <InputHeader {...{ label, required, tooltip, tooltipContent }} />
              <ArrowDownIcon size={16} />
            </div>
          )}
          {
            <GetSelect
              isCreatable={isCreatable}
              searchBackend={filterOptions}
              options={
                hasSelectAll && isMultiSelect
                  ? [{ value: "all", label: "Select All" }, ...options]
                  : options
              }
              ref={selectRef}
              value={value}
              isMulti={isMultiSelect}
              openMenuOnFocus={isMultiSelect}
              isSearchable={enableSearch}
              isClearable={clearSelected}
              onChange={onClickOption}
              onMenuOpen={() => {
                setIsFocussed(true)
              }}
              onMenuClose={() => {
                setScrollBlocked(true)
                setIsFocussed(false)
              }}
              closeMenuOnScroll={(e) => {
                if (
                  !scrollBlocked &&
                  e.target?.contains(containerRef.current) &&
                  e.target !== document
                ) {
                  return true
                }
              }}
              closeMenuOnSelect={!isMultiSelect}
              blurInputOnSelect={!isMultiSelect}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 60 }) }}
              hideSelectedOptions={false}
              menuPortalTarget={portalRef?.current?.lastChild || document.body}
              menuPlacement="auto"
              backspaceRemovesValue={false}
              classNamePrefix="react-select"
              placeholder={placeholder}
              className="react-select-container"
              onCreateOption={handleOnCreateOption}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
                MultiValueRemove: () => null,
                Placeholder,
                MultiValueLabel,
                Option,
                Input,
                Menu,
                SingleValue,
                ClearIndicator,
              }}
            />
          }
          {isFocussed && enableSearch && <div className="w-full h-5" />}
        </InputContainer>
      </div>
    )
  }
)

const GetSelect = React.forwardRef(
  (
    { isCreatable, searchBackend, onCreateOption, handleClose, ...props },
    ref
  ) => {
    if (isCreatable) {
      return searchBackend ? (
        <AsyncCreatableSelect
          ref={ref}
          defaultOptions={true}
          onCreateOption={onCreateOption}
          isSearchable
          loadOptions={searchBackend}
          {...props}
        />
      ) : (
        <CreatableSelect
          {...props}
          isSearchable
          ref={ref}
          onCreateOption={onCreateOption}
        />
      )
    } else if (searchBackend) {
      return (
        <AsyncSelect
          ref={ref}
          defaultOptions={true}
          loadOptions={searchBackend}
          {...props}
        />
      )
    }
    return <Select ref={ref} {...props} />
  }
)

export default SSelect
