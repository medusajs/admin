import React from "react"

type ToasterContainerProps = {
  visible: boolean
} & React.HTMLAttributes<HTMLDivElement>

const ToasterContainer: React.FC<ToasterContainerProps> = ({
  children,
  visible,
  className,
  ...rest
}) => {
  return (
    <div
      className={`${
        visible ? "animate-enter" : "animate-leave"
      } flex items-start bg-grey-0 p-base border border-grey-20 rounded-rounded shadow-toaster mb-xsmall last:mb-0 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export default ToasterContainer
