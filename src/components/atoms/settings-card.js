import { Link } from "gatsby"
import React from "react"
import ChevronRightIcon from "../fundamentals/icons/chevron-right"

const SettingsCard = ({
  icon,
  heading,
  description,
  to = null,
  externalLink = null,
  disabled = false,
}) => {
  if (disabled) {
    to = null
  }

  return (
    <button
      className="group bg-grey-0 rounded-rounded p-large border border-grey-20"
      disabled={disabled}
      onClick={() => {
        if (externalLink) {
          window.location.href = externalLink
        }
      }}
    >
      <Link className="flex items-center" to={to}>
        <div className="h-2xlarge w-2xlarge bg-violet-20 rounded-circle flex justify-center items-center text-violet-60 group-disabled:bg-grey-10 group-disabled:text-grey-40">
          {icon}
        </div>
        <div className="text-left flex-1 mx-large">
          <h3 className="inter-large-semibold text-grey-90 group-disabled:text-grey-40 m-0">
            {heading}
          </h3>
          <p className="inter-base-regular text-grey-50 group-disabled:text-grey-40 m-0">
            {description}
          </p>
        </div>
        <div className="text-grey-40 group-disabled:text-grey-30">
          <ChevronRightIcon />
        </div>
      </Link>
    </button>
  )
}

export default SettingsCard
