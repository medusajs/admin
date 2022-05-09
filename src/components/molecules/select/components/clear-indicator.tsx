import React from "react"
import { ClearIndicatorProps, GroupBase } from "react-select"
import XCircleIcon from "../../../fundamentals/icons/x-circle-icon"

export const ClearIndicator = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerProps,
}: ClearIndicatorProps<T, IsMulti, GroupType>) => {
  return (
    <div
      {...innerProps}
      className="group text-grey-40 h-full flex flex-col items-center justify-end"
    >
      <button>
        <span className="sr-only">Clear values</span>
        <XCircleIcon size={20} />
      </button>
    </div>
  )
}
