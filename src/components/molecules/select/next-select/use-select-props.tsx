import type { GroupBase, Props } from "react-select"
import Components from "./components"

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
  ...props
}: Props<Option, IsMulti, Group>): Props<Option, IsMulti, Group> => {
  return {
    label,
    components: Components,
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 60 }),
    },
    isMulti,
    closeMenuOnScroll,
    menuPosition: "fixed",
    closeMenuOnSelect:
      closeMenuOnSelect !== undefined ? closeMenuOnSelect : isMulti !== true,
    hideSelectedOptions,
    ...props,
  }
}
