import React, { useEffect, useRef, useState } from "react"
import { difference } from "lodash"
import clsx from "clsx"

import { Product, SalesChannel } from "@medusajs/medusa"

import useNotification from "../../../hooks/use-notification"
import { useProductFilters } from "../../../components/templates/product-table/use-filter-tabs"
import useQueryFilters from "../../../hooks/use-query-filters"
import {
  useAdminAddProductsToSalesChannel,
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import { ProductTable } from "../tables/product"
import { AddProductsModalScreen } from "./add-products"

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

type SalesChannelTableActionsProps = {
  numberOfSelectedRows: number
  onDeselect: () => void
  onRemove: () => void
  onAddToAvailable: (sc: SalesChannel) => void
  addModalScreen: {
    title: string
    onBack: () => void
    view: React.ReactElement
  }
}

export const SalesChannelTableActions: React.FC<SalesChannelTableActionsProps> = ({
  numberOfSelectedRows,
  onDeselect,
  onRemove,
  addModalScreen,
}) => {
  const { push } = React.useContext(LayeredModalContext)

  const showAddChannels = !!numberOfSelectedRows

  const classes = {
    "translate-y-[-42px]": !showAddChannels,
    "translate-y-[0px]": showAddChannels,
  }

  return (
    <div className="flex space-x-xsmall h-[34px] overflow-hidden">
      <div className={clsx("transition-all duration-200", classes)}>
        <div className="divide-x flex items-center h-[34px] mb-2">
          <span className="mr-3 inter-small-regular text-grey-50">
            {numberOfSelectedRows} selected
          </span>
          <div className="flex space-x-xsmall pl-3">
            <Button
              onClick={onDeselect}
              size="small"
              variant="ghost"
              className="border border-grey-20"
            >
              Deselect
            </Button>
            <Button
              onClick={onRemove}
              size="small"
              variant="ghost"
              className="border border-grey-20 text-rose-50"
            >
              Remove
            </Button>
          </div>
        </div>
        <div className="flex justify-end h-[34px]">
          <Button
            size="small"
            variant="ghost"
            className="border border-grey-20"
            onClick={() => push(addModalScreen)}
          >
            <PlusIcon size={20} /> Add Products
          </Button>
        </div>
      </div>
    </div>
  )
}

type SalesChannelAvailableProductsModalProps = {
  handleClose: () => void
  salesChannel: SalesChannel
  products: Product[]
  addChannelModalScreen: {
    title: string
    onBack: () => void
    view: React.ReactElement
  }
}

const LIMIT = 5

function useAvailableProducts(
  salesChannelId: string,
  newProductsIds: string[]
) {
  const filters = useProductFilters()
  // const params = useQueryFilters(defaultQueryProps)

  const [offset, setOffset] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)

  const {
    products: salesChannelProducts = [],
    count: salesChannelProductsCount = 0,
  } = useAdminProducts({
    offset: offset,
    limit: LIMIT,
    ...filters.queryObject,
    sales_channel_id: [salesChannelId],
  })

  console.log(
    offset,
    salesChannelProductsCount,
    salesChannelProductsCount - offset
  )
  const {
    products: addedProducts = [],
    count: addedProductsCount = 0,
  } = useAdminProducts(
    {
      limit: LIMIT,
      offset: salesChannelProductsCount - offset,
      id: newProductsIds,
      ...filters.queryObject,
    },
    {
      enabled:
        !!newProductsIds?.length && salesChannelProductsCount - offset > 0,
    }
  )

  return {
    products: [...addedProducts, ...salesChannelProducts],
    count: salesChannelProductsCount + addedProductsCount,
    filters,
    params: {
      queryObject: {
        limit: LIMIT,
        offset,
      },
      currentPage: pageIndex + 1,
      pageCount: (salesChannelProductsCount + addedProductsCount) / LIMIT,
      nextPage: () => {
        setOffset((o) => o + LIMIT)
        setPageIndex((i) => i + 1)
      },
      prevPage: () => {
        setOffset((o) => o - LIMIT)
        setPageIndex((i) => i - 1)
      },
      paginate(num: number) {
        if (num > 0) setPageIndex((i) => i + 1)
        if (num < 0) setPageIndex((i) => i - 1)
      },
      hasNext: () => offset < salesChannelProductsCount + addedProductsCount,
      hasPrev: () => pageIndex > 0,
    },
  }
}

function SalesChannelAvailableProductsModal(
  props: SalesChannelAvailableProductsModalProps
) {
  const tableRef = useRef(null)
  const { handleClose } = props
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [availableProducts, setAvailableProducts] = useState<string[]>([])

  const modalContext = React.useContext(LayeredModalContext)

  const notification = useNotification()

  const {
    mutate: deleteProductsFromSalesChannel,
  } = useAdminDeleteProductsFromSalesChannel(props.salesChannel.id)

  const {
    mutate: addProductsToSalesChannel,
  } = useAdminAddProductsToSalesChannel(props.salesChannel.id)

  const { products, count, filters, params } = useAvailableProducts(
    props.salesChannel.id,
    availableProducts
  )

  const onDeselect = () => {
    setSelectedRowIds([])
    tableRef.current.toggleAllRowsSelected(false)
  }

  const onAddToAvailable = (selected: string[]) => {
    setAvailableProducts([...new Set([...availableProducts, ...selected])])
    tableRef.current.toggleAllRowsSelected(false)
  }

  const onRemove = () => {
    const remaining = availableProducts.filter(
      (ch) => !selectedRowIds.includes(ch.id)
    )
    setAvailableProducts(remaining)
    onDeselect()
  }

  const addModalScreen = {
    title: "Add Products",
    onBack: modalContext.pop,
    view: (
      <AddProductsModalScreen
        handleClose={modalContext.pop}
        onAvailableProductsChange={onAddToAvailable}
      />
    ),
  }

  const handleSubmit = () => {
    addProductsToSalesChannel(
      { product_ids: availableProducts.map((id) => ({ id })) },
      {
        onSuccess: () =>
          notification(
            "Success",
            "Successfully added products to the sales channel",
            "success"
          ),
        onError: () =>
          notification(
            "Error",
            "Unable to add products to the sales channel",
            "error"
          ),
      }
    )

    // TODO: maintain a list for removal because now if a products isn't found in the response for the sales channel
    // it is removed but the issue is that this response is paginated

    // deleteProductsFromSalesChannel(
    //   {
    //     product_ids: toRemove.map((id) => ({ id })),
    //   },
    //   {
    //     onSuccess: () =>
    //       notification(
    //         "Success",
    //         "Successfully removed products from the sales channel",
    //         "success"
    //       ),
    //     onError: () =>
    //       notification(
    //         "Error",
    //         "Unable to remove products from the sales channel",
    //         "error"
    //       ),
    //   }
    // )

    handleClose()
  }

  return (
    <LayeredModal context={modalContext} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Available products</span>
        </Modal.Header>
        <Modal.Content>
          <ProductTable
            tableActions={
              <SalesChannelTableActions
                numberOfSelectedRows={selectedRowIds.length}
                onAddToAvailable={onAddToAvailable}
                onDeselect={onDeselect}
                onRemove={onRemove}
                addModalScreen={addModalScreen}
              />
            }
            count={count}
            products={products}
            selectedRowIds={selectedRowIds}
            setSelectedRowIds={setSelectedRowIds}
            productFilters={filters}
            ref={tableRef}
            {...params}
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export { SalesChannelAvailableProductsModal }
