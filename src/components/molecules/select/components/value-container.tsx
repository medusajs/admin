import React from "react"
import {
  components as Primitives,
  GroupBase,
  ValueContainerProps,
} from "react-select"
import IconTooltip from "../../icon-tooltip"
import { useSelectContext } from "../context"

export const ValueContainer = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  children,
  ...props
}: ValueContainerProps<T, IsMulti, GroupType>) => {
  const {
    selectProps: { menuIsOpen, isSearchable },
  } = props

  const { label, required, tooltip } = useSelectContext()

  return (
    <div className="flex flex-col flex-1 inter-base-regular overflow-hidden">
      {menuIsOpen && isSearchable ? null : (
        <div className="w-full flex inter-small-semibold text-grey-50 items-center gap-x-1">
          <div className="flex items-center">
            <label>{label}</label>
            {required && <div className="text-rose-50">*</div>}
          </div>
          {tooltip && <IconTooltip content={tooltip} />}
        </div>
      )}
      <Primitives.ValueContainer
        {...props}
        className="flex-1 px-0 flex items-center flex-nowrap overflow-hidden truncate"
      >
        {children}
      </Primitives.ValueContainer>
    </div>
  )
}
