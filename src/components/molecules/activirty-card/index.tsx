import React, { ReactNode } from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

export type ActivityCardProps = {
  key?: string
  title: string
  titleIcon?: ReactNode
  relativeTimeElapsed?: string
  shouldShowStatus?: boolean
  description?: string
  bodyActions?: ReactNode
  footerActions?: ReactNode
}

export const ActivityCard: React.FC<ActivityCardProps> = (
  props: ActivityCardProps
) => {
  const {
    title,
    titleIcon,
    relativeTimeElapsed,
    shouldShowStatus,
    description,
    bodyActions,
    footerActions,
    key
  } = props

  return (
    <div key={key} className="mx-4 border-b border-grey-20">
      <div className="-mx-4 flex p-4 hover:bg-grey-5">
        <div className="relative w-full h-full">
          <div className="flex justify-between inter-base-semibold">
            <div className="flex">
              {
                !!titleIcon && titleIcon
              }
              <span>{title}</span>
            </div>

            {
              (!!relativeTimeElapsed || shouldShowStatus) && (
                <div className="flex">
                  <span>{relativeTimeElapsed}</span>
                  {
                    shouldShowStatus &&
                    <StatusIndicator variant={"primary"} className="ml-2"/>
                  }
                </div>
              )
            }
          </div>

          {
            (!!description || bodyActions!!) && (
              <div className={"flex flex-col " + (titleIcon && "ml-8")}>
                {
                  !!description &&
                  <span>{description}</span>
                }

                {bodyActions}
              </div>
            )
          }

          {
            !!footerActions && (
              <div className={"flex " + (titleIcon && "ml-8")}>
                {footerActions}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
