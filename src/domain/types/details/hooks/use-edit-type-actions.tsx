import { AdminPostProductsProductReq } from "@medusajs/medusa"
import { navigate } from "gatsby"
import {
  useAdminDeleteProductType,
  useAdminProductType,
  useAdminUpdateProductType,
} from "medusa-react"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

const useEditTypeActions = (typeId: string) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const getType = useAdminProductType(typeId)
  const updateProduct = useAdminUpdateProductType(typeId)
  const deleteProduct = useAdminDeleteProductType(typeId)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Type",
      text: "Are you sure you want to delete this type",
    })
    if (shouldDelete) {
      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification("Success", "Type deleted successfully", "success")
          navigate("/a/types/")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onUpdate = (
    payload: Partial<AdminPostProductsProductReq>,
    onSuccess: () => void,
    successMessage = "Type was successfully updated"
  ) => {
    updateProduct.mutate(
      // @ts-ignore TODO fix images being required
      payload,
      {
        onSuccess: () => {
          notification("Success", successMessage, "success")
          onSuccess()
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  return {
    getProduct: getType,
    onDelete,
    onUpdate,
    updating: updateProduct.isLoading,
    deleting: deleteProduct.isLoading,
  }
}

export default useEditTypeActions
