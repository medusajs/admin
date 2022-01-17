import React from "react"

type DenominationBadgeProps = {
  amount: number
  currencyCode: string
  conversion?: number
} & React.HTMLAttributes<HTMLDivElement>

const DenominationBadge: React.FC<DenominationBadgeProps> = ({
  amount,
  currencyCode,
  conversion = 100,
  ...attributes
}) => {
  return (
    <div className="inline-block" {...attributes}>
      <div className="py-[2px] px-xsmall bg-grey-10 rounded-rounded flex items-center justify-center">
        <span className="inter-small-regular">
          {amount / conversion} {currencyCode?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default DenominationBadge
