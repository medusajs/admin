import clsx from "clsx"
import React from "react"
import {
  ContainerProps,
  GroupBase,
  IndicatorsContainerProps,
  ValueContainerProps,
} from "react-select"

type AdjacentContainerProps = {
  label?: string
  helperText?: string
  required?: boolean
  name?: string
  errors?: Record<string, unknown>
  children?: React.ReactNode
}

export const AdjacentContainer = ({
  label,
  helperText,
  required,
  children,
}: AdjacentContainerProps) => {
  return (
    <div className="flex flex-col gap-y-xsmall w-full">
      {label && (
        <label className="inter-small-semibold text-grey-50">
          {label}
          {required && <span className="text-rose-50">*</span>}
        </label>
      )}
      {children}
      {helperText && (
        <p className="inter-small-regular text-grey-50">{helperText}</p>
      )}
    </div>
  )
}

export const SelectContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  selectProps: { isDisabled, isRtl },
  hasValue,
  cx,
  className,
  children,
}: ContainerProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          "--is-disabled": isDisabled,
          "--is-rtl": isRtl,
          "--has-value": hasValue,
        },
        clsx("relative pointer-events-auto", className)
      )}
    >
      {children}
    </div>
  )
}

export const ValueContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  children,
  cx,
  innerProps,
  isMulti,
  hasValue,
}: ValueContainerProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          "value-container": true,
          "value-container--is-multi": isMulti,
          "value-container--has-value": hasValue,
        },
        clsx(
          "flex items-center flex-wrap relative scrolling-touch overflow-hidden flex-1",
          {
            "gap-2xsmall": isMulti,
          },
          className
        )
      )}
    >
      {children}
    </div>
  )
}

export const IndicatorsContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  cx,
  ...props
}: IndicatorsContainerProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...props}
      className={cx(
        {
          "indicators-container": true,
        },
        clsx("text-grey-50 flex items-center gap-x-small px-small", className)
      )}
    />
  )
}
