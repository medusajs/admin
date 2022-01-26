import clsx from "clsx"
import React, { useState } from "react"
import FilterDropdownItem from "../../../components/filter-dropdown-item/index"
import ChevronDownIcon from "../../../components/fundamentals/icons/chevron-down"
import FilterDropdownContainer from "../../../components/molecules/filter-dropdown/container"
import SaveFilterItem from "../../../components/molecules/filter-dropdown/save-field"

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

const OrderFilters = ({
  setStatusFilter,
  statusFilter,
  setFulfillmentFilter,
  fulfillmentFilter,
  setPaymentFilter,
  paymentFilter,
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
  ].reduce((prev, curr) => prev + (curr.open ? 1 : 0), 0)

  return (
    <FilterDropdownContainer
      submitFilters={onSubmit}
      clearFilters={onClear}
      triggerElement={
        <div
          className={clsx(
            "inter-small-regular text-grey-50 flex items-center pl-1.5 pr-0.5 rounded"
          )}
        >
          <div className="flex items-center">
            Custom filter:
            <div className="text-grey-40 ml-0.5 flex px-1.5 active:bg-grey-5 hover:bg-grey-5 cursor-pointer items-center rounded">
              <span className="text-violet-60 inter-small-semibold">
                {numberOfFilters ? numberOfFilters : ""}
              </span>
              <ChevronDownIcon size={16} />
            </div>
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
      <SaveFilterItem saveFilter={console.log} name={name} setName={setName} />
    </FilterDropdownContainer>
  )
}

export default OrderFilters
