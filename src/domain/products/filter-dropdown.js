import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

import Button from "../../components/button"
import FilterDropdownItem from "../../components/filter-dropdown-item"

import { ReactComponent as Filter } from "../../assets/svg/filter.svg"

const statusFilters = ["pending", "completed", "cancelled"]
const paymentFilters = ["awaiting", "captured", "refunded"]
const fulfillmentFilters = [
  "not_fulfilled",
  "partially_fulfilled",
  "fulfilled",
  "returned",
]

const DropdownContainer = styled.div`
  ${props => `
    display: ${props.isOpen ? "block" : "none"};
    transform: translate3d(-15px, 32px, 0px);  
  `};

  position: absolute;
  background-color: #fefefe;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 0;
  border-radius: 5px;
  right: 0;

  max-height: 80vh;
  overflow: auto;

  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    bottom: 100%;
    right: 0.4rem;
    border: 0.4rem solid transparent;
    border-top: none;
    color: #fefefe;

    border-bottom-color: #fefefe;
    filter: drop-shadow(0px 8px 16px 0px rgba(0, 0, 0, 0.2));
  }
`

const ClearButton = styled(Button)`
  background-color: #fefefe;
  color: #454545;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  height: 25px;
  width: 50px;
  font-size: 10px;
  padding: 0;
  cursor: pointer;
`

const DoneButton = styled(Button)`
  height: 25px;
  width: 50px;
  fontsize: 10px;
  padding: 0;
  cursor: pointer;
  font-size: 10px;
`

const ButtonContainer = styled(Flex)`
  box-shadow: inset 0 -1px #e3e8ee;
  background-color: #f7fafc;
`

const ProductsFilter = ({
  setStatusFilter,
  setPaymentFilter,
  setFulfillmentFilter,
  submitFilters,
  clearFilters,
  statusFilter,
  fulfillmentFilter,
  paymentFilter,
  sx,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef(null)

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target) && isOpen) {
      setIsOpen(false)
    }
  }

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true)
    } else if (isOpen) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  })

  const clear = () => {
    setFulfillmentFilter({ open: false, filter: "" })
    setPaymentFilter({ open: false, filter: "" })
    setPaymentFilter({ open: false, filter: "" })
    clearFilters()
  }

  return (
    <Box style={{ position: "relative" }}>
      <Button
        sx={sx}
        alignItems="center"
        variant="primary"
        onClick={() => handleOpen()}
        {...rest}
      >
        <Filter /> Filter
      </Button>
      <DropdownContainer ref={ref} isOpen={isOpen}>
        <ButtonContainer p={2}>
          <ClearButton onClick={() => clear()}>Clear</ClearButton>
          <Box ml="auto" />
          <DoneButton onClick={() => submitFilters()}>Done</DoneButton>
        </ButtonContainer>
        <FilterDropdownItem
          filterTitle="Status"
          filters={statusFilters}
          open={statusFilter.open}
          setFilter={setStatusFilter}
        />
        <FilterDropdownItem
          filterTitle="Payment status"
          filters={paymentFilters}
          open={paymentFilter.open}
          setFilter={setPaymentFilter}
        />
        <FilterDropdownItem
          filterTitle="Fulfillment status"
          filters={fulfillmentFilters}
          open={fulfillmentFilter.open}
          setFilter={setFulfillmentFilter}
        />
      </DropdownContainer>
    </Box>
  )
}

export default ProductsFilter
