import React from "react"
import { MouseEventHandler } from "react"

type InputContainerProps = {
  key?: string
  props?: React.HTMLAttributes<HTMLDivElement>
  onClick?: MouseEventHandler<HTMLDivElement>
}

const InputContainer: React.FC<InputContainerProps> = ({
  key,
  props,
  onClick,
  children,
}) => {
  return (
    <div
      tabIndex={-1}
      className="bg-grey-5 inter-base-regular w-full p-3 flex h-18 flex-col cursor-text border border-grey-20 focus-within:shadow-input focus-within:border-violet-60 rounded-base my-4"
      onClick={onClick}
      key={key}
      {...props}
    >
      {children}
    </div>
  )
}

export default InputContainer
