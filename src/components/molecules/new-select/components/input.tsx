import React from "react"
import { components as Primitives, GroupBase, InputProps } from "react-select"
import SearchIcon from "../../../fundamentals/icons/search-icon"
import { useSelectContext } from "../context"

export const Input = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>(
  props: InputProps<T, IsMulti, GroupType>
) => {
  const { searchPlaceholder } = useSelectContext()
  const {
    isHidden,
    value,
    selectProps: { isSearchable, menuIsOpen },
  } = props

  if (isHidden || !menuIsOpen || !isSearchable) {
    return <Primitives.Input {...props} className="py-2xsmall" />
  }

  return (
    <div className="w-full flex items-center">
      <SearchIcon size={20} className="text-grey-40 mr-2" />
      <div className="relative">
        <Primitives.Input {...props} className="py-2xsmall" />
        {!value && (
          <span
            className="absolute left-0 inter-base-regular text-grey-40"
            role="tooltip"
          >
            {searchPlaceholder || "Search..."}
          </span>
        )}
      </div>
    </div>
  )
}
