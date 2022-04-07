import { useAdminProducts } from "medusa-react"
import React, { useContext, useMemo, useState } from "react"
import { Row } from "react-table"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import StatusIndicator from "../../../../components/fundamentals/status-indicator"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Table from "../../../../components/molecules/table"
import useQueryFilters from "../../../../hooks/use-query-filters"
import { useDiscountForm } from "../form/discount-form-context"
import { SelectableTable } from "./selectable-table"

const getProductStatusVariant = (status) => {
  switch (status) {
    case "proposed":
      return "warning"
    case "published":
      return "success"
    case "rejected":
      return "danger"
    case "draft":
    default:
      return "default"
  }
}

const ProductRow = ({ row }: { row: Row }) => {
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
const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

// TODO: remove items and save conditions and use "useDiscountForm" when implemented
const ProductConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, conditions } = useDiscountForm()
  const [items, setItems] = useState(conditions.products || [])

  const { isLoading, count, products } = useAdminProducts(params.queryObject, {
    // avoid UI flickering by keeping previous data
    keepPreviousData: true,
  })

  const changed = (values: string[]) => {
    const selectedProducts =
      products?.filter((product) => values.includes(product.id)) || []

    setItems(
      selectedProducts.map((product) => ({
        id: product.id,
        title: product.title,
      }))
    )
  }

  const columns = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full rounded-soft bg-grey-10">
                    <ImagePlaceholder size={16} />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.title}</span>
              </div>
            </div>
          )
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <StatusIndicator
            title={`${original.status
              .charAt(0)
              .toUpperCase()}${original.status.slice(1)}`}
            variant={getProductStatusVariant(original.status)}
          />
        ),
      },
      {
        Header: <div className="text-right">Variants</div>,
        accessor: "variants",
        Cell: ({ row: { original } }) => (
          <div className="text-right">{original.variants.length}</div>
        ),
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
            selectedIds={items?.map((c) => c.id)}
            data={products}
            columns={columns}
            isLoading={isLoading}
            onChange={changed}
            renderRow={ProductRow}
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
              updateCondition({ type: "products", update: items })
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={(e) => {
              updateCondition({ type: "products", update: items })
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

export default ProductConditionSelector
