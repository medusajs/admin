import React from "react"
import { ActionMeta, GroupBase, PropsValue } from "react-select"
import { LoadOptions } from "react-select-async-paginate"

export interface SelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
  IsCreateable extends boolean,
  IsAsync extends boolean
> {
  value?: PropsValue<Option>
  options: readonly (Option | Group)[]
  isMulti?: IsMulti
  isAsync?: IsAsync
  loadOptions?: IsAsync extends true
    ? LoadOptions<Option, Group, undefined>
    : never
  isDisabled?: boolean
  isClearable?: boolean
  isCreateable?: IsCreateable
  onCreateOption?: (value: string) => void
  isSearchable?: boolean
  hasSelectAll?: IsMulti extends true ? boolean : undefined
  onChange: (newValue: Option, actionMeta: ActionMeta<Option>) => void
  placeholder?: string
  searchPlaceholder?: string
  label: string
  required?: boolean
  tooltip?: string | React.ReactElement
  id?: string
  className?: React.InputHTMLAttributes<HTMLInputElement>["className"]
}

export type SelectOption = {
  label: string
  value?: unknown | null
}

export type SelectContextProps = {
  label: string
  required?: boolean
  tooltip?: string | React.ReactElement
  hasSelectAll?: boolean
  searchPlaceholder?: string
  className?: React.InputHTMLAttributes<HTMLInputElement>["className"]
} | null

export type SelectProviderProps = {
  context: SelectContextProps
}
