import { ProductCollection } from "@medusajs/medusa"
import { useAdminCollections } from "medusa-react"
import React, { useContext, useMemo, useState } from "react"
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

const CollectionRow = ({ row }: { row: Row<ProductCollection> }) => {
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

const CollectionsHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<ProductCollection>
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

const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

const CollectionConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, conditions } = useDiscountForm()
  const [items, setItems] = useState(
    conditions.product_collections?.items || []
  )

  const { isLoading, count, collections } = useAdminCollections(
    params.queryObject,
    {
      // avoid UI flickering by keeping previous data
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedProducts =
      collections?.filter((collections) => values.includes(collections.id)) ||
      []

    setItems(selectedProducts.map((product) => product.id))
  }

  const columns = useMemo<Column<ProductCollection>[]>(() => {
    return [
      {
        Header: () => (
          <div className="flex items-center gap-1 min-w-[546px]">
            Title <SortingIcon size={16} />
          </div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return <span>{original.title}</span>
        },
      },
      {
        Header: () => (
          <div className="flex justify-end items-center gap-1">
            Products <SortingIcon size={16} />
          </div>
        ),
        id: "products",
        accessor: (row) => row.products.length,
        Cell: ({ cell: { value } }) => {
          return <div className="text-right">{value}</div>
        },
      },
    ]
  }, [])

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
              searchPlaceholder: "Search by title...",
            }}
            resourceName="Collections"
            totalCount={count || 0}
            selectedIds={items?.map((c) => c)}
            data={collections}
            columns={columns}
            isLoading={isLoading}
            onChange={changed}
            renderRow={CollectionRow}
            renderHeaderGroup={CollectionsHeader}
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
              updateCondition({ type: "product_collections", update: items })
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={(e) => {
              updateCondition({ type: "product_collections", update: items })
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

export default CollectionConditionSelector
