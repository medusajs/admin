import React, {
  forwardRef,
  MutableRefObject,
  ReactElement,
  RefAttributes,
  useContext,
} from "react"
import type { GroupBase, Props, SelectInstance } from "react-select"
import ReactSelect from "react-select"
import { ModalContext } from "../../../modal"
import { useSelectProps } from "../use-select-props"

export type SelectComponent = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>
) => ReactElement

const Select = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: Props<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null
  ) => {
    const customProps = useSelectProps(props)
    const { portalRef } = useContext(ModalContext)

    return (
      <ReactSelect
        ref={ref}
        {...customProps}
        menuPortalTarget={portalRef?.current?.lastChild || null}
      />
    )
  }
) as SelectComponent

export default Select
