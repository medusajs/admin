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
          "absolute w-full overflow-hidden border-border z-[60] bg-grey-0 rounded-rounded border border-grey-20 shadow-dropdown p-xsmall mb-base",
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
        clsx("overflow-y-auto flex flex-col gap-y-2xsmall", className)
      )}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {children}
    </div>
  )
}

const LoadingMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({}: NoticeProps<Option, IsMulti, Group>) => {}

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
  selectProps: { hideSelectedOptions, isMulti },
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
          "flex items-center p-xsmall transition-colors rounded-rounded",
          {
            "hover:bg-grey-10": !isDisabled,
            "bg-grey-5 text-grey-50 cursor-default select-none": isDisabled,
            "bg-grey-10": isFocused && !isDisabled,
            hidden: hideSelectedOptions && isSelected,
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
      <span className="mr-small">
        {isMulti ? (
          <CheckboxAdornment isSelected={isSelected} />
        ) : (
          <RadioAdornment isSelected={isSelected} />
        )}
      </span>
      {children}
    </div>
  )
}

type AdornmentProps = {
  isSelected: boolean
}

const CheckboxAdornment = ({ isSelected }: AdornmentProps) => {
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

const RadioAdornment = ({ isSelected }: AdornmentProps) => {
  return (
    <div
      className={clsx(
        "radio-outer-ring outline-0",
        "shrink-0 w-[20px] h-[20px] rounded-circle",
        {
          "shadow-[0_0_0_1px] shadow-[#D1D5DB]": !isSelected,
          "shadow-[0_0_0_2px] shadow-violet-60": isSelected,
        }
      )}
    >
      {isSelected && (
        <div
          className={clsx(
            "group flex items-center justify-center w-full h-full relative",
            "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
          )}
        />
      )}
    </div>
  )
}
