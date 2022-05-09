import React from "react"
import { GroupBase, MultiValueGenericProps } from "react-select"

export const MultiValueLabel = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerProps,
  children,
}: MultiValueGenericProps<T, IsMulti, GroupType>) => {
  return (
    <div {...innerProps} className="inter-base-regular">
      {children}
    </div>
  )
}
