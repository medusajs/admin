import * as PopoverPrimitive from "@radix-ui/react-popover"
import clsx from "clsx"
import moment from "moment"
import React, { useEffect, useState } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Button from "../../fundamentals/button"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ChevronLeftIcon from "../../fundamentals/icons/chevron-left-icon"
import ChevronRightIcon from "../../fundamentals/icons/chevron-right-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import { DateTimePickerProps } from "./types"

const DatePicker: React.FC<DateTimePickerProps> = ({
  date,
  onSubmitDate,
  label = "start date",
  required = false,
  tooltipContent,
  tooltip,
}) => {
  const [tempDate, setTempDate] = useState(date)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => setTempDate(date), [isOpen])

  const submitDate = () => {
    // update only date, month and year
    const newDate = new Date(date.getTime())
    newDate.setUTCDate(tempDate.getUTCDate())
    newDate.setUTCMonth(tempDate.getUTCMonth())
    newDate.setUTCFullYear(tempDate.getUTCFullYear())

    onSubmitDate(newDate)
    setIsOpen(false)
  }

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
                    tooltipContent,
                    tooltip,
                  }}
                />
                <ArrowDownIcon size={16} />
              </div>
              <label className="w-full text-left">
                {moment(date).format("ddd, DD MMM YYYY")}
              </label>
            </InputContainer>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={8}
          className="rounded-rounded px-8  border border-grey-20 bg-grey-0 w-full shadow-dropdown"
        >
          <CalendarComponent date={tempDate} onChange={setTempDate} />
          <div className="flex w-full mb-8 mt-5">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setIsOpen(false)}
              className="mr-2 w-1/3 flex justify-center border border-grey-20"
            >
              Cancel
            </Button>
            <Button
              size="medium"
              variant="primary"
              onClick={() => submitDate()}
              className="w-2/3 flex justify-center"
            >{`Set ${label}`}</Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  )
}

const CustomHeader = ({ date, decreaseMonth, increaseMonth, ...props }) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="w-10 h-10">
        <Button
          variant="ghost"
          size="medium"
          tabIndex={-1}
          className="w-full h-full flex justify-center p-2 focus:border-0 focus:shadow-none"
          onClick={decreaseMonth}
        >
          <ChevronLeftIcon size={16} />
        </Button>
      </div>
      <span className="inter-base-semibold">
        {moment(date).format("MMMM, YYYY")}
      </span>

      <div className="w-10 h-10">
        <Button
          variant="ghost"
          size="medium"
          tabIndex={-1}
          className="w-full h-full flex justify-center p-2 focus:border-0 focus:shadow-none"
          onClick={increaseMonth}
        >
          <ChevronRightIcon size={16} />
        </Button>
      </div>
    </div>
  )
}

export const CalendarComponent = ({ date, onChange }) => (
  <ReactDatePicker
    selected={date}
    inline
    onChange={onChange}
    calendarClassName="date-picker"
    dayClassName={(d) => getDateClassname(d, date)}
    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
      <CustomHeader
        date={date}
        decreaseMonth={decreaseMonth}
        increaseMonth={increaseMonth}
      />
    )}
  />
)

export default DatePicker
