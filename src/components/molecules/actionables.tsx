import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import React from "react"
import Button from "../fundamentals/button"
import MoreHorizontalIcon from "../fundamentals/icons/more-horizontal-icon"

export type ActionType = {
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: "normal" | "danger"
  icon?: React.ReactNode
}

type ActionablesProps = {
  actions?: ActionType[]
  customTrigger?: React.ReactNode
  forceDropdown?: boolean
}

const Actionables: React.FC<ActionablesProps> = ({
  actions,
  customTrigger,
  forceDropdown = false,
}) => {
  if (!actions?.length && !customTrigger) {
    return null
  }

  return actions?.length > 1 || forceDropdown ? (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          {!customTrigger ? (
            <Button
              variant="ghost"
              size="small"
              className="w-xlarge h-xlarge focus-visible:outline-none focus-visible:shadow-input focus-visible:border-violet-60 focus:shadow-none"
            >
              <MoreHorizontalIcon size={20} />
            </Button>
          ) : (
            customTrigger
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          {actions.map((action, i) => {
            return (
              <DropdownMenu.Item className="mb-1 last:mb-0" key={i}>
                {
                  <Button
                    variant="ghost"
                    size="small"
                    className={clsx("w-full justify-start", {
                      "text-rose-50": action?.variant === "danger",
                    })}
                    onClick={action?.onClick}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                }
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  ) : (
    <div>
      {customTrigger ? (
        <div>{customTrigger}</div>
      ) : (
        <Button variant="ghost" size="small" onClick={actions[0].onClick}>
          {actions[0].icon}
          {actions[0].label}
        </Button>
      )}
    </div>
  )
}

export default Actionables
