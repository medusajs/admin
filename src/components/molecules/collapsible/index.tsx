import clsx from "clsx"
import React, { useState } from "react"
import Button from "../../fundamentals/button"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ArrowUpIcon from "../../fundamentals/icons/arrow-up-icon"

type TriggerProps = React.HTMLAttributes<HTMLDivElement>

type CollapsibleProps = {
  defaultState?: boolean
  triggerProps?: TriggerProps
}

const Collapsible: React.FC<CollapsibleProps> = ({
  defaultState = false,
  triggerProps,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultState)

  const Icon = expanded ? ArrowUpIcon : ArrowDownIcon
  const label = expanded ? "Hide additional details" : "Show additional details"

  return (
    <div>
      <div>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setExpanded(!expanded)}
          className={clsx(triggerProps?.className, "py-[6px] px-3", {
            ["mb-base"]: expanded,
          })}
        >
          <div className="flex items-center gap-x-1">
            <Icon size={"20"} />
            <div>{label}</div>
          </div>
        </Button>
      </div>
      <div className={clsx({ ["hidden"]: !expanded })}>{children}</div>
    </div>
  )
}

export default Collapsible
