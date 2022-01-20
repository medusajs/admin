import React, { useEffect, useState } from "react"
import moment from "moment"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ClockIcon from "../../fundamentals/icons/clock-icon"
import NumberScroller from "../number-scroller"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import clsx from "clsx"
import { DateTimePickerProps } from "./types"

const TimePicker: React.FC<DateTimePickerProps> = ({
  date,
  onChange,
  label = "start date",
  required = false,
  withTooltip = false,
  tooltipText,
  tooltipProps = {},
}) => {
  const [selectedMinute, setSelectedMinute] = useState(date?.getUTCMinutes())
  const [selectedHour, setSelectedHour] = useState(date?.getUTCHours())

  useEffect(() => {
    setSelectedMinute(date?.getUTCMinutes())
    setSelectedHour(date?.getUTCHours())
  }, [date])

  useEffect(() => {
    if (date && selectedHour && selectedMinute) {
      const newDate = new Date(date.getTime())
      newDate.setUTCHours(selectedHour)
      newDate.setUTCMinutes(selectedMinute)
      onChange(newDate)
    }
  }, [selectedMinute, selectedHour])

  const [isOpen, setIsOpen] = useState(false)

  const minuteNumbers = [...Array(60).keys()]
  const hourNumbers = [...Array(24).keys()]

  return (
    <div className="w-full">
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            className={clsx("w-full rounded-base border ", {
              "shadow-input border-violet-60": isOpen,
              "border-grey-20": !isOpen,
            })}
          >
            <InputContainer className="border-0 shadown-none focus-within:shadow-none">
              <div className="w-full flex text-grey-50 pr-0.5 justify-between">
                <InputHeader
                  {...{
                    label,
                    required,
                    withTooltip,
                    tooltipText,
                    tooltipProps,
                  }}
                />
                <ArrowDownIcon size={16} />
              </div>
              <div className="w-full items-center flex text-left text-grey-40">
                <ClockIcon size={16} />
                <span className="mx-1">UTC</span>
                <span className="text-grey-90">
                  {moment.utc(date).format("HH:mm")}
                </span>
              </div>
            </InputContainer>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={8}
          className="rounded-rounded scrollbar-hide border px-6 pt-6 pb-4 border-grey-20 bg-grey-0 w-full flex shadow-dropdown"
        >
          <NumberScroller
            numbers={hourNumbers}
            selected={selectedHour}
            onSelect={(n) => setSelectedHour(n)}
            className="pr-4"
          />
          <NumberScroller
            numbers={minuteNumbers}
            selected={selectedMinute}
            onSelect={(n) => setSelectedMinute(n)}
          />
          <div className="absolute bottom-4 left-0 right-0 bg-gradient-to-b from-transparent to-grey-0 h-xlarge z-10" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  )
}

export default TimePicker
