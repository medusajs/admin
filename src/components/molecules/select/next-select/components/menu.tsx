import clsx from "clsx"
import React from "react"
import {
  GroupBase,
  GroupHeadingProps,
  GroupProps,
  MenuListProps,
  MenuProps,
  NoticeProps,
  OptionProps,
} from "react-select"
import CheckIcon from "../../../../fundamentals/icons/check-icon"

const Menu = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  cx,
  children,
  innerProps,
  innerRef,
  placement,
}: MenuProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      ref={innerRef}
      className={cx(
        { menu: true },
        clsx(
          "absolute w-full overflow-hidden border-border z-[60] bg-grey-0 rounded-rounded border border-grey-20 shadow-dropdown mb-base",
          {
            "top-[calc(100%+8px)]": placement === "bottom",
            "bottom-[calc(100%+8px)]": placement === "top",
          },
          className
        )
      )}
    >
      {children}
    </div>
  )
}

export default Menu

export const MenuList = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  children,
  cx,
  innerRef,
  innerProps,
  maxHeight,
  isMulti,
}: MenuListProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      ref={innerRef}
      className={cx(
        {
          "menu-list": true,
          "menu-list--is-multi": isMulti,
        },
        clsx("overflow-y-auto flex flex-col", className)
      )}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {children}
    </div>
  )
}

export const LoadingMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  cx,
  className,
  selectProps: { size },
}: NoticeProps<Option, IsMulti, Group>) => {
  const Skeleton = () => {
    return (
      <div
        className={clsx(
          "w-full flex items-center px-base transition-colors hover:bg-grey-5",
          {
            "h-xlarge": size === "sm",
            "h-10": size === "md" || !size,
          }
        )}
      >
        <div className="bg-grey-10 animate-pulse w-1/4 h-xsmall rounded-rounded" />
      </div>
    )
  }

  return (
    <div
      {...innerProps}
      className={cx(
        {
          "menu-notice": true,
          "menu-notice--loading": true,
        },
        clsx("flex flex-col", className)
      )}
    >
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  )
}

const NoOptionsMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({}: NoticeProps<Option, IsMulti, Group>) => {}

const Group = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({}: GroupProps<Option, IsMulti, Group>) => {}

const GroupHeading = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({}: GroupHeadingProps<Option, IsMulti, Group>) => {}

export const Option = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  isSelected,
  isDisabled,
  isFocused,
  children,
  cx,
  className,
  innerProps,
  innerRef,
  selectProps: { hideSelectedOptions, isMulti, size },
}: OptionProps<Option, IsMulti, Group>) => {
  return (
    <div
      role="button"
      className={cx(
        {
          option: true,
          "option--is-selected": isSelected,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
        },
        clsx(
          "flex items-center justify-between py-xsmall px-base transition-colors",
          {
            "hover:bg-grey-10": !isDisabled,
            "bg-grey-5 text-grey-50 cursor-default select-none": isDisabled,
            "bg-grey-10": isFocused && !isDisabled,
            hidden: hideSelectedOptions && isSelected,
          },
          {
            "h-xlarge": size === "sm",
            "h-10": size === "md" || !size,
          },
          className
        )
      )}
      ref={innerRef}
      data-diabled={isDisabled ? true : undefined}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={isDisabled ? -1 : 0}
      {...innerProps}
    >
      <div className="flex items-center gap-x-small">
        {isMulti && <CheckboxAdornment isSelected={isSelected} />}
        {children}
      </div>
      {!isMulti && isSelected && <CheckIcon size={16} />}
    </div>
  )
}

const CheckboxAdornment = ({ isSelected }: Pick<OptionProps, "isSelected">) => {
  return (
    <div
      className={clsx(
        `w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base`,
        {
          "bg-violet-60": isSelected,
        }
      )}
    >
      <span className="self-center">
        {isSelected && <CheckIcon size={16} />}
      </span>
    </div>
  )
}
