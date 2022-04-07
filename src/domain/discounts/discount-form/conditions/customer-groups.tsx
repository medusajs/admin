import { useAdminCustomerGroups } from "medusa-react"
import * as React from "react"
import { Column } from "react-table"
import Button from "../../../../components/fundamentals/button"
import SortingIcon from "../../../../components/fundamentals/icons/sorting-icon"
import { CustomerGroupsTable } from "../../../../components/templates/customer-group-table/customer-groups-table"
import { useDebounce } from "../../../../hooks/use-debounce"
import useQueryFilters from "../../../../hooks/use-query-filters"
import { useDiscountForm } from "../form/discount-form-context"
import { SelectableTable } from "./selectable-table"

const columns = [
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Title <SortingIcon size={16} />
      </div>
    ),
    accessor: "name",
  },
  {
    Header: () => <div className="min-w-[200px]"></div>,
    accessor: "col-1",
  },
  {
    Header: () => (
      <div className="flex justify-end items-center gap-1">
        Members <SortingIcon size={16} />
      </div>
    ),
    id: "members",
    accessor: (r) => r.customers?.length,
    Cell: ({ cell: { value } }) => {
      console.log({ value })
      return <div className="text-right">{value}</div>
    },
  },
]

const CustomerGroupsConditions = () => {
  const [items, setItems] = React.useState([])
  const x = useDiscountForm()

  const PAGE_SIZE = 12

  const [pagination, setPagination] = React.useState({
    limit: PAGE_SIZE,
    offset: 0,
  })
  const [query, setQuery] = React.useState("")

  const debouncedSearchTerm = useDebounce(query, 500)

  const { customer_groups, isLoading, count = 0 } = useAdminCustomerGroups({
    q: debouncedSearchTerm,
    expand: "customers",
    ...pagination,
  })

  const handleSearch = (q) => {
    setPagination((p) => {
      return {
        ...p,
        offset: 0,
      }
    })
    setQuery(q)
  }

  console.log({ items })

  return (
    <ConditionalModalContainer>
      <SelectableTable
        objectName="Customer Group"
        totalCount={count}
        pagination={pagination}
        onPaginationChange={setPagination}
        selectedIds={items}
        data={customer_groups}
        columns={columns}
        isLoading={isLoading}
        onSearch={handleSearch}
        onChange={(v) => setItems(v)}
      />
    </ConditionalModalContainer>
  )
}

const defaultQueryProps = {
  additionalFilters: { expand: "customers" },
  limit: 15,
  offset: 0,
}

const CustomerGroupsTableContainer = () => {
  const params = useQueryFilters(defaultQueryProps)

  const { customer_groups, isLoading, count = 0 } = useAdminCustomerGroups(
    params.queryObject
  )

  const showPlaceholder = !customer_groups?.length && !params.queryObject.q

  if (showPlaceholder) {
    if (!isLoading) {
      return <span>loading</span>
    } else {
      return null
    }
  }

  return (
    <CustomerGroupsTable
      count={count}
      customerGroups={customer_groups || []}
      columns={columns}
      {...params}
    />
  )
}

const ConditionalModalContainer = ({ children }) => {
  return (
    <div className="min-w-[760px]">
      <div className="pt-8 px-8 pb-6 border-b border-grey-20">{children}</div>
      <div className="pt-4 pb-6 px-8 flex justify-end gap-2">
        <Button
          variant="secondary"
          className="text-small rounded-rounded"
          size="small"
          // onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size="small"
          className="text-small rounded-rounded"
          variant="primary"
          // onClick={onNext}
        >
          Save and add another
        </Button>
        <Button
          size="small"
          className="text-small rounded-rounded"
          variant="primary"
          // onClick={onNext}
        >
          Save and close
        </Button>
      </div>
    </div>
  )
}

export default CustomerGroupsConditions
