import { ProductTag } from "@medusajs/medusa"
import { omit } from "lodash"
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
import { useDiscountForm } from "../form/discount-form-context"
import { SelectableTable } from "./selectable-table"

const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

const Columns: Column<ProductTag>[] = [
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Name <SortingIcon size={16} />
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
  {
    Header: () => (
      <div className="flex items-center gap-1 justify-end">
        Products <SortingIcon size={16} />
      </div>
    ),
    accessor: "products",
    // TODO: for now
    Cell: ({ row: { original } }) => {
      return <div className="text-right text-grey-30">n/a</div>
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

  const { isLoading, count, product_tags } = useAdminProductTags(
    // TODO: omit for now since BD return 400 if "q" is present
    omit(params.queryObject, ["q"]),
    {
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedTags =
      product_tags?.filter((t) => values.includes(t.id)) || []

    setItems(selectedTags.map((t) => t.id))
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
            selectedIds={items}
            data={product_tags}
            columns={Columns}
            isLoading={isLoading}
            onChange={changed}
            renderRow={TagRow}
            renderHeaderGroup={TagHeader}
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
