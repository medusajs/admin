import clsx from "clsx"
import React from "react"
import { GroupBase, OptionProps } from "react-select"
import CheckIcon from "../../../fundamentals/icons/check-icon"

export const Option = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerRef,
  innerProps,
  isMulti,
  isSelected,
  isFocused,
  children,
}: OptionProps<T, IsMulti, GroupType>) => {
  return (
    <div
      {...innerProps}
      ref={innerRef}
      className="my-1 py-0 px-2 bg-grey-0 active:bg-grey-0"
    >
      <div
        className={clsx(
          `item-renderer h-full hover:bg-grey-10 py-2 px-2 cursor-pointer rounded`,
          {
            "bg-grey-10": isFocused,
          }
        )}
      >
        <div className="items-center h-full flex overflow-hidden gap-x-3 pl-1">
          <Adornment isMulti={isMulti} isSelected={isSelected} />
          <span className="text-grey-90 inter-base-regular truncate">
            {children}
          </span>
        </div>
      </div>
    </div>
  )
}

const CheckboxAdornment = ({ isSelected }) => {
  return (
    <div
      className={clsx(
        `min-w-[20px] h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base`,
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

const RadioAdornment = ({ isSelected }) => {
  return (
    <div
      className={clsx(
        "radio-outer-ring outline-0",
        "shrink-0 min-w-[20px] h-5 rounded-circle",
        {
          "shadow-[0_0_0_1px] shadow-grey-30": !isSelected,
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

const Adornment = ({ isSelected = false, isMulti = false }) => {
  return isMulti ? (
    <CheckboxAdornment isSelected={isSelected} />
  ) : (
    <RadioAdornment isSelected={isSelected} />
  )
}
