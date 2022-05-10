import React from "react"
import { GroupBase } from "react-select"
import Async from "./selects/async-select"
import Base from "./selects/select"
import { SelectProps } from "./types"

const Select = <
  Option extends unknown,
  Group extends GroupBase<Option>,
  IsCreateable extends boolean = false,
  IsAsync extends boolean = false,
  IsMulti extends boolean = false
>({
  isAsync,
  ...props
}: SelectProps<Option, IsMulti, Group, IsCreateable, IsAsync>) => {
  const Component = isAsync ? Async : Base

  return <Component {...props} />
}

export default Select
