import { AdminPostProductsProductReq } from "@medusajs/medusa"
import { navigate } from "gatsby"
import { useAdminDeleteProduct, useAdminUpdateProduct } from "medusa-react"
import useImperativeDialog from "../../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"

const useGeneralActions = (productId: string) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const updateProduct = useAdminUpdateProduct(productId)
  const deleteProduct = useAdminDeleteProduct(productId)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Product",
      text: "Are you sure you want to delete this product",
    })
    if (shouldDelete) {
      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification("Success", "Product deleted successfully", "success")
          navigate("/a/products/")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onUpdate = (
    payload: Partial<AdminPostProductsProductReq>,
    onSuccess: () => void
  ) => {
    updateProduct.mutate(
      // @ts-ignore TODO fix images being required
      payload,
      {
        onSuccess: () => {
          notification(
            "Success",
            "General information updated successfully",
            "success"
          )
          onSuccess()
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const onStatusChange = (currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    updateProduct.mutate(
      {
        // @ts-ignore TODO fix update type in API
        status: newStatus,
      },
      {
        onSuccess: () => {
          const pastTense = newStatus === "published" ? "published" : "drafted"
          notification(
            "Success",
            `Product ${pastTense} successfully`,
            "success"
          )
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error")
        },
      }
    )
  }

  return {
    onDelete,
    onStatusChange,
    onUpdate,
    updating: updateProduct.isLoading,
    deleting: deleteProduct.isLoading,
  }
}

export default useGeneralActions
