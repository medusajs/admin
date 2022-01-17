import React, {
  ChangeEventHandler,
  FocusEventHandler,
  useImperativeHandle,
  useRef,
} from "react"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import clsx from "clsx"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  key?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  onFocus?: FocusEventHandler<HTMLTextAreaElement>
  withTooltip?: boolean
  tooltipText?: string
  tooltipProps?: any
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const Textarea = React.forwardRef(
  (
    {
      placeholder,
      label,
      name,
      key,
      required,
      onChange,
      onFocus,
      withTooltip = false,
      tooltipText,
      tooltipProps = {},
      containerProps,
      className,
      ...props
    }: TextareaProps,
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

    const scrollToTop = () => {
      if (inputRef.current) {
        inputRef.current.scrollTop = 0
      }
    }

    return (
      <InputContainer
        className={className}
        key={name}
        onClick={() => inputRef?.current?.focus()}
        {...containerProps}
      >
        {label && (
          <InputHeader
            {...{ label, required, withTooltip, tooltipText, tooltipProps }}
          />
        )}
        <div className="w-full flex mt-1">
          <textarea
            className={clsx(
              "relative text-justify overflow-hidden focus:overflow-auto resize-none bg-inherit outline-none outline-0",
              "w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40",
              "line-clamp-until-focus"
            )}
            ref={inputRef}
            autoComplete="off"
            name={name}
            key={key || name}
            placeholder={placeholder || "Placeholder"}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={scrollToTop}
            rows={4}
            {...props}
          />
        </div>
      </InputContainer>
    )
  }
)

export default Textarea
