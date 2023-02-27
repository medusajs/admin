import clsx from "clsx"
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useImperativeHandle,
  useRef,
} from "react"
import InputError from "../../atoms/input-error"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputHeader, { InputHeaderProps } from "../../fundamentals/input-header"

export type InputProps = Omit<React.ComponentPropsWithRef<"input">, "prefix"> &
  InputHeaderProps & {
    small?: boolean
    label?: string
    deletable?: boolean
    onDelete?: MouseEventHandler<HTMLSpanElement>
    onChange?: ChangeEventHandler<HTMLInputElement>
    onFocus?: FocusEventHandler<HTMLInputElement>
    errors?: { [x: string]: unknown }
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    props?: React.HTMLAttributes<HTMLDivElement>
  }

const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      small,
      placeholder,
      label,
      name,
      required,
      deletable,
      onDelete,
      onChange,
      onFocus,
      tooltipContent,
      tooltip,
      prefix,
      suffix,
      errors,
      props,
      className,
      ...fieldProps
    }: InputProps,
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current
    )

    const onNumberIncrement = () => {
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

    const onNumberDecrement = () => {
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
      <div className={clsx("w-full", className)} {...props}>
        {label && (
          <InputHeader
            {...{ label, required, tooltipContent, tooltip }}
            className="mb-xsmall"
          />
        )}
        <div
          className={clsx(
            "border-gray-20 flex w-full items-center rounded-rounded border bg-grey-5 px-small py-xsmall focus-within:border-violet-60 focus-within:shadow-input",
            {
              "border-rose-50 focus-within:border-rose-50 focus-within:shadow-cta focus-within:shadow-rose-60/10":
                errors && name && errors[name],
            },
            small ? "h-8" : "h-10"
          )}
        >
          {prefix ? (
            <span className="mr-2xsmall text-grey-40">{prefix}</span>
          ) : null}
          <input
            className={clsx(
              "remove-number-spinner w-full bg-transparent font-normal leading-base text-grey-90 placeholder-grey-40 caret-violet-60 outline-none outline-0",
              { "text-small": small, "pt-[1px]": small }
            )}
            ref={inputRef}
            autoComplete="off"
            name={name}
            placeholder={placeholder || `${label}...` || "Placeholder"}
            onChange={onChange}
            onFocus={onFocus}
            required={required}
            {...fieldProps}
          />
          {suffix ? (
            <span className="mx-2xsmall text-grey-40">{suffix}</span>
          ) : null}

          {deletable && (
            <button
              onClick={onDelete}
              className="ml-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-soft pb-px text-grey-50 outline-none hover:bg-grey-10 focus:bg-grey-20"
              type="button"
            >
              &times;
            </button>
          )}

          {fieldProps.type === "number" && (
            <div className="flex h-full items-center self-end">
              <button
                onClick={onNumberDecrement}
                onMouseDown={(e) => e.preventDefault()}
                className="mr-2 h-4 w-4 cursor-pointer rounded-soft text-grey-50 outline-none hover:bg-grey-10 focus:bg-grey-20"
                type="button"
              >
                <MinusIcon size={16} />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onNumberIncrement}
                className="h-4 w-4 cursor-pointer rounded-soft text-grey-50 outline-none hover:bg-grey-10 focus:bg-grey-20"
                type="button"
              >
                <PlusIcon size={16} />
              </button>
            </div>
          )}
        </div>
        <InputError name={name} errors={errors} />
      </div>
    )
  }
)

export default InputField
