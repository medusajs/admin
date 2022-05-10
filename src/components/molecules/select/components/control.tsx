import clsx from "clsx"
import React from "react"
import { ControlProps, GroupBase } from "react-select"
import { useSelectContext } from "../context"

export const Control = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  children,
  innerProps,
  selectProps: { menuIsOpen },
  innerRef,
}: ControlProps<T, IsMulti, GroupType>) => {
  const { className } = useSelectContext()

  return (
    <div
      {...innerProps}
      ref={innerRef}
      className={clsx(
        "bg-grey-5 inter-base-regular w-full p-3 cursor-text border flex border-grey-20 focus-within:shadow-input focus-within:border-violet-60 rounded-rounded",
        {
          "bg-white focus-within:shadow-dropdown focus-within:border-grey-20 rounded-b-none border-b-0": menuIsOpen,
        },
        className
      )}
    >
      {children}
    </div>
  )
}
