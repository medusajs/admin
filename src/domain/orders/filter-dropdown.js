import styled from "@emotion/styled"
import React, { useEffect, useRef, useState } from "react"
import { Box, Flex } from "rebass"
import { ReactComponent as Filter } from "../../assets/svg/filter.svg"
import Button from "../../components/button"
import FilterDropdownItem from "../../components/molecules/filter-dropdown/item"
import InputField from "../../components/molecules/input"
import {
  DateFilters,
  FulfilmentFilters,
  PaymentFilters,
  StatusFilters,
} from "../../utils/filters"

const statusFilters = [
  StatusFilters.Completed,
  StatusFilters.Pending,
  StatusFilters.Canceled,
  StatusFilters.Archived,
  StatusFilters.RequiresAction,
]
const paymentFilters = [
  PaymentFilters.Awaiting,
  PaymentFilters.Captured,
  PaymentFilters.Refunded,
  PaymentFilters.Canceled,
  PaymentFilters.PartiallyRefunded,
  PaymentFilters.RequiresAction,
  PaymentFilters.NotPaid,
]
const fulfillmentFilters = [
  FulfilmentFilters.Fulfilled,
  FulfilmentFilters.NotFulfilled,
  FulfilmentFilters.PartiallyFulfilled,
  FulfilmentFilters.Returned,
  FulfilmentFilters.PartiallyReturned,
  FulfilmentFilters.Shipped,
  FulfilmentFilters.PartiallyShipped,
  FulfilmentFilters.RequiresAction,
  FulfilmentFilters.Canceled,
]
const dateFilters = [
  DateFilters.After,
  DateFilters.Before,
  DateFilters.Between,
  DateFilters.EqualTo,
  DateFilters.InTheLast,
  DateFilters.OlderThan,
]

const Divider = styled(Box)`
  box-shadow: inset -1px 0 #a3acb9;
  width: 1px;
`

const DropdownContainer = styled.div`
  ${(props) => `
    display: ${props.isOpen ? "block" : "none"};
    transform: translate3d(-20px, 44px, 0px);  
  `};

  position: absolute;
  background-color: #fefefe;
  min-width: 225px;
  box-shadow: 4px 8px 16px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 0;
  border-radius: 5px;
  right: 0;

  max-height: 80vh;

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
  statusFilter,
  fulfillmentFilter,
  dateFilter,
  resetFilters,
  paymentFilter,
  handleSaveTab,
  sx,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [saveValue, setSaveValue] = useState("")
  const [numFilters, setNumFilters] = useState()
  const ref = useRef(null)

  const handleClickOutside = (event) => {
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

  useEffect(() => {
    calcNumFilters()
  }, [])

  useEffect(() => {
    calcNumFilters()
  }, [
    paymentFilter.open,
    dateFilter.open,
    fulfillmentFilter.open,
    statusFilter.open,
  ])

  const submit = () => {
    setIsOpen(false)
    resetFilters()
    submitFilters()
  }

  const saveTab = (val) => {
    resetFilters()
    setSaveValue("")
    setIsOpen(false)
    handleSaveTab(val)
  }

  const calcNumFilters = () => {
    let num = 0
    if (fulfillmentFilter.open) {
      num += 1
    } else {
      setFulfillmentFilter({ open: false, filters: null })
    }

    if (paymentFilter.open) {
      num += 1
    } else {
      setPaymentFilter({ open: false, filters: null })
    }

    if (statusFilter.open) {
      num += 1
    } else {
      setStatusFilter({ open: false, filters: null })
    }

    if (dateFilter.open) {
      num += 1
    } else {
      setDateFilter({ open: false, filters: null })
    }

    setNumFilters(num)
  }

  return (
    <Box style={{ position: "relative" }}>
      <Button
        sx={sx}
        alignItems="center"
        variant="primary"
        fontSize="12px"
        onClick={() => handleOpen()}
        paddingLeft="3px"
        paddingRight="3px"
        minWidth={numFilters > 0 ? "85px" : "60px"}
        {...rest}
      >
        <Flex justifyContent="space-evenly" width="100%">
          <Filter /> Filter
          {numFilters > 0 ? (
            <>
              <Divider mx={1} />
              {numFilters}
            </>
          ) : null}
        </Flex>
      </Button>
      <DropdownContainer ref={ref} isOpen={isOpen}>
        <ButtonContainer p={2}>
          <ClearButton onClick={() => resetFilters()}>Clear</ClearButton>
          <Box ml="auto" />
          <DoneButton onClick={() => submit()} variant="cta">
            Done
          </DoneButton>
        </ButtonContainer>
        <FilterDropdownItem
          filterTitle="Date"
          options={dateFilters}
          open={dateFilter.open}
          filters={dateFilter.filter}
          setFilter={setDateFilter}
        />
        <FilterDropdownItem
          filterTitle="Status"
          options={statusFilters}
          open={statusFilter.open}
          filters={statusFilter.filter}
          setFilter={setStatusFilter}
        />
        <FilterDropdownItem
          filterTitle="Payment status"
          options={paymentFilters}
          filters={paymentFilter.filter}
          open={paymentFilter.open}
          setFilter={setPaymentFilter}
        />
        <FilterDropdownItem
          filterTitle="Fulfillment status"
          options={fulfillmentFilters}
          filters={fulfillmentFilter.filter}
          open={fulfillmentFilter.open}
          setFilter={setFulfillmentFilter}
        />
        <Flex m={2} alignItems="center" height="30px">
          <InputField
            value={saveValue}
            placeholder="Name"
            onChange={(e) => setSaveValue(e.target.value)}
            sx={{ flex: "1", marginRight: "5px", height: "25px" }}
            inputStyle={{ height: "25px", fontSize: "10px !important" }}
          />
          <Button
            onClick={() => saveTab(saveValue)}
            sx={{ p: "0", px: 2 }}
            variant="cta"
            fontSize="10px"
            disabled={!saveValue}
            width="50px"
            height="25px"
          >
            Save
          </Button>
        </Flex>
      </DropdownContainer>
    </Box>
  )
}

export default OrderFilterButton
