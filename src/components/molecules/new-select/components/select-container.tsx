import clsx from "clsx"
import React from "react"
import {
  components as Primitives,
  ContainerProps,
  GroupBase,
} from "react-select"

export const SelectContainer = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>(
  props: ContainerProps<T, IsMulti, GroupType>
) => {
  return (
    <Primitives.SelectContainer
      {...props}
      className={clsx({
        "opacity-60": props.isDisabled,
      })}
    />
  )
}
