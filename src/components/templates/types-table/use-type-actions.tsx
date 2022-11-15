import { navigate } from "gatsby"
import { useAdminDeleteProductType } from "medusa-react"
import * as React from "react"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"

const useTypeActions = (product_type) => {
  const dialog = useImperativeDialog()
  const deleteProductType = useAdminDeleteProductType(product_type?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Type",
      text: "Are you sure you want to delete this type?",
    })

    if (shouldDelete) {
      deleteProductType.mutate()
    }
  }

  const getActions = (coll): ActionType[] => [
    {
      label: "Edit",
      onClick: () => navigate(`/a/types/${coll.id}`),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useTypeActions
