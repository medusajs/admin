import clsx from "clsx"
import React from "react"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import Actionables, { ActionType } from "../actionables"

type EventContainerProps = {
  icon: React.ReactNode
  iconColor: "grey" | "green" | "orange"
  title: string
  date: Date
  actions?: ActionType[]
  to: string
}

const EventContainer: React.FC<EventContainerProps> = ({
  icon,
  iconColor,
  title,
  actions,
  date,
  to,
  children,
}) => {
  const Trigger = (
    <button className="btn-ghost py-0 px-2xsmall flex justify-center items-center focus:outline-none focus:ring-2 rounded-base focus:ring-violet-40">
      <MoreHorizontalIcon size={20} />
    </button>
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-xsmall">
          <div
            className={clsx("h-5 w-5", {
              ["text-grey-50"]: iconColor === "grey",
              ["text-emerald-40"]: iconColor === "green",
              ["text-orange-40"]: iconColor === "orange",
            })}
          >
            {icon}
          </div>
          <div className="inter-small-semibold">{title}</div>
        </div>
        <div>
          <Actionables actions={actions} customTrigger={Trigger} forceDots />
        </div>
      </div>
      <div className="flex gap-x-xsmall">
        <div className="w-5 flex justify-center">
          <div className="w-px bg-grey-20 h-full mt-base" />
        </div>
        <div className="mt-2xsmall w-full inter-small-regular">
          <div className="flex items-center justify-between">
            <div className="text-grey-50">{date.toUTCString()}</div>
            {to && (
              <div className="flex items-center">
                <div className="text-grey-40 mr-2xsmall">
                  <ArrowRightIcon size={16} />
                </div>
                <span>{to}</span>
              </div>
            )}
          </div>
          {children && <div className="mt-small w-full">{children}</div>}
        </div>
      </div>
    </div>
  )
}

export default EventContainer
