import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useImperativeHandle,
  useRef,
} from "react"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"

type inputProps = {
  invalid?: boolean
  placeholder?: string
  defaultValue?: string
  step?: string
  min?: number
  max?: number
  inline?: boolean
  label: string
  name?: string
  type?: string
  inputStyle?: any
  required?: boolean
  value?: any
  deletable?: boolean
  onDelete?: MouseEventHandler<HTMLSpanElement>
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  textAlign?: string
  disabled?: boolean
  withTooltip?: boolean
  tooltipText?: string
  tooltipProps?: any
  start?: any
  props?: React.HTMLAttributes<HTMLDivElement>
}

const InputField = React.forwardRef(
  (
    {
      invalid,
      placeholder,
      defaultValue,
      step,
      min,
      max,
      inline,
      label,
      name,
      type,
      inputStyle,
      required,
      value,
      deletable,
      onDelete,
      onChange,
      onFocus,
      textAlign,
      disabled,
      withTooltip = false,
      tooltipText,
      tooltipProps = {},
      props,
    }: inputProps,
    ref
  ) => {
    const inputRef = useRef(null)

    useImperativeHandle(ref, () => inputRef.current)

    const onClickChevronUp = () => {
      inputRef.current?.stepUp()
      if (onChange) {
        inputRef.current?.dispatchEvent(
          new InputEvent("change", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
        )
      }
    }

    const onClickChevronDown = () => {
      inputRef.current?.stepDown()
      if (onChange) {
        inputRef.current?.dispatchEvent(
          new InputEvent("change", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
        )
      }
    }

    return (
      <InputContainer
        props={props}
        key={name}
        onClick={() => inputRef?.current?.focus()}
      >
        {label && (
          <InputHeader
            {...{ label, required, withTooltip, tooltipText, tooltipProps }}
          />
        )}
        <div className="w-full flex mt-1">
          <input
            className="bg-inherit outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40"
            ref={inputRef}
            defaultValue={defaultValue}
            autoComplete="off"
            name={name}
            key={name}
            type={type}
            min={min}
            max={max}
            value={value}
            step={step || "1"}
            placeholder={placeholder ? placeholder : "Placeholder"}
            onChange={onChange}
            onMouseDown={e => e.stopPropagation()}
            onFocus={onFocus}
            disabled={disabled}
          />

          {deletable && (
            <span onClick={onDelete} className="cursor-pointer ml-2">
              &times;
            </span>
          )}

          {type === "number" && (
            <div className="flex self-end">
              <span
                onClick={onClickChevronDown}
                onMouseDown={e => e.preventDefault()}
                className="mr-2 text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
              >
                <MinusIcon size={16} />
              </span>
              <span
                onMouseDown={e => e.preventDefault()}
                onClick={onClickChevronUp}
                className="text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
              >
                <PlusIcon size={16} />
              </span>
            </div>
          )}
        </div>
      </InputContainer>
    )
  }
)

export default InputField
