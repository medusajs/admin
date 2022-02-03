import clsx from "clsx"
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  useImperativeHandle,
  useRef,
} from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  key?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  props?: React.HTMLAttributes<HTMLDivElement>
}

const SigninInput = React.forwardRef(
  (
    {
      placeholder,
      name,
      key,
      required,
      onChange,
      onFocus,
      className,
      ...props
    }: InputProps,
    ref
  ) => {
    const inputRef = useRef(null)

    useImperativeHandle(ref, () => inputRef.current)

    return (
      <input
        className={clsx(
          "outline-none outline-0 remove-number-spinner leading-base",
          "w-[320px] h-[48px] py-3 px-4 mt-4 border rounded-rounded",
          "bg-grey-5 inter-base-regular placeholder:text-grey-40",
          "focus-within:shadow-input focus-within:border-violet-60",
          className
        )}
        ref={inputRef}
        autoComplete="off"
        name={name}
        key={key || name}
        placeholder={placeholder || "Placeholder"}
        onChange={onChange}
        onFocus={onFocus}
        {...props}
      />
    )
  }
)

export default SigninInput
