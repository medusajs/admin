import clsx from "clsx"
import React from "react"
import { GroupBase, MenuProps, OnChangeValue } from "react-select"
import Spinner from "../../../atoms/spinner"
import { useSelectContext } from "../context"

export const Menu = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerProps,
  innerRef,
  selectProps: { isLoading, options, value, onChange, onMenuClose },
  children,
}: MenuProps<T, IsMulti, GroupType>) => {
  const { hasSelectAll } = useSelectContext()

  const allSelected = (value as T[])?.length === options.length

  const handleSelectAll = () => {
    onChange(options as OnChangeValue<T, IsMulti>, {
      action: "select-option",
      option: options as any,
    })
    onMenuClose()
  }

  return (
    <div
      {...innerProps}
      ref={innerRef}
      className="bg-grey-0 z-60 rounded-b-rounded border border-grey-20 overflow-hidden shadow-select-menu"
    >
      {hasSelectAll && !allSelected && (
        <SelectAll handleClick={handleSelectAll} />
      )}
      {children}
      {isLoading && (
        <div
          className={clsx("w-full flex items-center justify-center py-base")}
        >
          <span className="sr-only">Loading...</span>
          <Spinner size="small" variant="secondary" />
        </div>
      )}
    </div>
  )
}

const SelectAll = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div className="mt-2 py-0 pl-2 pr-3 bg-grey-0 active:bg-grey-0">
      <button
        className="item-renderer h-full hover:bg-grey-10 py-2 px-2 cursor-pointer rounded focus:bg-grey-10 w-full text-left"
        onClick={handleClick}
        tabIndex={1}
      >
        <span className="sr-only">Select All</span>
        <span className="text-grey-90 inter-base-regular">Select All</span>
      </button>
    </div>
  )
}
