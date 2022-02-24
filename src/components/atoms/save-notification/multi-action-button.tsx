import * as Dropdown from "@radix-ui/react-dropdown-menu"
import React, { ButtonHTMLAttributes } from "react"
import { toast as global } from "react-hot-toast"
import { ButtonAction } from "."
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import ErrorState from "./error-state"
import SavingState from "./saving-state"
import SuccessState from "./success-state"

type MultiActionButtonProps = {
  originalId: string
  label: string
  onClick: ButtonAction[] | (() => Promise<void>)
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">

const MultiActionButton: React.FC<MultiActionButtonProps> = ({
  originalId,
  label,
  onClick,
  className,
  ...props
}) => {
  const wrapAction = (action: () => Promise<void>) => {
    global.custom((t) => <SavingState toast={t} />, {
      id: originalId,
    })

    console.log(action)

    action()
      .then(() => {
        global.custom((t) => <SuccessState toast={t} />, {
          duration: 3000,
          position: "bottom-right",
          id: originalId,
        })
      })
      .catch((_err) => {
        global.custom((t) => <ErrorState toast={t} />, {
          duration: 3000,
          position: "bottom-right",
          id: originalId,
        })
      })
  }

  if (Array.isArray(onClick)) {
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
          {onClick.map((action, i) => {
            return (
              <Dropdown.Item key={i}>
                <button
                  onClick={() => wrapAction(action.onClick)}
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
    <button
      onClick={() => wrapAction(onClick as () => Promise<void>)}
      className={className}
      {...props}
    >
      {label}
    </button>
  )
}

export default MultiActionButton
