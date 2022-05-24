import { ProductTag } from "@medusajs/medusa"
import { useAdminProductTags } from "medusa-react"
import React, { useContext, useState } from "react"
import { Column, HeaderGroup, Row } from "react-table"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import SortingIcon from "../../../../components/fundamentals/icons/sorting-icon"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Table from "../../../../components/molecules/table"
import useQueryFilters from "../../../../hooks/use-query-filters"
import { DiscountConditionOperator } from "../../types"
import { useDiscountForm } from "../form/discount-form-context"
import ConditionOperator from "./condition-operator"
import { SelectableTable } from "./selectable-table"

const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

const Columns: Column<ProductTag>[] = [
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Tag <SortingIcon size={16} />
      </div>
    ),
    accessor: "value",
    Cell: ({ row: { original } }) => {
      return (
        <div className="w-[220px]">
          <span className="bg-grey-10 px-2 py-0.5 rounded-rounded">
            #{original.value}
          </span>
        </div>
      )
    },
  },
]

const TagHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<ProductTag>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell
          {...col.getHeaderProps(col.getSortByToggleProps())}
          className="w-[20px]"
        >
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

const TagRow = ({ row }: { row: Row<ProductTag> }) => {
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

const TagConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, conditions } = useDiscountForm()

  const [items, setItems] = useState(conditions.product_tags?.items || [])
  const [operator, setOperator] = useState<DiscountConditionOperator>(
    conditions.product_tags.operator
  )

  const { isLoading, count, product_tags } = useAdminProductTags(
    // TODO: omit for now since BD return 400 if "q" is present
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedTags =
      product_tags?.filter((t) => values.includes(t.id)) || []

    setItems(selectedTags.map((t) => ({ id: t.id, label: t.value })))
  }

  return (
    <>
      <Modal.Content isLargeModal={true}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ConditionOperator value={operator} onChange={setOperator} />
            <SelectableTable
              options={{
                enableSearch: true,
                immediateSearchFocus: true,
                searchPlaceholder: "Search by tag...",
              }}
              resourceName="Tags"
              totalCount={count || 0}
              selectedIds={items.map((i) => i.id)}
              data={product_tags}
              columns={Columns}
              isLoading={isLoading}
              onChange={changed}
              renderRow={TagRow}
              renderHeaderGroup={TagHeader}
              {...params}
            />
          </>
        )}
      </Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="w-full flex justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
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
              updateCondition({ type: "product_tags", items: items, operator })
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              updateCondition({ type: "product_tags", items: items, operator })
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

export default TagConditionSelector
