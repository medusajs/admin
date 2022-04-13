import { useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import Tooltip from "../../../../../components/atoms/tooltip"
import Button from "../../../../../components/fundamentals/button"
import InfoIcon from "../../../../../components/fundamentals/icons/info-icon"
import SearchIcon from "../../../../../components/fundamentals/icons/search-icon"
import InputField from "../../../../../components/molecules/input"
import FocusModal from "../../../../../components/molecules/modal/focus-modal"
import ProductVariantTree from "../../../../../components/organisms/product-variant-tree"

const EditPrices = ({ close, id }) => {
  const { products = [], isLoading, count = 0 } = useAdminPriceListProducts(id)
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
            <div className="mt-6">
              <SearchBar />
              <div className="mt-2">
                {products.map((product) => (
                  <ProductVariantTree product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

const SearchBar = () => {
  return (
    <>
      <InputField
        placeholder="Search by name or SKU..."
        startAdornment={<SearchIcon />}
      />
    </>
  )
}

export default EditPrices
