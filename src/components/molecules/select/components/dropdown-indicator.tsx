import React from "react"
import { DropdownIndicatorProps, GroupBase } from "react-select"
import ArrowDownIcon from "../../../fundamentals/icons/arrow-down-icon"

export const DropdownIndicator = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerProps,
  selectProps: { menuIsOpen, name },
}: DropdownIndicatorProps<T, IsMulti, GroupType>) => {
  return (
    <div
      {...innerProps}
      className="text-grey-50 h-full flex flex-col items-center justify-between"
    >
      <button>
        <span className="sr-only">
          {menuIsOpen ? "Close" : "Open"} {name} dropdown
        </span>
        <ArrowDownIcon size={16} />
      </button>
    </div>
  )
}
