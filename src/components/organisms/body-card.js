import React from "react"

const BodyCard = ({ title, subtitle, actionables, children }) => {
  return (
    <div className="rounded-rounded border border-grey-20">
      <div className="pt-large px-xlarge">
        <div className="flex items-center justify-between">
          {title ? (
            <h1 className="inter-xlarge-semibold text-grey-90">{title}</h1>
          ) : (
            <div />
          )}
          <button>Add region</button>
        </div>
        {subtitle && (
          <h3 className="inter-small-regular text-grey-50">{subtitle}</h3>
        )}
        <div className="mt-large">{children}</div>
      </div>
      <div className="h-large px-xlarge">
        <button>Save changes</button>
      </div>
    </div>
  )
}

export default BodyCard
