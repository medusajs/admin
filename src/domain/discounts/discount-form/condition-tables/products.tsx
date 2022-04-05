import React, { useContext, useMemo, useState } from "react"
import { useAdminVariants } from "medusa-react"
import { SelectableTable } from "./selectable-table"
import Modal from "../../../../components/molecules/modal"
import Button from "../../../../components/fundamentals/button"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import StatusIndicator from "../../../../components/fundamentals/status-indicator"
import Spinner from "../../../../components/atoms/spinner"
import { ProductVariant } from "@medusajs/medusa"
import { useDebounce } from "../../../../hooks/use-debounce"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"

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

// TODO: remove items and save conditions and use "useDiscountForm" when implemented
const ProductConditionSelector = ({ items, saveCondition, onClose }) => {
  const PAGE_SIZE = 12
  const [query, setQuery] = useState("")
  const debouncedSearchTerm = useDebounce(query, 500)

  const { pop, reset } = useContext(LayeredModalContext)

  const [pagination, setPagination] = useState({
    limit: PAGE_SIZE,
    offset: 0,
  })

  const { isLoading, count, variants } = useAdminVariants({
    ...pagination,
    q: debouncedSearchTerm,
  })

  const changed = (values) => {
    console.log(values)
  }

  const columns = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          console.log(original)
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.product.thumbnail ? (
                  <img
                    src={original.product.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full rounded-soft bg-grey-10">
                    <ImagePlaceholder size={16} />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.product.title}</span>
                {original.title}
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
            title={`${original.product.status
              .charAt(0)
              .toUpperCase()}${original.product.status.slice(1)}`}
            variant={getProductStatusVariant(original.product.status)}
          />
        ),
      },
      {
        Header: <div className="text-right">In Stock</div>,
        accessor: "inventory_quantity",
        Cell: ({ row: { original } }) => (
          <div className="text-right">{original.inventory_quantity}</div>
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
            showSearch={true}
            onSearch={setQuery}
            label="Select Products"
            objectName="Products"
            totalCount={count}
            pagination={pagination}
            onPaginationChange={setPagination}
            selectedIds={items}
            data={variants as ProductVariant[]}
            columns={columns}
            isLoading={isLoading}
            onChange={changed}
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
              saveCondition(items)
              pop()
            }}
          >
            Save and add more
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={(e) => {
              saveCondition(items)
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
