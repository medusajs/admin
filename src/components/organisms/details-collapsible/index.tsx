import * as RadixCollapsible from "@radix-ui/react-collapsible"
import clsx from "clsx"
import React, { useState } from "react"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ArrowUpIcon from "../../fundamentals/icons/arrow-up-icon"

const DetailsCollapsible = ({ children }) => {
  const [open, setOpen] = useState(false)

  const Icon = open ? ArrowUpIcon : ArrowDownIcon
  const label = open ? "Hide additional details" : "Show additional details"

  return (
    <RadixCollapsible.Root onOpenChange={(state) => setOpen(state)}>
      <RadixCollapsible.Trigger
        className={clsx("ml-4", { ["mb-6"]: open })}
        type="button"
      >
        <div className="flex items-center">
          <Icon size={"20"} />
          <div className="ml-1">{label}</div>
        </div>
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content>{children}</RadixCollapsible.Content>
    </RadixCollapsible.Root>
  )
}

export default DetailsCollapsible
