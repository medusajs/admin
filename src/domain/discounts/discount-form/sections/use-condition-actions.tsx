import React, { useContext } from "react"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import ProductConditionSelector from "../condition-tables/products"
import { useDiscountForm } from "../form/discount-form-context"

const useConditionActions = () => {
  const layeredModalContext = useContext(LayeredModalContext)

  const { updateCondition } = useDiscountForm()

  const getActions = (conditionType) => {
    return [
      {
        label: "Edit condition",
        variant: "normal" as const,
        icon: <EditIcon size={20} />,
        onClick: () => {
          layeredModalContext.push({
            title: "Product",
            onBack: () => layeredModalContext.pop(),
            view: <ProductConditionSelector onClose={() => close()} />,
          })
        },
      },
      {
        label: "Delete condition",
        variant: "danger" as const,
        onClick: () => {
          updateCondition({ type: conditionType, update: null })
        },
        icon: <TrashIcon size={20} />,
      },
    ]
  }

  return { getActions }
}

export default useConditionActions
