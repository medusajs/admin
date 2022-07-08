import { RouteComponentProps } from "@reach/router"
import React, { useEffect, useState } from "react"
import {
  useAdminCollection,
  useAdminDeleteCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import Spinner from "../../components/atoms/spinner"
import {
  ProductCollectionFormProvider,
  useProductCollectionForm,
} from "./collection-form/form/product-collection-form-context"
import ProductCollectionForm from "./collection-form"
import { FieldValues } from "react-hook-form"
import { checkForDirtyState } from "../../utils/form-helpers"
import Toaster from "../../components/declarative-toaster"
import FormToasterContainer from "../../components/molecules/form-toaster"
import { handleFormError } from "../../utils/handle-form-error"
import toast from "react-hot-toast"
import {
  formValuesToUpdateProductCollectionMapper,
  productCollectionToFormValuesMapper,
} from "./collection-form/form/mappers"
import { consolidateImages } from "../../utils/consolidate-images"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import Medusa from "../../services/api"
import { navigate } from "gatsby"

const CollectionDetails: React.FC<RouteComponentProps> = ({ location }) => {
  const notification = useNotification()
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection, isLoading, refetch } = useAdminCollection(ensuredPath, {
    keepPreviousData: true,
  })
  const updateCollection = useAdminUpdateCollection(ensuredPath)
  const [submitting, setSubmitting] = useState(false)
  const deleteCollection = useAdminDeleteCollection(ensuredPath)

  const onDelete = () => {
    deleteCollection.mutate(undefined, {
      onSuccess: () => navigate(`/a/collections`),
    })
  }

  const onSubmit = async (data: any) => {
    setSubmitting(true)

    const payload: {
      title: string
      handle?: string
      metadata?: object
      images?: []
      thumbnail?: number
    } = {
      title: data.title,
      handle: data.handle,
      metadata: data.metadata,
      images: data.images,
      thumbnail: data.thumbnail,
    }

    if (data?.metadata?.length > 0) {
      payload.metadata = data!
        .metadata!.filter((m) => m.key && m.value) // remove empty metadata
        .reduce((acc, next) => {
          return {
            ...acc,
            [next.key]: next.value,
          }
        }, {}) // deleting metadata will not work as it's not supported by the core
    }

    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)

    let uploadedImages = []
    if (images.length > 0) {
      uploadedImages = await Medusa.uploads
        .create(images)
        .then(({ data }) => {
          return data.uploads.map(({ url }) => url)
        })
        .catch((err) => {
          setSubmitting(false)
          notification("Error uploading images", getErrorMessage(err), "error")
          return
        })
    }

    const newData = {
      ...payload,
      images: consolidateImages(data.images, uploadedImages),
    }

    debugger
    console.log(newData, "newData")

    updateCollection.mutate(
      formValuesToUpdateProductCollectionMapper(newData),
      {
        onSuccess: () => {
          setSubmitting(false)
          notification("Success", "Product updated successfully", "success")
          refetch()
        },
        onError: (error) => {
          setSubmitting(false)
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const addProducts = async (addedIds: string[], removedIds: string[]) => {
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

      notification("Success", "Updated products in collection", "success")
      refetch()
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
    }
  }

  return isLoading ? (
    <div className="w-full pt-2xlarge flex items-center justify-center">
      <Spinner size={"large"} variant={"secondary"} />
    </div>
  ) : (
    <ProductCollectionFormProvider
      collection={productCollectionToFormValuesMapper(collection)}
      onSubmit={onSubmit}
      onDelete={onDelete}
      addProducts={addProducts}
      path={ensuredPath}
    >
      <ProductCollectionForm collection={collection} isEdit />
      <UpdateNotification isLoading={submitting} />
    </ProductCollectionFormProvider>
  )
}

const TOAST_ID = "edit-product-collection-dirty"

const UpdateNotification = ({ isLoading = false }) => {
  const {
    formState,
    onSubmit,
    handleSubmit,
    resetForm,
    additionalDirtyState,
    metadata,
  } = useProductCollectionForm()
  const [visible, setVisible] = useState(false)
  const [blocking, setBlocking] = useState(true)

  const onUpdate = (values: FieldValues) => {
    console.log(values, "values")
    console.log(metadata)

    onSubmit({ ...values }, metadata)
  }

  useEffect(() => {
    const timeout = setTimeout(setBlocking, 300, false)
    return () => clearTimeout(timeout)
  }, [])

  const isDirty = checkForDirtyState(
    formState.dirtyFields,
    additionalDirtyState
  )

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
