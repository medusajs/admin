import React from "react"
import Tooltip from "../../atoms/tooltip"

type DelimitedListProps = {
  list: Record<string, any>[]
  delimit?: number
  property?: string
}

const DelimitedList: React.FC<DelimitedListProps> = ({
  list,
  delimit = 1,
  property = "name",
}) => {
  if (!list.length) {
    return <></>
  }

  const ToolTipContent = () => {
    return (
      <div className="flex flex-col">
        {list.slice(delimit).map((listItem) => (
          <span key={listItem.id}>{listItem[property]}</span>
        ))}
      </div>
    )
  }

  return (
    <span className="inter-small-regular">
      {list
        .slice(0, delimit)
        .map((listItem) => listItem[property])
        .join(", ")}

      {list.length > delimit && (
        <Tooltip content={<ToolTipContent />}>
          <span className="text-grey-40"> + {list.length - delimit} more</span>
        </Tooltip>
      )}
    </span>
  )
}

export default DelimitedList
