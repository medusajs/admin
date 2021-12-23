import React from "react"

const PageDescription = ({ title, subtitle }) => {
  return (
    <div className="mb-xlarge">
      <h1 className="inter-2xlarge-semibold mb-xsmall">{title}</h1>
      <h2 className="inter-base-regular">{subtitle}</h2>
    </div>
  )
}

export default PageDescription
