import clsx from "clsx"
import React, { useState } from "react"
import FilterDropdownContainer from "../../../components/molecules/filter-dropdown/container"
import FilterDropdownItem from "../../../components/molecules/filter-dropdown/item"
import SaveFilterItem from "../../../components/molecules/filter-dropdown/save-field"
import PlusIcon from "../../fundamentals/icons/plus-icon"

const statusFilters = [
  "completed",
  "pending",
  "canceled",
  "archived",
  "requires_action",
]
const paymentFilters = [
  "awaiting",
  "captured",
  "refunded",
  "canceled",
  "partially_refunded",
  "requires_action",
  "not_paid",
]
const fulfillmentFilters = [
  "fulfilled",
  "not_fulfilled",
  "partially_fulfilled",
  "returned",
  "partially_returned",
  "shipped",
  "partially_shipped",
  "requires_action",
  "canceled",
]

const dateFilters = [
  "is in the last",
  "is older than",
  "is between",
  "is after",
  "is before",
  "is equal to",
]

const OrderFilters = ({
  setStatusFilter,
  statusFilter,
  setFulfillmentFilter,
  fulfillmentFilter,
  setPaymentFilter,
  paymentFilter,
  dateFilter,
  setDateFilter,
  submitFilters,
  resetFilters,
  clearFilters,
  ...rest
}) => {
  const [name, setName] = useState("")

  const onSubmit = () => {
    submitFilters()
  }

  const onClear = () => {
    clearFilters()
  }

  const numberOfFilters = [
    statusFilter,
    paymentFilter,
    fulfillmentFilter,
    dateFilter,
  ].reduce((prev, curr) => prev + (curr.open ? 1 : 0), 0)

  return (
    <FilterDropdownContainer
      submitFilters={onSubmit}
      clearFilters={onClear}
      triggerElement={
        <div className={clsx("flex items-center space-x-1 cursor-pointer")}>
          <div className="flex items-center rounded-rounded bg-grey-5 border border-grey-20 inter-small-semibold px-2 h-6">
            Filters
            <div className="text-grey-40 ml-1 flex items-center rounded">
              <span className="text-violet-60 inter-small-semibold">
                {numberOfFilters ? numberOfFilters : "0"}
              </span>
            </div>
          </div>
          <div className="flex items-center rounded-rounded bg-grey-5 border border-grey-20 inter-small-semibold p-1">
            <PlusIcon size={14} />
          </div>
        </div>
      }
    >
      <FilterDropdownItem
        filterTitle="Status"
        options={statusFilters}
        filters={statusFilter.filter}
        open={statusFilter.open}
        setFilter={setStatusFilter}
      />
      <FilterDropdownItem
        filterTitle="Payment Status"
        options={paymentFilters}
        filters={paymentFilter.filter}
        open={paymentFilter.open}
        setFilter={setPaymentFilter}
      />
      <FilterDropdownItem
        filterTitle="Fulfillment Status"
        options={fulfillmentFilters}
        filters={fulfillmentFilter.filter}
        open={fulfillmentFilter.open}
        setFilter={setFulfillmentFilter}
      />
      <FilterDropdownItem
        filterTitle="Date"
        options={dateFilters}
        filters={dateFilter.filter}
        open={dateFilter.open}
        setFilter={setDateFilter}
      />
      <SaveFilterItem saveFilter={console.log} name={name} setName={setName} />
    </FilterDropdownContainer>
  )
}

export default OrderFilters
