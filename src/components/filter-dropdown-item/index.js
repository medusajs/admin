import React, { useState, useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { Collapse } from "react-collapse"
import { Box, Text, Flex } from "rebass"
import Select from "../select"
import { DateFilters } from "../../utils/filters"
import { addHours, atMidnight, dateToUnixTimestamp } from "../../utils/time"
import InputField from "../input"
import ReactDatePicker from "react-datepicker"
import DatePicker from "../date-picker/date-picker"
import moment from "moment"
import { instanceOf } from "prop-types"

const DropdownItemWrapper = styled(Text)`
  font-size: 12px;
  line-height: 100%;

  text-decoration: none;
  display: block;
  text-align: left;
  cursor: pointer;
  box-shadow: inset 0 -1px #e3e8ee;
`

const DropdownItem = styled.div`
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  padding: 7px;

  input {
    margin-right: 5px;
  }
`

const CollapseContainer = styled.div`
  display: flex;
  align-items: center;

  // background-color: ${props => props.theme.colors.gray};
  padding: 7px;
  padding-left: 10px;

  ${props =>
    props.last &&
    `
      margin-bottom: 0;
      padding-bottom: 7px;
  `}
`

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

  const onCheck = filter => {
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
    <DropdownItemWrapper>
      <DropdownItem
        onClick={() => setFilter(prevState => ({ ...prevState, open: !open }))}
        open={open}
      >
        <input
          id={filterTitle}
          checked={open}
          type="checkbox"
          style={{ marginRight: "5px" }}
        />
        {filterTitle}
      </DropdownItem>
      <Collapse isOpened={open}>
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
            <CollapseContainer
              key={i}
              onClick={() => onCheck(el)}
              last={i === options.length - 1}
            >
              <input
                type="checkbox"
                id={el}
                name={el}
                value={el}
                checked={checked[el] === true}
                style={{ marginRight: "5px" }}
              />
              {el}
            </CollapseContainer>
          ))
        )}
      </Collapse>
    </DropdownItemWrapper>
  )
}

export default FilterDropdownItem

const DateFilterContainer = styled(Box)`
  background-color: ${props => props.theme.colors.gray};
  padding: 7px;
  padding-left: 10px;
  padding-right: 10px;

  .date-select {
    width: 100%;
    margin-bottom: 10px;
  }

  .content {
  }
`

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

  const handleSetFilter = value => {
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
  const handleDateFormat = value => {
    let option =
      select_ref?.current?.options[select_ref.current.options.selectedIndex]
        ?.label

    switch (currentFilter) {
      case DateFilters.InTheLast:
        // Relative date
        return { gt: `${value}|${option}` }

      case DateFilters.OlderThan:
        // Relative date:
        return { lt: `${value}|${option}` }

      case DateFilters.EqualTo:
        value = atMidnight(value)
        let day = dateToUnixTimestamp(value.toDate())
        let nextDay = dateToUnixTimestamp(addHours(value, 24).toDate())
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

  const handleFilterContent = () => {
    switch (currentFilter) {
      case DateFilters.InTheLast:
      case DateFilters.OlderThan:
        return (
          <Flex>
            <InputField
              ref={input_ref}
              width="60px"
              placeholder="2"
              inputStyle={{
                p: "2px",
                fontSize: "10px",
                height: "25px",
                marginRight: "2px;",
              }}
              height="25px"
              onChange={e => handleSetFilter(e.target.value)}
            />
            <Select
              ref={select_ref}
              options={[{ value: "days" }, { value: "months" }]}
              defaultValue={"days"}
              onChange={() => handleSetFilter(input_ref?.current?.value)}
              selectStyle={{
                ml: "5px",
                width: "50px",
                fontSize: "10px",
                height: "25px",
              }}
            />
          </Flex>
        )
      case DateFilters.EqualTo:
      case DateFilters.After:
      case DateFilters.Before:
        return (
          <Flex>
            <DatePicker
              date={startDate}
              onChange={date => {
                handleSetFilter(date)
                setStartDate(date)
              }}
            />
          </Flex>
        )

      default:
        return <Box>{currentFilter} - comming soon!</Box>
    }
  }
  return (
    <DateFilterContainer>
      <Select
        className="date-select"
        name={currentFilter}
        flex="1"
        options={options.map(filter => {
          return { value: filter }
        })}
        onChange={e => setCurrentFilter(e.target.value)}
      />
      {currentFilter && <Box className="content">{handleFilterContent()}</Box>}
    </DateFilterContainer>
  )
}
