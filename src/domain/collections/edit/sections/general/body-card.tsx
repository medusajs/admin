import React, { useEffect, useState } from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import Spinner from "../../../../../components/atoms/spinner"
import ViewProductsTable from "../../../../../components/templates/collection-product-table/view-products-table"
import BodyCard from "../../../../../components/organisms/body-card"
import AddProductsTable from "../../../../../components/templates/collection-product-table/add-product-table"
import Medusa from "../../../../../services/api"
import { getErrorMessage } from "../../../../../utils/error-messages"
import useNotification from "../../../../../hooks/use-notification"
import { useAdminCollection } from "medusa-react"

const BodyCardSection = ({ location }) => {
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection, isLoading, refetch } = useAdminCollection(ensuredPath)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [updates, setUpdates] = useState(0)
  const notification = useNotification()

  useEffect(() => {
    if (collection?.products?.length) {
      setUpdates(updates + 1) // force re-render product table when products are added/removed
    }
  }, [collection?.products])

  const handleAddProducts = async (
    addedIds: string[],
    removedIds: string[]
  ) => {
    try {
      if (addedIds.length > 0) {
        await Medusa.collections.addProducts(collection?.id, {
          product_ids: addedIds,
        })
      }

      if (removedIds.length > 0) {
        await Medusa.collections.removeProducts(collection?.id, {
          product_ids: removedIds,
        })
      }

      setShowAddProducts(false)
      notification("Success", "Updated products in collection", "success")
      refetch()
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
    }
  }

  return (
    <>
      <BodyCard
        title="Products"
        subtitle="To start selling, all you need is a name, price, and image."
        className="h-full"
        actionables={[
          {
            label: "Edit Products",
            icon: <EditIcon size="20" />,
            onClick: () => setShowAddProducts(!showAddProducts),
          },
        ]}
      >
        <div className="mt-large h-full">
          {isLoading || !collection ? (
            <div className="flex items-center w-full h-12">
              <Spinner variant="secondary" size="large" />
            </div>
          ) : (
            <ViewProductsTable
              key={updates} // force re-render when collection is updated
              collectionId={collection.id}
              refetchCollection={refetch}
            />
          )}
        </div>
      </BodyCard>

      {showAddProducts && (
        <AddProductsTable
          onClose={() => setShowAddProducts(false)}
          onSubmit={handleAddProducts}
          existingRelations={collection?.products ?? []}
        />
      )}
    </>
  )
}

export default BodyCardSection
