import React from "react"
import {
  components as Primitives,
  GroupBase,
  IndicatorsContainerProps,
} from "react-select"

export const IndicatorsContainer = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  children,
  ...props
}: IndicatorsContainerProps<T, IsMulti, GroupType>) => {
  const DropdownIndicator = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      typeof child.type !== "string" &&
      child.type.name === "DropdownIndicator"
    ) {
      return child
    }

    return null
  })

  const ClearIndicator = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      typeof child.type !== "string" &&
      child.type.name === "ClearIndicator"
    ) {
      return child
    }

    return null
  })

  const {
    getValue,
    selectProps: { isSearchable, menuIsOpen },
  } = props

  const hasValues = getValue()?.length > 0

  if (menuIsOpen && isSearchable) {
    return null
  }

  return (
    <Primitives.IndicatorsContainer
      {...props}
      className="flex flex-col items-center justify-between w-5"
    >
      {DropdownIndicator}
      {hasValues && ClearIndicator}
    </Primitives.IndicatorsContainer>
  )
}
