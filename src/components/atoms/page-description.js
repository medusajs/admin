import React from "react"

const PageDescription = ({ title = null, subtitle = null }) => {
  return (
    <div className="mb-xlarge">
      <h1 className="inter-2xlarge-smibold mb-xsmall">{title}</h1>
      <h2 className="inter-base-regular">{subtitle}</h2>
    </div>
  )
}

export default PageDescription
