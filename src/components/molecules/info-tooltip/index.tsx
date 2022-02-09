import React from "react"
import Tooltip from "../../atoms/tooltip"
import InfoIcon from "../../fundamentals/icons/info-icon"

const InfoTooltip = ({ content, ...props }) => (
  <Tooltip content={content} {...props}>
    <InfoIcon className="flex text-grey-40" />
  </Tooltip>
)

export default InfoTooltip
