import React from "react"
import Actionables, { ActionType } from "../../molecules/actionables"

type indexProps = {}

const Timeline: React.FC<indexProps> = ({}) => {
    const actions: ActionType[] = [
        {
            label: "Request Return",
            icon: <Return
        }
    ]
  return (
    <div className="rounded-rounded bg-grey-0 border border-grey-20 py-large px-xlarge">
      <div>
          <h2 className="inter-xlarge-semibold">Timeline</h2>
          <Actionables />
      </div>
      <div></div>
    </div>
  )
}

export default Timeline
