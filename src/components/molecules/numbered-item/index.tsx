import React from "react"

import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"
import Badge from "../../../components/fundamentals/badge"

type NumberedItemProps = {
  actions: ActionType[]
  index: number
  title: string
  description: React.ReactNode | string
}

const NumberedItem: React.FC<NumberedItemProps> = ({
  actions,
  index,
  title,
  description,
}) => {
  return (
    <div className="p-base border rounded-rounded flex gap-base justify-between items-center">
      <div className="flex overflow-hidden gap-base">
        <div>
          <Badge
            className="inter-base-semibold flex justify-center items-center w-[40px] h-[40px]"
            variant="default"
          >
            §{index}
          </Badge>
        </div>
        <div className="truncate">
          <div className="inter-small-semibold">{title}</div>
          {typeof description === "string" ? (
            <div className="inter-small-regular text-grey-50">
              {description}
            </div>
          ) : (
            description
          )}
        </div>
      </div>
      <div>
        <Actionables forceDropdown actions={actions} />
      </div>
    </div>
  )
}

export default NumberedItem
