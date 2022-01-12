import clsx from "clsx"
import React from "react"

type OptionCardProps = {
  title: string
  subtitle?: string
  description?: string
  selected: boolean
} & React.ComponentProps<"div">

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  subtitle,
  description,
  selected = false,
  ...attributes
}) => {
  return (
    <div
      className={clsx(
        "w-full rounded-base border border-grey-20 p-base flex items-baseline",
        { "border-violet-60": selected },
        attributes.className
      )}
    >
      <div className="mr-small flex items-center">
        <input
          type="radio"
          checked={selected}
          readOnly
          className="w-[20px] h-[20px] accent-violet-60"
        />
      </div>
      <div className="truncate flex flex-col">
        <p className="inter-base-semibold truncate mb-2xsmall">
          {title}{" "}
          {subtitle && <span className="inter-base-regular">{subtitle}</span>}
        </p>
        {description && (
          <p className="inter-small-regular text-grey-50">{description}</p>
        )}
      </div>
    </div>
  )
}

export default OptionCard
