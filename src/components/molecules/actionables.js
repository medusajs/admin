import PropTypes from "prop-types"
import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/dropdown"
import MoreHorizontalIcon from "../fundamentals/icons/more-horizontal-icon"

const Actionables = ({ actions }) => {
  if (typeof actions === "undefined" || actions.length === 0) {
    return null
  }

  return actions.length > 1 ? (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="btn-ghost-medium">
            <MoreHorizontalIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          {actions.map((action, i) => {
            return (
              <DropdownMenuItem key={i}>
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
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <button className="btn-ghost-small" onClick={action.onClick}>
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
