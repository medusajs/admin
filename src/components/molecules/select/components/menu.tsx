import clsx from "clsx"
import React from "react"
import { components as Primitives, GroupBase, MenuProps } from "react-select"
import Spinner from "../../../atoms/spinner"

export const Menu = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  children,
  ...rest
}: MenuProps<T, IsMulti, GroupType>) => {
  const {
    selectProps: { isLoading },
  } = rest

  return (
    <Primitives.Menu
      {...rest}
      className="bg-grey-0 z-60 rounded-b-rounded border border-grey-20 overflow-hidden shadow-select-menu pointer-events-auto"
    >
      {children}
      {isLoading && (
        <div
          className={clsx("w-full flex items-center justify-center py-base")}
        >
          <span className="sr-only">Loading...</span>
          <Spinner size="small" variant="secondary" />
        </div>
      )}
    </Primitives.Menu>
  )
}
