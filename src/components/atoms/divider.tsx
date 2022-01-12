import React from "react"
import * as Separator from "@radix-ui/react-separator"
import clsx from "clsx"

type DividerProps = Separator.SeparatorProps

const Divider = ({
  className,
  orientation = "horizontal",
  decorative = true,
}: DividerProps) => {
  const defaultClassName = "bg-grey-20"
  const computedClassName = clsx(
    defaultClassName,
    {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    }[orientation],
    className
  )

  return (
    <Separator.Root
      className={computedClassName}
      decorative={decorative}
      orientation={orientation}
    />
  )
}

export default Divider