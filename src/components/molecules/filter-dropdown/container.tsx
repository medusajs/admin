import React, { ReactNode, useState } from "react"
import * as RadixPopover from "@radix-ui/react-popover"

import Button from "../../fundamentals/button"

type FilterDropdownContainerProps = {
  submitFilters: () => void
  clearFilters: () => void
  triggerElement: ReactNode
}

const FilterDropdownContainer: React.FC<FilterDropdownContainerProps> = ({
  submitFilters,
  clearFilters,
  triggerElement,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const onSubmit = () => {
    setIsOpen(false)
    submitFilters()
  }

  const onClear = () => {
    setIsOpen(false)
    clearFilters()
  }

  return (
    <RadixPopover.Root open={true} onOpenChange={setIsOpen}>
      <RadixPopover.Trigger asChild>{triggerElement}</RadixPopover.Trigger>
      <RadixPopover.Content
        sideOffset={8}
        className="bg-grey-0 rounded-rounded shadow-dropdown w-full py-4"
      >
        <div className="flex px-4 pb-4 border-b border-grey-20">
          <Button
            size="small"
            tabIndex={-1}
            className="mr-2 border border-grey-20"
            variant="ghost"
            onClick={() => onClear()}
          >
            Clear
          </Button>
          <Button
            tabIndex={-1}
            variant="primary"
            className="w-44 justify-center"
            size="small"
            onClick={() => onSubmit()}
          >
            Apply
          </Button>
        </div>
        {React.Children.map(children, (child) => {
          return (
            <div className="border-b border-grey-20 py-2 px-4 last:pb-0 last:border-0">
              {child}
            </div>
          )
        })}
      </RadixPopover.Content>
    </RadixPopover.Root>
  )
}

export default FilterDropdownContainer
