import React, { useEffect, useState } from "react"
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

export const SalesChannelTableActions: React.FC<any> = ({
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

function SalesChannelAvailableProductsModal(
  props: SalesChannelAvailableProductsModalProps
) {
  const { handleClose } = props
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])

  const modalContext = React.useContext(LayeredModalContext)

  const notification = useNotification()

  const {
    mutate: deleteProductsFromSalesChannel,
  } = useAdminDeleteProductsFromSalesChannel(props.salesChannel.id)

  const {
    mutate: addProductsToSalesChannel,
  } = useAdminAddProductsToSalesChannel(props.salesChannel.id)

  const filters = useProductFilters()
  const params = useQueryFilters(defaultQueryProps)

  const { products, count } = useAdminProducts({
    ...params.queryObject,
    ...filters.queryObject,
    sales_channel_id: [props.salesChannel.id],
  })

  useEffect(() => {
    setAvailableProducts(products)
  }, [products])

  const onDeselect = () => {
    setSelectedRowIds([])
    // tableState.toggleAllRowsSelected(false)
  }

  const onAddToAvailable = (selected) => {
    setAvailableProducts([...availableProducts, ...selected])
    // tableState.toggleAllRowsSelected(false)
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
    const initialIds = products?.map((p) => p.id) as string[]
    const selectedIds = availableProducts.map((p) => p.id)

    const toAdd = difference(selectedIds, initialIds)
    const toRemove = difference(initialIds, selectedIds)

    addProductsToSalesChannel({ product_ids: toAdd.map((id) => ({ id })) })
    deleteProductsFromSalesChannel({
      product_ids: toRemove.map((id) => ({ id })),
    })

    handleClose()
  }

  // const { mutate: addProductsBatch } = useAdminAddProductsToSalesChannel(
  //   salesChannel.id
  // )

  // const handleSubmit = () => {
  //   addProductsBatch({ product_ids: selectedRowIds.map((i) => ({ id: i })) })
  //   handleClose()
  //   notification(
  //     "Success",
  //     "Products successfully added to the sales channel",
  //     "success"
  //   )
  // }

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
                availableProductIds={availableProducts.map((sc) => sc.id)}
                onAddToAvailable={onAddToAvailable}
                onDeselect={onDeselect}
                onRemove={onRemove}
                addModalScreen={addModalScreen}
              />
            }
            products={availableProducts || []}
            count={count}
            selectedRowIds={selectedRowIds}
            setSelectedRowIds={setSelectedRowIds}
            productFilters={filters}
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
