import { AdminPostProductsProductReq } from "@medusajs/medusa"
import { navigate } from "gatsby"
import {
  useAdminCollection,
  useAdminDeleteCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

const useEditProductCollectionActions = (collectionId: string) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const getProductCollection = useAdminCollection(collectionId, {
    enabled: collectionId.length > 0,
  })
  const deleteCollection = useAdminDeleteCollection(collectionId)
  const updateCollection = useAdminUpdateCollection(collectionId)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Product",
      text: "Are you sure you want to delete this product collection?",
    })
    if (shouldDelete) {
      deleteCollection.mutate(undefined, {
        onSuccess: () => {
          notification(
            "Success",
            "Product collection deleted successfully",
            "success"
          )
          navigate("/a/collections")
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
    successMessage = "Product collection was successfully updated"
  ) => {
    updateCollection.mutate(
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

  const onStatusChange = (currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    updateCollection.mutate(
      {
        // @ts-ignore TODO fix update type in API
        status: newStatus,
      },
      {
        onSuccess: () => {
          const pastTense = newStatus === "published" ? "published" : "drafted"
          notification(
            "Success",
            `Product collection ${pastTense} successfully`,
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
    getProduct: getProductCollection,
    onDelete,
    onStatusChange,
    onUpdate,
    updating: updateCollection.isLoading,
    deleting: deleteCollection.isLoading,
  }
}

export default useEditProductCollectionActions
