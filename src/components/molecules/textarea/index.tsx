import clsx from "clsx"
import React, { useImperativeHandle, useRef } from "react"
import InputHeader from "../../fundamentals/input-header"
import EmojiPicker from "../emoji-picker"

type TextareaProps = React.ComponentPropsWithRef<"textarea"> & {
  label: string
  key?: string
  enableEmoji?: boolean
  withTooltip?: boolean
  tooltipText?: string
  tooltipProps?: any
  children?: React.ReactNode
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => inputRef.current
    )

    const scrollToTop = () => {
      if (inputRef.current) {
        inputRef.current.scrollTop = 0
      }
    }

    const handleAddEmoji = (emoji: string) => {
      if (!inputRef.current) {
        return
      }

      const position = inputRef.current.selectionStart || 0

      const newValue = `${inputRef.current?.value.substring(
        0,
        position
      )}${emoji}${inputRef.current?.value.substring(position)}`

      inputRef.current.value = newValue
    }

    return (
      <div className={className} {...containerProps}>
        {label && (
          <InputHeader
            {...{ label, required, withTooltip, tooltipText, tooltipProps }}
            className="mb-xsmall"
          />
        )}
        <div className="w-full flex flex-col focus-within:shadow-input focus-within:border-violet-60 px-small py-xsmall bg-grey-5 border border-grey-20 rounded-rounded">
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
            onSelect={(e) => {}}
            rows={rows}
            {...props}
          />
          {enableEmoji && <EmojiPicker onEmojiClick={handleAddEmoji} />}
        </div>
      </div>
    )
  }
)

export default TextArea
