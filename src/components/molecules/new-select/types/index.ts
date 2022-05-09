import React from "react"
import { ActionMeta, GroupBase } from "react-select"
import { LoadOptions } from "react-select-async-paginate"

export type SelectOption = {
  label: string
  value: string
}

interface BaseProps {
  value?: SelectOption | SelectOption[]
  isDisabled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  onChange: (newValue: unknown, actionMeta: ActionMeta<unknown>) => void
  menuPortalTarget?: HTMLElement | null
  placeholder?: string
  searchPlaceholder?: string
  label: string
  required?: boolean
  tooltip?: string | React.ReactElement
}

type MultiProps =
  | ({
      isMulti: true
      hasSelectAll?: boolean
    } & BaseProps)
  | ({
      isMulti?: false
      hasSelectAll?: never
    } & BaseProps)

// If the Select is createable then the onCreateOption prop is required,
// if it's not createable then the onCreateOtion prop should be undefined
type CreateAbleProps =
  | ({
      isCreateable: true
      onCreateOption: (value: string) => void
    } & MultiProps)
  | ({
      isCreateable?: false
      onCreateOption?: never
    } & MultiProps)

export type SelectProps = CreateAbleProps & {
  options?: SelectOption[]
}

export type AsyncSelectProps = CreateAbleProps & {
  loadOptions: LoadOptions<unknown, GroupBase<unknown>, unknown>
}

export type SelectContextProps = {
  label: string
  required?: boolean
  tooltip?: string | React.ReactElement
  hasSelectAll?: boolean
  searchPlaceholder?: string
} | null

export type SelectProviderProps = {
  context: SelectContextProps
}
