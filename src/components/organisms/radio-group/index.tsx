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
    <RadioGroupPrimitive.Root {...rest}>{children}</RadioGroupPrimitive.Root>
  )
}

const Item = ({
  label,
  sublabel,
  description,
  checked,
  ...rest
}: RadioGroupItemProps) => {
  return (
    <label
      className={clsx(
        "rounded-base border border-grey-20 p-base flex items-start mb-xsmall last:mb-0 gap-base cursor-pointer"
      )}
      htmlFor={rest.value}
    >
      <RadioGroupPrimitive.Item
        {...rest}
        id={rest.value}
        className={clsx(
          "radio-outer-ring outline-0",
          "shrink-0 w-[20px] h-[20px] shadow-[0_0_0_1px] shadow-[#D1D5DB] rounded-circle"
        )}
      >
        <RadioGroupPrimitive.Indicator
          className={clsx(
            "flex items-center justify-center w-full h-full relative",
            "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
          )}
        />
      </RadioGroupPrimitive.Item>
      <div className="truncate">
        <div className="flex items-center">
          <p className="inter-base-semibold truncate">
            {label}{" "}
            {sublabel ? (
              <span className="inter-base-regular">{sublabel}</span>
            ) : null}
          </p>
        </div>
        <p className="inter-small-regular text-grey-50 mt-2xsmall truncate">
          {description}
        </p>
      </div>
    </label>
  )
}

RadioGroup.Item = Item

export default RadioGroup
