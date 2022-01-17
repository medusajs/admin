import clsx from "clsx"
import React from "react"

type StatusIndicatorProps = {
  ok: boolean
  okText: string
  notOkText: string
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  ok,
  okText,
  notOkText,
}) => {
  return (
    <div className="flex items-center gap-xsmall">
      <div
        className={clsx("w-[6px] h-[6px] rounded-circle bg-rose-50", {
          "bg-emerald-50": ok,
        })}
      />
      <p className="inter-small-regular">{ok ? okText : notOkText}</p>
    </div>
  )
}

export default StatusIndicator
