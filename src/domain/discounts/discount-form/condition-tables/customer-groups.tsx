import { CustomerGroup } from "@medusajs/medusa"
import { useAdminCustomerGroups } from "medusa-react"
import React, { useContext, useState } from "react"
import { Column, HeaderGroup, Row } from "react-table"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import SortingIcon from "../../../../components/fundamentals/icons/sorting-icon"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Table from "../../../../components/molecules/table"
import useQueryFilters from "../../../../hooks/use-query-filters"
import { useDiscountForm } from "../form/discount-form-context"
import { SelectableTable } from "./selectable-table"

const defaultQueryProps = {
  additionalFilters: { expand: "customers" },
  limit: 12,
  offset: 0,
}

const columns: Column<CustomerGroup>[] = [
  {
    Header: () => (
      <div className="flex items-center gap-1 min-w-[540px]">
        Title <SortingIcon size={16} />
      </div>
    ),
    accessor: "name",
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
      return <div className="text-right">{value}</div>
    },
  },
]

const CustomerGroupConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, conditions } = useDiscountForm()
  const [items, setItems] = useState(conditions.customer_groups?.items || [])

  const { isLoading, count, customer_groups } = useAdminCustomerGroups(
    params.queryObject,
    {
      // avoid UI flickering by keeping previous data
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedCustomerGroups =
      customer_groups?.filter((cg) => values.includes(cg.id)) || []

    setItems(
      selectedCustomerGroups.map((customer_group) => ({
        id: customer_group.id,
        label: customer_group.name,
      }))
    )
  }

  return (
    <>
      <Modal.Content isLargeModal={true}>
        {isLoading ? (
          <Spinner />
        ) : (
          <SelectableTable
            options={{
              enableSearch: true,
              immediateSearchFocus: true,
              searchPlaceholder: "Search groups...",
            }}
            resourceName="Customer groups"
            totalCount={count || 0}
            selectedIds={items.map((i) => i.id)}
            data={customer_groups}
            columns={columns}
            isLoading={isLoading}
            onChange={changed}
            renderRow={CustomerGroupsRow}
            renderHeaderGroup={CustomerGroupsHeader}
            {...params}
          />
        )}
      </Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="w-full flex justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              onClose()
              reset()
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              updateCondition({ type: "customer_groups", update: items })
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              updateCondition({ type: "customer_groups", update: items })
              onClose()
              reset()
            }}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

const CustomerGroupsHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<CustomerGroup>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell
          className="w-[100px]"
          {...col.getHeaderProps(col.getSortByToggleProps())}
        >
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

const CustomerGroupsRow = ({ row }: { row: Row<CustomerGroup> }) => {
  return (
    <Table.Row {...row.getRowProps()}>
      {row.cells.map((cell) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell")}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default CustomerGroupConditionSelector
