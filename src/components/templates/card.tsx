import * as React from "react"
import Divider from "../atoms/divider"
import clsx from "clsx"

const Card = ({ children }) => {
  return (
    <div className="bg-grey-0 border-solid border-1 border-grey-20 py-large px-xlarge rounded-rounded">
      {children}
    </div>
  )
}

Card.Header = ({ className, ...props }) => {
  return (
    <h3 className={clsx("mb-0375 inter-xlarge-semibold", className)} {...props} />
  )
}

Card.Subtitle = ({ className, ...props }) => {
  return (
    <span className={clsx("inter-small-regular text-grey-50", className)} { ...props} />
  )
}

Card.Footer = ({ children }) => {
  return (
    <div>
      <Divider className="w-auto mt-xlarge mb-base -mx-xlarge" />
      <div className="flex flex-row justify-end">
        {children}
      </div>
    </div>
  )
}

export default Card