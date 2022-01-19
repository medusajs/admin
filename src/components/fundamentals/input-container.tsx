import React from "react"
import clsx from "clsx"
import { MouseEventHandler } from "react"

type InputContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  key?: string
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onFocusLost?: () => void
}

const InputContainer: React.FC<InputContainerProps> = ({
  key,
  onClick,
  onFocusLost,
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      key={key}
      tabIndex={-1}
      onClick={onClick}
      onBlur={(e) => {
        if (onFocusLost && !e.currentTarget.contains(e.relatedTarget)) {
          onFocusLost()
        }
      }}
      className={clsx([
        `bg-grey-5 inter-base-regular w-full p-3 flex h-18 flex-col cursor-text border border-grey-20 focus-within:shadow-input focus-within:border-violet-60 rounded-base`,
        className,
      ])}
    >
      {children}
    </div>
  )
}

export default InputContainer
