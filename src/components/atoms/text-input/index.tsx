import clsx from "clsx"
import React from "react"

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "placeholder:inter-base-regular placeholder-grey-40 focus:outline-none",
        className
      )}
      {...props}
    />
  )
)

export default TextInput
