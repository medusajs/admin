import React from "react"
import Actionables, { ActionType } from "../../molecules/actionables"

type SectionProps = {
  children?: React.ReactNode
  title: string
  actions?: ActionType[]
  forceDropdown?: boolean
  status?: React.ReactNode
}

const Section = ({
  title,
  actions,
  forceDropdown = false,
  status,
  children,
}: SectionProps) => {
  return (
    <div className="px-xlarge pt-large pb-xlarge rounded-rounded bg-grey-0 border border-grey-20">
      <div className="flex items-center justify-between">
        <h1 className="inter-xlarge-semibold text-grey-90">{title}</h1>
        <div className="flex items-center gap-x-2">
          {status && status}
          {actions && (
            <Actionables actions={actions} forceDropdown={forceDropdown} />
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default Section
