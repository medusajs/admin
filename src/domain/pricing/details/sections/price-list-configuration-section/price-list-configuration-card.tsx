import { ReactNode } from "react"
import Button from "../../../../../components/fundamentals/button"
import ClockIcon from "../../../../../components/fundamentals/icons/clock-icon"
import MoreHorizontalIcon from "../../../../../components/fundamentals/icons/more-horizontal-icon"

type Props = {
  icon: ReactNode
  label: string
  value: string | Date | ReactNode
}

const PriceListConfigurationCard = ({ icon, label, value }: Props) => {
  const ValueWrapper = typeof value === "string" ? "p" : "div"
  const val = isDate(value) ? (
    <div className="flex items-center gap-x-small">
      <span>
        {new Date(value).toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
      <div className="flex items-center gap-x-xsmall">
        <ClockIcon size={16} className="text-grey-40" />
        <span>
          {new Date(value).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      </div>
    </div>
  ) : (
    value
  )

  return (
    <div className="border border-grey-20 p-base rounded-rounded flex items-center gap-x-base">
      <div className="w-10 h-10 bg-grey-10 flex items-center justify-center rounded-rounded text-grey-50">
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-y-0.5">
        <h3 className="inter-base-semibold">{label}</h3>
        <ValueWrapper className="inter-small-regular text-grey-50">
          {val}
        </ValueWrapper>
      </div>
      <div>
        <Button variant="ghost" size="small">
          <MoreHorizontalIcon size="20" className="text-grey-50" />
        </Button>
      </div>
    </div>
  )
}

const isDate = (value: string | Date | ReactNode): value is Date => {
  return value instanceof Date
}

export default PriceListConfigurationCard
