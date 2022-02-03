import React from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import clsx from "clsx"

type TooltipProps = RadixTooltip.TooltipContentProps &
  Pick<
    RadixTooltip.TooltipProps,
    "open" | "defaultOpen" | "onOpenChange" | "delayDuration"
  > & {
    content: string
    side?: "bottom" | "left" | "top" | "right"
  }

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  className,
  side,
  ...props
}: TooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={100}>
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
      >
        <RadixTooltip.Trigger>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Content
          side={side ?? "bottom"}
          sideOffset={8}
          align="center"
          className={clsx(
            "inter-small-semibold text-grey-50",
            "bg-grey-5 py-[6px] px-[12px] shadow-dropdown rounded",
            "border border-solid border-grey-20",
            "max-w-[220px]",
            className
          )}
          {...props}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export default Tooltip
