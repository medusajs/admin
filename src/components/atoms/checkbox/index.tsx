import clsx from "clsx"
import React, { useImperativeHandle } from "react"

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  value: string
}

const Checkbox = React.forwardRef(
  ({ label, value, className, ...rest }: CheckboxProps, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => checkboxRef.current)
    return (
      <label
        className={clsx(
          "flex items-center inter-base-semibold cursor-pointer",
          className
        )}
        htmlFor={`checkbox_${value}`}
      >
        <input
          type="checkbox"
          ref={checkboxRef}
          className="form-checkbox w-[20px] h-[20px] rounded-base text-violet-60 focus:ring-0 mr-small border-grey-30"
          value={value}
          id={`checkbox_${value}`}
          {...rest}
        />
        {label}
      </label>
    )
  }
)

export default Checkbox
