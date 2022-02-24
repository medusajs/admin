import * as Dropdown from "@radix-ui/react-dropdown-menu"
import React, { ButtonHTMLAttributes } from "react"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import {
  MultiHandler,
  SaveHandler,
} from "../../organisms/save-notifications/notification-provider"

type MultiActionButtonProps = {
  originalId: string
  label: string
  handler:
    | MultiHandler[]
    | {
        onSubmit: SaveHandler
      }
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">

const MultiActionButton: React.FC<MultiActionButtonProps> = ({
  originalId,
  label,
  handler,
  className,
  ...props
}) => {
  if (Array.isArray(handler)) {
    return (
      <Dropdown.Root>
        <Dropdown.Trigger className={className}>
          <button {...props} className="inter-small-semibold flex items-center">
            {label}
            <ChevronDownIcon size={16} className="ml-[2px]" />
          </button>
        </Dropdown.Trigger>

        <Dropdown.Content
          className="rounded-rounded bg-grey-0 border border-grey-20 p-xsmall flex flex-col min-w-[208px]"
          sideOffset={5}
        >
          {handler.map((action, i) => {
            return (
              <Dropdown.Item key={i}>
                <button
                  onClick={(e) => action.onSubmit(e)}
                  className="p-[6px] hover:bg-grey-5 inter-small-semibold rounded-base text-left flex items-center w-full"
                >
                  {action.icon && (
                    <span className="text-grey-50 mr-xsmall">
                      {React.cloneElement(action.icon, { size: 20 })}
                    </span>
                  )}
                  {action.label}
                </button>
              </Dropdown.Item>
            )
          })}
        </Dropdown.Content>
      </Dropdown.Root>
    )
  }

  return (
    <button onClick={handler.onSubmit} className={className} {...props}>
      {label}
    </button>
  )
}

export default MultiActionButton
