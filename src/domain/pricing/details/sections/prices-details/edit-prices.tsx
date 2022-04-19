import { Product } from "@medusajs/medusa"
import { debounce } from "lodash"
import { useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import Tooltip from "../../../../../components/atoms/tooltip"
import Button from "../../../../../components/fundamentals/button"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import InfoIcon from "../../../../../components/fundamentals/icons/info-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import FocusModal from "../../../../../components/molecules/modal/focus-modal"
import useQueryFilters from "../../../../../hooks/use-query-filters"
import { Prices } from "../../../pricing-form/sections/prices"
import { merge } from "./utils"

const defaultQueryFilters = {
  limit: 50,
  offset: 0,
}

const EditPrices = ({ close, id }) => {
  const params = useQueryFilters(defaultQueryFilters)
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])
  const { products = [], isLoading } = useAdminPriceListProducts(
    id,
    params.queryObject
  )
  const handleSearch = (query: string) => {
    params.setQuery(query)
  }

  const debouncedSearch = React.useMemo(() => debounce(handleSearch, 300), [])

  const mergedProducts = merge(products, selectedProducts)

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button
            size="small"
            variant="ghost"
            onClick={close}
            className="border rounded-rounded"
          >
            Cancel
          </Button>
          <div className="gap-x-small flex">
            <Button
              onClick={close}
              size="small"
              variant="primary"
              className="rounded-rounded"
            >
              Save changes
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="flex justify-center mb-[25%]">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full pt-16">
            <h1 className="inter-xlarge-semibold">Edit prices</h1>
            <div className="mt-7">
              <div className="flex items-center gap-1.5">
                <h6 className="inter-large-semibold">Prices</h6>
                <Tooltip content="info tooltip">
                  <InfoIcon size={16} className="text-grey-40" />
                </Tooltip>
              </div>
              <span className="inter-base-regular text-grey-50">
                You will be able to override the prices for the products you add
                here
              </span>
            </div>
            <Prices
              products={mergedProducts}
              setProducts={setSelectedProducts}
              isLoading={isLoading}
              onSearch={debouncedSearch}
              onFileChosen={close}
              getVariantActions={VariantActions(id)}
            />
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

const VariantActions = (product: Product) => {
  return [
    {
      label: "Edit prices",
      icon: <EditIcon size={20} />,
      onClick: () => {
        // open grid ui
      },
    },
    {
      label: "Remove from list",
      icon: <TrashIcon size={20} />,
      onClick: () => {
        // missing core support
      },
      variant: "danger" as const,
    },
  ]
}

export default EditPrices
