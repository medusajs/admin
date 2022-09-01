import { GroupBase, Props } from "react-select"
import Components from "./components"
import { formatOptionLabel } from "./utils"

export const useSelectProps = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  components = {},
  isMulti,
  closeMenuOnScroll = true,
  hideSelectedOptions = false,
  closeMenuOnSelect,
  label,
  size,
  ...props
}: Props<Option, IsMulti, Group>): Props<Option, IsMulti, Group> => {
  return {
    label,
    components: Components,
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 60 }),
    },
    isMulti,
    closeMenuOnScroll: true,
    closeMenuOnSelect:
      closeMenuOnSelect !== undefined ? closeMenuOnSelect : isMulti !== true,
    hideSelectedOptions,
    menuPosition: "fixed",
    maxMenuHeight: size === "sm" ? 154 : 188,
    formatOptionLabel,
    size,
    ...props,
  }
}
