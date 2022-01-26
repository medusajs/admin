import * as RadixCollapsible from "@radix-ui/react-collapsible"
import * as RadixPopover from "@radix-ui/react-popover"
import clsx from "clsx"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { DateFilters } from "../../../utils/filters"
import { addHours, atMidnight, dateToUnixTimestamp } from "../../../utils/time"
import { CalendarComponent } from "../../atoms/date-picker/date-picker"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"
import InputField from "../input"

const FilterDropdownItem = ({
  filterTitle,
  options,
  filters,
  open,
  setFilter,
}) => {
  const [checked, setChecked] = useState({})

  const prefill = () => {
    try {
      const prefilled = filters.split(",").reduce((acc, f) => {
        acc[f] = true
        return acc
      }, {})
      setChecked(prefilled)
    } catch (er) {
      setChecked({})
    }
  }

  useEffect(() => {
    if (filters) {
      prefill()
    }
  }, [filters])

  useEffect(() => {
    if (!open) {
      setChecked({})
    }
  }, [open])

  const onCheck = (filter) => {
    const checkedState = checked

    if (!checkedState[filter]) {
      checkedState[filter] = true
    } else {
      checkedState[filter] = false
    }

    const newFilter = Object.entries(checkedState).reduce(
      (acc, [key, value]) => {
        if (value === true) {
          acc.push(key)
        }
        return acc
      },
      []
    )

    setChecked(checkedState)

    setFilter({ open: open, filter: newFilter.join(",").toString() })
  }

  return (
    <div
      className={clsx("w-full cursor-pointer", {
        "inter-small-semibold": open,
        "inter-small-regular": !open,
      })}
    >
      <RadixCollapsible.Root
        className="w-full"
        open={open}
        onOpenChange={(open) =>
          setFilter((prevState) => ({ ...prevState, open }))
        }
      >
        <RadixCollapsible.Trigger
          className={clsx(
            "py-1.5 px-3 flex w-full items-center hover:bg-grey-5 rounded justify-between",
            {
              "inter-small-semibold": open,
              "inter-small-regular": !open,
            }
          )}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                open && "bg-violet-60"
              }`}
            >
              <span className="self-center">
                {open && <CheckIcon size={16} />}
              </span>
            </div>
            <input
              id={filterTitle}
              className="hidden"
              checked={open}
              type="checkbox"
            />
            <span className="ml-2">{filterTitle}</span>
          </div>
          {open && (
            <span className="text-grey-50 self-end">
              <ChevronUpIcon size={20} />
            </span>
          )}
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content className="w-full">
          {filterTitle === "Date" ? (
            <DateFilter
              options={options}
              open={open}
              setFilter={setFilter}
              existingDate={filters}
              filterTitle={filterTitle}
            />
          ) : (
            options.map((el, i) => (
              <div
                className={clsx(
                  "w-full flex hover:bg-grey-20 my-1 py-1.5 pl-6 items-center rounded",
                  {
                    "inter-small-semibold": checked[el],
                    "inter-small-regular": !checked[el],
                  }
                )}
                key={i}
                onClick={() => onCheck(el)}
              >
                <div
                  className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border mr-2 rounded-base ${
                    checked[el] === true && "bg-violet-60"
                  }`}
                >
                  <span className="self-center">
                    {checked[el] === true && <CheckIcon size={16} />}
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  id={el}
                  name={el}
                  value={el}
                  checked={checked[el] === true}
                  style={{ marginRight: "5px" }}
                />
                {el}
              </div>
            ))
          )}
        </RadixCollapsible.Content>
      </RadixCollapsible.Root>
    </div>
  )
}

export default FilterDropdownItem

const DateFilter = ({
  options,
  open,
  setFilter,
  existingDate,
  existingFilter,
  filterTitle,
}) => {
  const [currentFilter, setCurrentFilter] = useState(
    existingFilter || undefined
  )
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(new Date())
  const select_ref = useRef()
  const input_ref = useRef()

  useEffect(() => {
    if (existingDate && typeof existingDate === "string") {
      const [start] = existingDate.split(",")
      const parsed = moment.unix(start).toDate()
      if (parsed instanceof Date && !isNaN(parsed)) {
        setStartDate(parsed)
      }
    }
  }, [existingDate])

  useEffect(() => {
    handleSetFilter(startDate)
  }, [currentFilter])

  useEffect(() => {
    if (open && !currentFilter) {
      setCurrentFilter(options[0])
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setStartDate(null)
    }
  }, [open])

  const handleSetFilter = (value) => {
    switch (currentFilter) {
      case DateFilters.InTheLast:
      case DateFilters.OlderThan:
        if (!select_ref) {
          console.error("select ref not existing")
          break
        }
        setFilter({
          open: true,
          filter: handleDateFormat(value),
        })
        break
      case DateFilters.EqualTo:
        setFilter({
          open: true,
          filter: handleDateFormat(value),
        })
        break
      default:
        setFilter({
          open: true,
          filter: handleDateFormat(value),
        })
    }
  }

  /**
   * Takes the current selection of dates and formats it.
   * Since the date can be absolute in terms of a date or relative in terms of "3 days old", we have to account for both
   * the output should follow this format: [lt|gt|eq|gte|lte]=unixTimestamp | number_option_filter
   * e.g: [lt]=124323459 or [lt]={3:days:is_in_the_last}
   * @param value
   *
   */
  const handleDateFormat = (value) => {
    const option = daysMonthsValue

    switch (currentFilter) {
      case DateFilters.InTheLast:
        // Relative date
        return { gt: `${value}|${option}` }

      case DateFilters.OlderThan:
        // Relative date:
        return { lt: `${value}|${option}` }

      case DateFilters.EqualTo:
        value = atMidnight(value)
        const day = dateToUnixTimestamp(value.toDate())
        const nextDay = dateToUnixTimestamp(addHours(value, 24).toDate())
        return { gt: day, lt: nextDay }

      case DateFilters.After:
        value = atMidnight(value)
        return { gt: dateToUnixTimestamp(value.toDate()) }

      case DateFilters.Before:
        value = atMidnight(value)
        return { lt: dateToUnixTimestamp(value.toDate()) }

      default:
        return ""
    }
  }

  const [daysMonthsValue, setDaysMonthsValue] = useState("Days")

  const handleFilterContent = () => {
    switch (currentFilter) {
      case DateFilters.InTheLast:
      case DateFilters.OlderThan:
        return (
          <div className="flex flex-col w-full">
            <InputField
              className="pt-0 pb-1"
              ref={input_ref}
              type="number"
              placeholder="2"
              onChange={(e) => handleSetFilter(e.target.value)}
            />
            <RightPopover
              trigger={
                <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
                  <label>{daysMonthsValue}</label>
                  <span className="text-grey-50">
                    <ArrowRightIcon size={16} />
                  </span>
                </div>
              }
            >
              <PopoverOptions
                options={["Days", "Months"]}
                onClick={(value) => {
                  setDaysMonthsValue(value)
                  handleSetFilter(value)
                }}
                selectedItem={daysMonthsValue}
              />
            </RightPopover>
          </div>
        )
      case DateFilters.EqualTo:
      case DateFilters.After:
      case DateFilters.Before:
        return (
          <div className="flex flex-col w-full">
            <RightPopover
              trigger={
                <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
                  <label>
                    {startDate ? moment(startDate).format("MM.DD.YYYY") : "-"}
                  </label>
                  <span className="text-grey-50">
                    <ArrowRightIcon size={16} />
                  </span>
                </div>
              }
            >
              <CalendarComponent
                date={startDate}
                onChange={(date) => {
                  handleSetFilter(date)
                  setStartDate(date)
                }}
              />
            </RightPopover>
          </div>
        )

      default:
        return <span>{currentFilter} - coming soon!</span>
    }
  }
  return (
    <div className="pl-9">
      <RightPopover
        trigger={
          <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
            <label>{currentFilter}</label>
            <span className="text-grey-50">
              <ArrowRightIcon size={16} />
            </span>
          </div>
        }
      >
        <PopoverOptions
          options={options}
          onClick={(filter) => setCurrentFilter(filter)}
          selectedItem={currentFilter}
        />
      </RightPopover>
      {currentFilter && <div className="w-full">{handleFilterContent()}</div>}
    </div>
  )
}

const PopoverOptions = ({ options, onClick, selectedItem }) => {
  return (
    <>
      {options.map((item) => (
        <div
          onClick={(e) => {
            e.stopPropagation()
            onClick(item)
          }}
          className={clsx(
            "px-3 py-1.5 my-1 flex items-center rounded hover:bg-grey-5 cursor-pointer",
            {
              "inter-small-semibold": item === selectedItem,
              "inter-small-regular": item !== selectedItem,
            }
          )}
        >
          <div
            className={clsx(
              "rounded-full flex items-center justify-center mr-2 w-4 h-4",
              {
                "border-2 border-violet-60": item === selectedItem,
                "border border-grey-30 ": item !== selectedItem,
              }
            )}
          >
            {item === selectedItem && (
              <div className="rounded-full w-2 h-2 bg-violet-60" />
            )}
          </div>
          {item}
        </div>
      ))}
    </>
  )
}

const RightPopover = ({ trigger, children }) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger className="w-full my-1">
      {trigger}
    </RadixPopover.Trigger>
    <RadixPopover.Content
      side="right"
      align="start"
      alignOffset={-8}
      sideOffset={20}
      className="flex flex-col bg-grey-0 rounded-rounded shadow-dropdown p-2 top-2/4"
    >
      {children}
    </RadixPopover.Content>
  </RadixPopover.Root>
)
