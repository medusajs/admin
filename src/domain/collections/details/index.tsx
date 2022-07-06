import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import {
  useAdminCollection,
  useAdminDeleteCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import Spinner from "../../../components/atoms/spinner"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import { MetadataField } from "../../../components/organisms/metadata"
import AddProductsTable from "../../../components/templates/collection-product-table/add-product-table"
import ViewProductsTable from "../../../components/templates/collection-product-table/view-products-table"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import Images from "./images"
import { FieldValues, useForm } from "react-hook-form"
import CollectionHeader from "./collection-header"
import { checkForDirtyState } from "../../../utils/form-helpers"
import toast from "react-hot-toast"
import Toaster from "../../../components/declarative-toaster"
import FormToasterContainer from "../../../components/molecules/form-toaster"
import { handleFormError } from "../../../utils/handle-form-error"

const CollectionDetails: React.FC<RouteComponentProps> = ({ location }) => {
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection, isLoading, refetch } = useAdminCollection(ensuredPath)
  const deleteCollection = useAdminDeleteCollection(ensuredPath)
  const updateCollection = useAdminUpdateCollection(ensuredPath)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const notification = useNotification()
  const [updates, setUpdates] = useState(0)
  const [images, setImages] = React.useState<any[]>([])
  const [hasImagesChanged, setHasImagesChanged] = React.useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { control, formState, register, setValue, handleSubmit } = useForm()

  const additionalDirtyState = {
    images: hasImagesChanged,
  }

  const handleDelete = () => {
    deleteCollection.mutate(undefined, {
      onSuccess: () => navigate(`/a/collections`),
    })
  }

  const handleUpdateDetails = (data: any, metadata: MetadataField[]) => {
    const payload: {
      title: string
      handle?: string
      metadata?: object
    } = {
      title: data.title,
      handle: data.handle,
    }

    if (metadata.length > 0) {
      const payloadMetadata = metadata
        .filter((m) => m.key && m.value) // remove empty metadata
        .reduce((acc, next) => {
          return {
            ...acc,
            [next.key]: next.value,
          }
        }, {})

      payload.metadata = payloadMetadata // deleting metadata will not work as it's not supported by the core
    }

    updateCollection.mutate(payload, {
      onSuccess: () => {
        setShowEdit(false)
        refetch()
      },
    })
  }

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

  useEffect(() => {
    if (collection?.products?.length) {
      setUpdates(updates + 1) // force re-render product table when products are added/removed
    }

    if (collection?.images?.length) {
      resetForm()
    }
  }, [collection?.products])

  const resetForm = () => {
    setImages(collection?.images)
  }

  const appendImage = (image) => {
    setHasImagesChanged(true)
    setImages([...images, image])
  }

  const removeImage = (image) => {
    setHasImagesChanged(true)
    const tmp = images.filter((img) => img.url !== image.url)
    setImages(tmp)
  }

  return (
    <>
      <div className="flex flex-col h-full mb-large">
        <Breadcrumb
          currentPage="Edit Collection"
          previousBreadcrumb="Collections"
          previousRoute="/a/products?view=collections"
        />
        <div
          className="rounded-rounded py-large px-xlarge border
         border-grey-20 bg-grey-0 mb-large"
        >
          {isLoading || !collection ? (
            <div className="flex items-center w-full h-12">
              <Spinner variant="secondary" size="large" />
            </div>
          ) : (
            <div>
              <CollectionHeader
                collection={collection}
                onClose={() => setShowEdit(!showEdit)}
                onSubmit={handleUpdateDetails}
                register={register}
                setValue={setValue}
                handleSubmit={handleSubmit}
              />
            </div>
          )}
        </div>

        {images && (
          <div className="mb-large">
            <Images
              images={images}
              setImages={setImages}
              appendImage={appendImage}
              removeImage={removeImage}
              control={control}
            />
          </div>
        )}

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
      </div>

      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading="Delete collection"
          successText="Successfully deleted collection"
          onDelete={async () => handleDelete()}
          confirmText="Yes, delete"
        />
      )}
      {showAddProducts && (
        <AddProductsTable
          onClose={() => setShowAddProducts(false)}
          onSubmit={handleAddProducts}
          existingRelations={collection?.products ?? []}
        />
      )}

      <UpdateNotification
        isLoading={submitting}
        formState={formState}
        onSubmit={() => {}}
        handleSubmit={() => {}}
        resetForm={resetForm}
        additionalDirtyState={additionalDirtyState}
      />
    </>
  )
}

const TOAST_ID = "edit-product-collection-dirty"

const UpdateNotification = ({
  isLoading = false,
  formState,
  onSubmit,
  handleSubmit,
  resetForm,
  additionalDirtyState,
}) => {
  const [visible, setVisible] = useState(false)
  const [blocking, setBlocking] = useState(true)

  const onUpdate = (values: FieldValues) => {
    onSubmit({ ...values })
  }

  useEffect(() => {
    const timeout = setTimeout(setBlocking, 300, false)
    return () => clearTimeout(timeout)
  }, [])

  const isDirty = checkForDirtyState(
    formState.dirtyFields,
    additionalDirtyState
  )

  console.log(isDirty)
  console.log(formState.dirtyFields)
  console.log(formState)

  useEffect(() => {
    if (!blocking) {
      setVisible(isDirty)
    }

    return () => {
      toast.dismiss(TOAST_ID)
    }
  }, [isDirty])

  return (
    <Toaster
      visible={visible}
      duration={Infinity}
      id={TOAST_ID}
      position="bottom-right"
    >
      <FormToasterContainer isLoading={isLoading}>
        <FormToasterContainer.Actions>
          <FormToasterContainer.ActionButton
            onClick={handleSubmit(onUpdate, handleFormError)}
          >
            Save
          </FormToasterContainer.ActionButton>
          <FormToasterContainer.DiscardButton onClick={resetForm}>
            Discard
          </FormToasterContainer.DiscardButton>
        </FormToasterContainer.Actions>
      </FormToasterContainer>
    </Toaster>
  )
}

export default CollectionDetails
