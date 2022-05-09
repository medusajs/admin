import clsx from "clsx"
import React from "react"
import { GroupBase, MultiValueProps } from "react-select"

export const MultiValue = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerProps,
  data,
  selectProps: { value, isSearchable, menuIsOpen },
  children,
}: MultiValueProps<T, IsMulti, GroupType>) => {
  const isLast = Array.isArray(value) ? value[value.length - 1] === data : true

  if (menuIsOpen && isSearchable) {
    return null
  }

  return (
    <div
      {...innerProps}
      className={clsx({
        "after:content-[','] mr-1": !isLast,
      })}
    >
      {children}
    </div>
  )
}
