import React from "react"
import IconTooltip from "../molecules/icon-tooltip"

export type InputHeaderProps = {
  label?: string
  required?: boolean
  tooltipContent?: string
  tooltip?: React.ReactNode
}

const InputHeader: React.FC<InputHeaderProps> = ({
  label,
  required = false,
  tooltipContent,
  tooltip,
}) => {
  return (
    <div className="w-full flex inter-small-semibold text-grey-50 items-center">
      <label>{label}</label>
      {required && <div className="text-rose-50 "> *</div>}
      {tooltip || tooltipContent ? (
        <div className="flex ml-1.5">
          {tooltip || <IconTooltip content={tooltipContent} />}
        </div>
      ) : null}
    </div>
  )
}

export default InputHeader
