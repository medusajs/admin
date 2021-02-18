import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { Collapse } from "react-collapse"
import { Text } from "rebass"

const DropdownItemWrapper = styled(Text)`
  font-size: 12px;
  line-height: 100%;
  padding-left: 7px;
  padding-right: 7px;
  padding-top: 7px;
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

  input {
    margin-right: 5px;
  }
`

const CollapseContainer = styled.div`
  padding-left: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
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
    console.log("filter: ", filter)
    const checkedState = checked
    console.log("checkedState0, ", checkedState)
    if (!checkedState[filter]) {
      checkedState[filter] = true
    } else {
      checkedState[filter] = false
    }

    console.log("checkedState1, ", checkedState)
    const newFilter = Object.entries(checkedState).reduce(
      (acc, [key, value]) => {
        console.log("key value", key, value)
        if (value === true) {
          acc.push(key)
        }
        return acc
      },
      []
    )

    console.log("filter: ", newFilter, newFilter.join(","))
    setChecked(checkedState)

    setFilter({ open: open, filter: newFilter.join(",").toString() })
  }

  useEffect(() => {
    console.log("render")
  }, [checked, filters])

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
        {console.log("filters render: ", filters)}
        {filters.map((el, i) => (
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
        ))}
      </Collapse>
    </DropdownItemWrapper>
  )
}

export default FilterDropdownItem
