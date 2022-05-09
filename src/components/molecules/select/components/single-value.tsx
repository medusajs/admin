import React from "react"
import {
  components as Primitives,
  GroupBase,
  SingleValueProps,
} from "react-select"

export const SingleValue = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>(
  props: SingleValueProps<T, IsMulti, GroupType>
) => {
  const {
    selectProps: { menuIsOpen, isSearchable },
  } = props

  if (menuIsOpen && isSearchable) {
    return null
  }

  return <Primitives.SingleValue {...props} />
}
