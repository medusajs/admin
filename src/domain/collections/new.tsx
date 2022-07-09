import { RouteComponentProps } from "@reach/router"
import React, { useState } from "react"
import { useAdminCreateCollection } from "medusa-react"
import { ProductCollectionFormProvider } from "./collection-form/form/product-collection-form-context"
import ProductCollectionForm from "./collection-form"
import { formValuesToCreateUpdateProductCollectionMapper } from "./collection-form/form/mappers"
import { consolidateImages } from "../../utils/consolidate-images"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import Medusa from "../../services/api"
import { UpdateProductCollectionNotification } from "./collection-form/form/update-notification"
import { navigate } from "gatsby"

const NewCollectionDetails: React.FC<RouteComponentProps> = () => {
  const notification = useNotification()
  const createCollection = useAdminCreateCollection()

  const [submitting, setSubmitting] = useState(false)

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

    await createCollection.mutateAsync(
      formValuesToCreateUpdateProductCollectionMapper(newData),
      {
        onSuccess: ({ collection }) => {
          notification("Success", "Successfully created collection", "success")
          navigate(`/a/collections/${collection.id}`)
          setSubmitting(false)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <ProductCollectionFormProvider onSubmit={onSubmit}>
      <ProductCollectionForm />
      <UpdateProductCollectionNotification isLoading={submitting} />
    </ProductCollectionFormProvider>
  )
}

export default NewCollectionDetails
