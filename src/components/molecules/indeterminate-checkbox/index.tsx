import clsx from "clsx"
import React, { ChangeEvent, ComponentProps, useImperativeHandle } from "react"
import CheckIcon from "../../fundamentals/icons/check-icon"
import MinusIcon from "../../fundamentals/icons/minus-icon"

type IndeterminateCheckboxProps = {
  onChange?: (e: ChangeEvent) => void
  checked?: boolean
  title?: string
  indeterminate?: boolean
} & ComponentProps<"input">

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate = false, className, checked, ...rest }, ref) => {
  const innerRef = React.useRef<HTMLInputElement | null>(null)

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
    ref,
    () => innerRef.current
  )

  React.useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate
    }
  }, [innerRef, indeterminate])

  const handleClick = () => {
    if (innerRef.current) {
      innerRef.current.click()
    }
  }

  return (
    <div className="items-center h-full justify-center flex">
      <div
        onClick={handleClick}
        className={clsx(
          `w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base`,
          {
            "bg-violet-60": checked,
            "cursor-default": rest.disabled,
          }
        )}
      >
        <span className="self-center">
          {checked ? (
            <CheckIcon size={16} />
          ) : indeterminate ? (
            <MinusIcon size={16} className="text-grey-50" />
          ) : null}
        </span>
      </div>
      <input
        type="checkbox"
        className={clsx("hidden", className)}
        checked={checked}
        ref={innerRef}
        {...rest}
      />
    </div>
  )
})

export default IndeterminateCheckbox
