import React, { useState } from "react"

import { Product } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"

import Modal from "../../../components/molecules/modal"
import { ProductTable } from "../tables/product"
import Button from "../../../components/fundamentals/button"
import useQueryFilters from "../../../hooks/use-query-filters"
import { useProductFilters } from "../../../components/templates/product-table/use-filter-tabs"

const DEFAULT_PAGE_SIZE = 12

/**
 * Default filtering config for querying products endpoint.
 */
const defaultQueryProps = {
  additionalFilters: {
    expand: "collection,sales_channels",
    fields: "id,title,type,thumbnail,status",
  },
  limit: DEFAULT_PAGE_SIZE,
  offset: 0,
}

type AddProductsModalScreenProps = {
  handleClose: () => void
  onAvailableProductsChange: (ids: string[]) => void
}

export function AddProductsModalScreen({
  handleClose,
  onAvailableProductsChange,
}: AddProductsModalScreenProps) {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const filters = useProductFilters()
  const params = useQueryFilters(defaultQueryProps)

  const { products, count } = useAdminProducts({
    ...params.queryObject,
    ...filters.queryObject,
  })

  const onAdd = () => {
    onAvailableProductsChange(selectedRowIds)
  }

  return (
    <>
      <Modal.Content isLargeModal>
        <ProductTable
          isAddTable
          count={count || 0}
          products={(products as Product[]) || []}
          selectedRowIds={selectedRowIds}
          setSelectedRowIds={setSelectedRowIds}
          productFilters={filters}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={handleClose}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="small"
            className="w-[128px]"
            onClick={() => {
              onAdd()
              handleClose()
            }}
          >
            Add and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}
