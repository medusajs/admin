import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

import Button from "../../components/button"
import FilterDropdownItem from "../../components/filter-dropdown-item"
import qs from "query-string"
import { ReactComponent as Filter } from "../../assets/svg/filter.svg"
import InputField from "../../components/input"
import {
  DateFilters,
  StatusFilters,
  PaymentFilters,
  FulfilmentFilters,
} from "../../utils/filters"

const statusFilters = [
  StatusFilters.Completed,
  StatusFilters.Pending,
  StatusFilters.Cancelled,
]
const paymentFilters = [
  PaymentFilters.Awaiting,
  PaymentFilters.Captured,
  PaymentFilters.Refunded,
]
const fulfillmentFilters = [
  FulfilmentFilters.Fulfilled,
  FulfilmentFilters.NotFulfilled,
  FulfilmentFilters.PartiallyFulfilled,
  FulfilmentFilters.Returned,
]
const dateFilters = [
  DateFilters.After,
  DateFilters.Before,
  DateFilters.Between,
  DateFilters.EqualTo,
  DateFilters.InTheLast,
  DateFilters.OlderThan,
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

const OrderFilterButton = ({
  setStatusFilter,
  setPaymentFilter,
  setFulfillmentFilter,
  setDateFilter,
  submitFilters,
  clearFilters,
  statusFilter,
  fulfillmentFilter,
  dateFilter,
  paymentFilter,
  handleSaveTab,
  sx,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [saveValue, setSaveValue] = useState("")
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

  const submit = () => {
    setIsOpen(false)
    submitFilters()
  }

  const clear = () => {
    setFulfillmentFilter({ open: false, filter: "" })
    setStatusFilter({ open: false, filter: "" })
    setPaymentFilter({ open: false, filter: "" })
    setDateFilter({ open: false, filter: "" })
    setIsOpen(false)
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
          <DoneButton onClick={() => submit()}>Done</DoneButton>
        </ButtonContainer>
        <FilterDropdownItem
          filterTitle="Date"
          filters={dateFilters}
          open={dateFilter.open}
          setFilter={setDateFilter}
        />
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
        <Flex m={2} alignItems="center" height="30px">
          <InputField
            value={saveValue}
            placeholder="Name"
            onChange={e => setSaveValue(e.target.value)}
            sx={{ flex: "1", marginRight: "5px" }}
          />
          <Button
            onClick={() => handleSaveTab(saveValue)}
            sx={{ height: "100%", p: "0", px: 2 }}
          >
            Save
          </Button>
        </Flex>
      </DropdownContainer>
    </Box>
  )
}

export default OrderFilterButton
