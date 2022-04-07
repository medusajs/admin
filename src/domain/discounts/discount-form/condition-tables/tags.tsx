import { ProductTag } from "@medusajs/medusa"
import { useAdminProductTags } from "medusa-react"
import React, { useContext, useState } from "react"
import { Column, Row } from "react-table"

import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Table from "../../../../components/molecules/table"
import useQueryFilters from "../../../../hooks/use-query-filters"
import { useDiscountForm } from "../form/discount-form-context"
import { SelectableTable } from "./selectable-table"

const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

const Columns: Column<ProductTag>[] = [
  {
    Header: "Name",
    accessor: "value",
    Cell: ({ row: { original } }) => {
      return (
        <div>
          <span className="bg-grey-10 px-2 py-0.5 rounded-rounded">
            #{original.value}
          </span>
        </div>
      )
    },
  },
]

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

  const [items, setItems] = useState(conditions.product_tags || [])

  const { isLoading, count, product_tags } = useAdminProductTags(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedTags =
      product_tags?.filter((t) => values.includes(t.id)) || []

    setItems(
      selectedTags.map((t) => ({
        id: t.id,
        value: t.value,
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
              searchPlaceholder: "Search product tags...",
            }}
            resourceName="Tags"
            totalCount={count || 0}
            selectedIds={items?.map((c) => c.id)}
            data={product_tags}
            columns={Columns}
            isLoading={isLoading}
            onChange={changed}
            renderRow={TagRow}
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
            onClick={(e) => {
              updateCondition({ type: "product_tags", update: items })
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={(e) => {
              updateCondition({ type: "product_tags", update: items })
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
