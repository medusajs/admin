import clsx from "clsx"
import React from "react"
import Tooltip from "../../atoms/tooltip"
import BellOffIcon from "../../fundamentals/icons/bell-off-icon"

export enum EventIconColor {
  GREEN = "text-emerald-40",
  RED = "text-rose-50",
  ORANGE = "text-orange-40",
  DEFAULT = "text-grey-50",
}

type EventContainerProps = {
  icon: React.ReactNode
  iconColor?: EventIconColor
  title: string
  time: Date
  noNotification?: boolean
  topNode?: React.ReactNode
  midNode?: React.ReactNode
  isFirst?: boolean
}

const EventContainer: React.FC<EventContainerProps> = ({
  icon,
  iconColor = EventIconColor.DEFAULT,
  title,
  topNode,
  midNode,
  time,
  noNotification = false,
  isFirst = false,
  children,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-xsmall">
          <div className={clsx("h-5 w-5", iconColor)}>{icon}</div>
          <div className="inter-small-semibold">{title}</div>
        </div>
        <div className="flex items-center gap-x-xsmall">
          {noNotification && (
            <Tooltip
              content="Notifications related to
this event are disabled"
            >
              <BellOffIcon size={20} className="text-grey-40" />
            </Tooltip>
          )}
          {topNode}
        </div>
      </div>
      <div className="flex gap-x-xsmall">
        <div className="w-5 flex justify-center pt-base">
          {!isFirst && <div className="w-px bg-grey-20 min-h-[24px]" />}
        </div>
        <div className="mt-2xsmall w-full inter-small-regular">
          <div className="flex items-center justify-between">
            <div className="text-grey-50">{new Date(time).toUTCString()}</div>
            {midNode}
          </div>
          {children && (
            <div className="mt-small w-full pb-base">{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventContainer
