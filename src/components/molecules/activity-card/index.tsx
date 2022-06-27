import React, { ReactNode } from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

export type ActivityCardProps = {
  key?: string
  title: string
  titleIcon?: ReactNode
  relativeTimeElapsed?: string
  shouldShowStatus?: boolean
  children?: ReactNode[]
}

export const ActivityCard: React.FC<ActivityCardProps> = (
  props: ActivityCardProps
) => {
  const {
    key,
    title,
    titleIcon,
    relativeTimeElapsed,
    shouldShowStatus,
    children
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
                  {
                    !!relativeTimeElapsed && (
                      <span>{relativeTimeElapsed}</span>
                    )
                  }
                  {
                    shouldShowStatus &&
                    <StatusIndicator variant={"primary"} className="ml-2"/>
                  }
                </div>
              )
            }
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
