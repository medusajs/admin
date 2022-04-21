import { DropdownIndicatorProps, GroupBase } from "react-select"
import ArrowDownIcon from "../../../fundamentals/icons/arrow-down-icon"

export const DropdownIndicator = <
  T,
  IsMulti extends boolean,
  GroupType extends GroupBase<T>
>({
  innerProps,
  selectProps: { menuIsOpen },
}: DropdownIndicatorProps<T, IsMulti, GroupType>) => {
  return (
    <div
      {...innerProps}
      className="text-grey-50 h-full flex flex-col items-center justify-between"
    >
      <button>
        <ScreenReaderMessage isMenuOpen={menuIsOpen} />
        <ArrowDownIcon size={16} />
      </button>
    </div>
  )
}

const ScreenReaderMessage = ({ isMenuOpen = false }) => {
  return (
    <span className="sr-only">
      {isMenuOpen ? "Close" : "Open"} select dropdown
    </span>
  )
}
