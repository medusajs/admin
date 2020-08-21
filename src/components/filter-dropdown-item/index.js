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
  const [checked, setChecked] = useState("")

  const onCheck = filter => {
    setChecked(filter)
    setFilter(prevState => ({ ...prevState, filter }))
  }

  useEffect(() => {
    if (!open) {
      setFilter(prevState => ({ ...prevState, filter: "" }))
    }
  }, [open])

  return (
    <DropdownItemWrapper>
      <DropdownItem
        onClick={() => {
          setFilter(prevState => ({ ...prevState, open: !open }))
          setChecked(3)
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
              onChange={() => {}}
              checked={checked === el}
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
