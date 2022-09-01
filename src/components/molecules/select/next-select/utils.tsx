import React from "react"
import Highlighter from "react-highlight-words"
import type {
  CommonPropsAndClassName,
  FormatOptionLabelMeta,
  GroupBase,
} from "react-select"

export const cleanCommonProps = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
  AdditionalProps
>(
  props: Partial<CommonPropsAndClassName<Option, IsMulti, Group>> &
    AdditionalProps
): Omit<
  AdditionalProps,
  keyof CommonPropsAndClassName<Option, IsMulti, Group>
> => {
  const {
    className,
    clearValue,
    cx,
    getStyles,
    getValue,
    hasValue,
    isMulti,
    isRtl,
    options,
    selectOption,
    selectProps,
    setValue,
    theme,
    ...innerProps
  } = props
  return { ...innerProps }
}

export const optionIsFixed = (
  option: unknown
): option is { isFixed: unknown } =>
  typeof option === "object" && option !== null && "isFixed" in option

export const optionIsDisabled = (
  option: unknown
): option is { isDisabled: boolean } =>
  typeof option === "object" && option !== null && "isDisabled" in option

export const hasLabel = (option: unknown): option is { label: string } => {
  return typeof option === "object" && option !== null && "label" in option
}

export const formatOptionLabel = <Option,>(
  option: Option,
  { inputValue }: FormatOptionLabelMeta<Option>
) => {
  if (!hasLabel(option)) {
    return option
  }

  return (
    <Highlighter
      searchWords={[inputValue]}
      textToHighlight={option.label}
      highlightClassName="bg-orange-10"
    />
  )
}
