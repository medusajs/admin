import { ProductType } from "@medusajs/medusa"
import { useAdminProductTypes } from "medusa-react"
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

const TypeRow = ({ row }: { row: Row<ProductType> }) => {
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

const TypesHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<ProductType>
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

// TODO: remove items and save conditions and use "useDiscountForm" when implemented
const TypeConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, conditions } = useDiscountForm()
  const [items, setItems] = useState(conditions.products?.items || [])

  const { isLoading, count, product_types } = useAdminProductTypes(
    params.queryObject,
    {
      // avoid UI flickering by keeping previous data
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedTypes =
      product_types?.filter((type) => values.includes(type.id)) || []

    setItems(selectedTypes.map((type) => type.id))
  }

  const columns = useMemo<Column<ProductType>[]>(() => {
    return [
      {
        Header: () => (
          <div className="flex items-center gap-1 min-w-[626px]">
            Title <SortingIcon size={16} />
          </div>
        ),
        accessor: "value",
        Cell: ({ row: { original } }) => {
          return <span>{original.value}</span>
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
              searchPlaceholder: "Search products...",
            }}
            resourceName="Products"
            totalCount={count || 0}
            selectedIds={items?.map((c) => c)}
            data={product_types}
            columns={columns}
            isLoading={isLoading}
            onChange={changed}
            renderRow={TypeRow}
            renderHeaderGroup={TypesHeader}
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
              updateCondition({ type: "product_types", update: items })
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={(e) => {
              updateCondition({ type: "product_types", update: items })
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

export default TypeConditionSelector
