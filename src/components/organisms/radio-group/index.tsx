import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import clsx from "clsx"
import React from "react"

type RadioGroupProps = RadioGroupPrimitive.RadioGroupProps &
  React.RefAttributes<HTMLDivElement>

type RadioGroupItemProps = {
  label: string
  sublabel?: string
  description?: string
} & RadioGroupPrimitive.RadioGroupItemProps &
  React.RefAttributes<HTMLButtonElement>

const RadioGroup: React.FC<RadioGroupProps> & {
  Item: React.FC<RadioGroupItemProps>
} = ({ children, ...rest }) => {
  return (
    <RadioGroupPrimitive.RadioGroup {...rest}>
      {children}
    </RadioGroupPrimitive.RadioGroup>
  )
}

const Item = ({
  label,
  sublabel,
  description,
  ...rest
}: RadioGroupItemProps) => {
  return (
    <div
      className={clsx(
        "w-full rounded-base border border-grey-20 p-base flex items-baseline mb-xsmall last:mb-0"
      )}
    >
      <div className="mr-base w-[20px] h-[20px]">
        <RadioGroupPrimitive.Item
          {...rest}
          id={rest.value}
          className={clsx(
            "w-full h-full bg-grey-0 rounded-circle border border-grey-20",
            rest.className
          )}
        >
          <RadioGroupPrimitive.Indicator className="h-full w-full bg-violet-60 rounded-circle flex items-center justify-center relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:bg-grey-0 after:rounded-circle" />
        </RadioGroupPrimitive.Item>
      </div>
      <div>
        <label className="inter-base-semibold truncate" htmlFor={rest.value}>
          {label}{" "}
          {sublabel && <span className="inter-base-regular">{sublabel}</span>}
        </label>
        <p className="inter-small-regular text-grey-50 mt-2xsmall truncate">
          {description}
        </p>
      </div>
    </div>
  )
}

RadioGroup.Item = Item

export default RadioGroup
