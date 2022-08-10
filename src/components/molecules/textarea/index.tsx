import clsx from "clsx"
import React, { useImperativeHandle, useRef } from "react"
import InputHeader from "../../fundamentals/input-header"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  key?: string
  enableEmoji?: boolean
  withTooltip?: boolean
  tooltipText?: string
  tooltipProps?: any
  children?: any
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const TextArea = React.forwardRef(
  (
    {
      placeholder,
      label,
      name,
      key,
      required,
      withTooltip = false,
      tooltipText,
      tooltipProps = {},
      containerProps,
      className,
      enableEmoji = false,
      rows = 2,
      children,
      ...props
    }: TextareaProps,
    ref
  ) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => inputRef.current)

    const scrollToTop = () => {
      if (inputRef.current) {
        inputRef.current.scrollTop = 0
      }
    }

    return (
      <div className={className} {...containerProps}>
        {label && (
          <InputHeader
            {...{ label, required, withTooltip, tooltipText, tooltipProps }}
            className="mb-xsmall"
          />
        )}
        <div className="w-full flex focus-within:shadow-input focus-within:border-violet-60 px-small py-xsmall bg-grey-5 border border-grey-20 rounded-rounded">
          <textarea
            className={clsx(
              "relative text-justify overflow-hidden focus:overflow-auto resize-none bg-inherit outline-none outline-0",
              "w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40",
              "line-clamp-[var(--lines)] focus:line-clamp-none"
            )}
            style={
              {
                "--lines": rows,
              } as React.CSSProperties
            }
            ref={inputRef}
            autoComplete="off"
            name={name}
            key={key || name}
            placeholder={placeholder || "Placeholder"}
            onBlur={scrollToTop}
            rows={rows}
            {...props}
          />
        </div>
        {children}
      </div>
    )
  }
)

export default TextArea
