import clsx from "clsx"
import React, { useEffect, useState } from "react"
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

const OrderFilters = ({ filters, submitFilters, clearFilters }) => {
  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  useEffect(() => {
    setTempState(filters)
  }, [filters])

  const onSubmit = () => {
    submitFilters(tempState)
  }

  const onClear = () => {
    clearFilters()
  }

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

  const numberOfFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value?.open) {
        acc = acc + 1
      }
      return acc
    },
    0
  )

  return (
    <div className="flex space-x-1">
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
          filters={tempState.status.filter}
          open={tempState.status.open}
          setFilter={(val) => setSingleFilter("status", val)}
        />
        <FilterDropdownItem
          filterTitle="Payment Status"
          options={paymentFilters}
          filters={tempState.payment.filter}
          open={tempState.payment.open}
          setFilter={(val) => setSingleFilter("payment", val)}
        />
        <FilterDropdownItem
          filterTitle="Fulfillment Status"
          options={fulfillmentFilters}
          filters={tempState.fulfillment.filter}
          open={tempState.fulfillment.open}
          setFilter={(val) => setSingleFilter("fulfillment", val)}
        />
        <FilterDropdownItem
          filterTitle="Date"
          options={dateFilters}
          filters={tempState.date.filter}
          open={tempState.date.open}
          setFilter={(val) => setSingleFilter("date", val)}
        />
        <SaveFilterItem
          saveFilter={console.log}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      <div className={clsx("flex items-center space-x-1 cursor-pointer")}>
        <div className="flex items-center rounded-rounded bg-grey-5 border border-grey-20 inter-small-regular px-2 h-6 text-grey-50">
          Complete
        </div>
      </div>
      <div className={clsx("flex items-center space-x-1 cursor-pointer")}>
        <div className="flex items-center rounded-rounded bg-grey-5 border border-grey-20 inter-small-regular px-2 h-6 text-grey-50">
          Incomplete
        </div>
      </div>
    </div>
  )
}

export default OrderFilters
