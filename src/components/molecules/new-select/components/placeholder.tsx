import React from "react"
import {
  components as Primitives,
  GroupBase,
  PlaceholderProps,
} from "react-select"

export const Placeholder = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>(
  props: PlaceholderProps<T, IsMulti, GroupType>
) => {
  const {
    selectProps: { isSearchable, menuIsOpen },
  } = props

  if (menuIsOpen && isSearchable) {
    return null
  }

  return <Primitives.Placeholder {...props} className="mr-2" />
}
