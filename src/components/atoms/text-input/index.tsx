import React from "react"

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => (
    <div>
      <input
        ref={ref}
        className="placeholder:inter-base-regular placeholder-grey-40 focus:outline-none"
        {...props}
      />
    </div>
  )
)

export default TextInput
