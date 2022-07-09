import * as React from "react"
import { useEffect, useState } from "react"
import Images from "./sections/images"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import CollectionHeader from "./sections/collection-header"
import BodyCard from "../../../components/organisms/body-card"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import ViewProductsTable from "../../../components/templates/collection-product-table/view-products-table"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import AddProductsTable from "../../../components/templates/collection-product-table/add-product-table"
import { useProductCollectionForm } from "./form/product-collection-form-context"
import { useAdminCollection } from "medusa-react"

type ProductCollectionFormProps = {
  collection?: any
  isEdit?: boolean
}

const ProductCollectionForm = ({
  collection,
  isEdit = false,
}: ProductCollectionFormProps) => {
  const [showDelete, setShowDelete] = useState(false)
  const [updates, setUpdates] = useState(0)
  const { showAddProducts, setShowAddProducts, onDelete, ensuredPath } =
    useProductCollectionForm()
  const { refetch } = useAdminCollection(ensuredPath)

  if (isEdit && !collection) {
    throw new Error("Collection is required for edit")
  }

  useEffect(() => {
    if (isEdit && collection) {
      if (collection.products?.length) {
        setUpdates(updates + 1) // force re-render product table when products are added/removed
      }
    }
  }, [collection, isEdit])

  return (
    <>
      <div className="flex flex-col h-full mb-large">
        <Breadcrumb
          currentPage={isEdit ? "Edit Collection" : "Add Collection"}
          previousBreadcrumb="Collections"
          previousRoute="/a/products?view=collections"
          defaultValue={collection?.title ?? ""}
        />
        <div
          className="rounded-rounded py-large px-xlarge border
         border-grey-20 bg-grey-0 mb-large"
        >
          <div>
            <CollectionHeader collection={collection} isEdit={isEdit} />
          </div>
        </div>

        <div className="mb-large">
          <Images />
        </div>

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
          defaultValue={collection?.products?.length ?? 0}
        >
          <div className="mt-large h-full">
            <ViewProductsTable
              key={updates} // force re-render when collection is updated
              collectionId={collection?.id}
              refetchCollection={refetch}
            />
          </div>
        </BodyCard>
      </div>

      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading="Delete collection"
          successText="Successfully deleted collection"
          confirmText="Yes, delete"
          onDelete={onDelete}
        />
      )}

      {showAddProducts && (
        <AddProductsTable existingRelations={collection?.products ?? []} />
      )}
    </>
  )
}

export default ProductCollectionForm
