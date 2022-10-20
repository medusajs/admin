import React, { useContext } from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import { getTitle } from "../../../new/discount-form/edit-conditions-modal"
import { EditConditionProvider } from "./edit-condition-provider"
import ProductConditionsTable from "./add-condition-resources/products/product-conditions-table"
import ProductCollectionsConditionsTable from "./add-condition-resources/collections/collections-conditions-table"
import ProductTypesConditionsTable from "./add-condition-resources/product-types/type-conditions-table"
import ProductTagsConditionsTable from "./add-condition-resources/tags/tags-conditions-table"
import CustomerGroupsConditionsTable from "./add-condition-resources/customer-groups/customer-groups-conditions-table"

type Props = {
  open: boolean
  condition?: any
  discount?: any
  onClose: () => void
  onSave: (conditions: any[]) => void
}

/**
 * Re-usable Sales Channels Modal, used for adding and editing sales channels both when creating a new product and editing an existing product.
 */
const EditConditionsModal = ({ open, condition, discount, onClose }: Props) => {
  const context = useContext(LayeredModalContext)

  const renderModalContext = () => {
    switch (condition.type) {
      case "products":
        return <ProductConditionsTable />
      case "product_collections":
        return <ProductCollectionsConditionsTable />
      case "product_types":
        return <ProductTypesConditionsTable />
      case "product_tags":
        return <ProductTagsConditionsTable />
      case "customer_groups":
        return <CustomerGroupsConditionsTable />
    }
  }

  return (
    <EditConditionProvider condition={condition} discount={discount}>
      <LayeredModal open={open} handleClose={onClose} context={context}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold">
              Existing {getTitle(condition?.type)} in Condition
            </h1>
          </Modal.Header>
          {renderModalContext()}
          <Modal.Footer>
            <div className="flex items-center justify-end w-full">
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </LayeredModal>
    </EditConditionProvider>
  )
}

export default EditConditionsModal
