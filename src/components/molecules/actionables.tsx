import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import PropTypes from "prop-types"
import React from "react"
import Button from "../fundamentals/button"
import MoreHorizontalIcon from "../fundamentals/icons/more-horizontal-icon"

type ActionType = {}

type ActionablesProps = {
  actions: ActionType[]
}

/**
 * A component that accepts multiple actionables and renders them as a dropdown menu.
 * If only a single actionable is provided, it will render a button instead.
 */
const Actionables: React.FC<ActionablesProps> = ({ actions }) => {
  if (actions.length === 0) {
    return null
  }

  return actions.length > 1 ? (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="medium">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          {actions.map((action, i) => {
            return (
              <DropdownMenu.Item key={i}>
                {
                  <button
                    className={`btn-ghost-small w-full ${
                      action.style === "danger" ? "text-rose-50" : ""
                    }`}
                    onClick={action.onClick}
                  >
                    {action.icon && (
                      <span className="mr-xsmall">{action.icon}</span>
                    )}
                    {action.text}
                  </button>
                }
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  ) : (
    <button className="btn-ghost-small" onClick={actions[0].onClick}>
      {actions[0].icon && <span className="mr-xsmall">{actions[0].icon}</span>}
      {actions[0].text}
    </button>
  )
}

Actionables.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      text: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.string,
    })
  ),
}

export default Actionables
