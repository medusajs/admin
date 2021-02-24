import React, { useState, useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { Collapse } from "react-collapse"
import { Box, Text, Flex } from "rebass"
import Select from "../select"
import { DateFilters } from "../../utils/filters"
import { dateToUnixTimestamp } from "../../utils/time"
import InputField from "../input"

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

  background-color: ${props => props.theme.colors.gray};
  padding: 7px;
  padding-left: 10px;

  ${props =>
    props.last &&
    `
      margin-bottom: 0;
      padding-bottom: 7px;
  `}
`

const FilterDropdownItem = ({ filterTitle, filters, open, setFilter }) => {
  const [checked, setChecked] = useState({})

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
        onClick={() => {
          setFilter(prevState => ({ ...prevState, open: !open }))
        }}
        open={open}
      >
        <input
          id={filterTitle}
          checked={open}
          onChange={() => {}}
          type="checkbox"
          style={{ marginRight: "5px" }}
        />
        {filterTitle}
      </DropdownItem>
      <Collapse isOpened={open}>
        {filterTitle === "Date" ? (
          <DateFilter
            filters={filters}
            setFilter={setFilter}
            filterTitle={filterTitle}
          />
        ) : (
          filters.map((el, i) => (
            <CollapseContainer
              key={i}
              onClick={() => onCheck(el)}
              last={i === filters.length - 1}
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

const DateFilter = ({ filters, setFilter, filterTitle }) => {
  const [currentFilter, setCurrentFilter] = useState(filters[0])
  const date_1_ref = useRef()
  const date_2_ref = useRef()
  const select_ref = useRef()
  const input_ref = useRef()

  console.log("filters: ", filters)

  const handleSetFilter = value => {
    console.log("value and current filter: ", value, currentFilter)
    console.log("refs: ", date_1_ref, date_2_ref, select_ref)

    switch (currentFilter) {
      case DateFilters.InTheLast:
        if (!select_ref) {
          console.error("select ref not existing")
          break
        }
        setFilter({ open: true, filter: `[lt]=${handleDateFormat(value)}` })
        break
    }
  }

  const handleDateFormat = value => {
    switch (currentFilter) {
      case DateFilters.InTheLast:
        const date = new Date()
        const option =
          select_ref.current.options[select_ref.current.options.selectedIndex]
            ?.label

        switch (option) {
          case "days":
            date.setDate(date.getDate() - value)
            break
          case "months":
            date.setDate(date.getMonth() - value)
            break
          default:
            break
        }
        return dateToUnixTimestamp(date)
    }
  }

  const handleFilterContent = () => {
    console.log("current filter, ", currentFilter)
    switch (currentFilter) {
      case DateFilters.InTheLast:
        return (
          <Flex>
            <InputField
              width="60px"
              placeholder="2"
              inputStyle={{ padding: "2px", fontSize: "10px", height: "25px" }}
              onChange={e => handleSetFilter(e.target.value)}
            />
            <Select
              ref={select_ref}
              options={[{ value: "days" }, { value: "months" }]}
              defaultValue={"days"}
              onChange
              selectStyle={{
                ml: "5px",
                width: "50px",
                fontSize: "10px",
                height: "25px",
              }}
            />
          </Flex>
        )

      default:
        return <Box>{currentFilter}</Box>
    }
  }
  return (
    <DateFilterContainer>
      <Select
        className="date-select"
        name={currentFilter}
        flex="1"
        options={filters.map(filter => {
          return { value: filter }
        })}
        onChange={e => setCurrentFilter(e.target.value)}
      />
      <Box className="content">{handleFilterContent()}</Box>
    </DateFilterContainer>
  )
}
