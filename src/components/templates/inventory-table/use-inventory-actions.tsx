import { navigate } from "gatsby"
import * as React from "react"
import EditIcon from "../../fundamentals/icons/edit-icon"
import { ActionType } from "../../molecules/actionables"

const useProductActions = (inventoryItem) => {
  const getActions = (): ActionType[] => [
    {
      label: "Go to variant",
      onClick: () =>
        navigate(`/a/products/${inventoryItem.variant.product_id}`),
      icon: <EditIcon size={20} />,
    },
    {},
  ]

  return {
    getActions,
  }
}

export default useProductActions
