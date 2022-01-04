import React from "react"
import InfoTooltip from "../info-tooltip"

type InputHeaderProps = {
  label: string
  required?: boolean
  withTooltip?: boolean
  tooltipText?: string
  tooltipProps?: any
}

const InputHeader: React.FC<InputHeaderProps> = ({
  label,
  required = false,
  withTooltip = false,
  tooltipText,
  tooltipProps,
}) => {
  return (
    <div className="w-full flex inter-small-semibold text-grey-50 items-baseline">
      {label}
      {required && <div className="text-rose-50 "> *</div>}
      {withTooltip ? (
        <div className="ml-2">
          <InfoTooltip tooltipText={tooltipText} {...tooltipProps} />
        </div>
      ) : null}
    </div>
  )
}

export default InputHeader
