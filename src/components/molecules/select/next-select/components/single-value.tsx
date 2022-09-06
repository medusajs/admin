import clsx from "clsx"
import React from "react"
import { GroupBase, SingleValueProps } from "react-select"

const SingleValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  children,
  cx,
  className,
  isDisabled,
}: SingleValueProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          "single-value": true,
          "single-value--is-disabled": isDisabled,
        },
        clsx(
          "overflow-hidden absolute top-1/2 -translate-y-1/2 whitespace-nowrap overflow-ellipsis",
          className
        )
      )}
    >
      {children}
    </div>
  )
}

export default SingleValue
