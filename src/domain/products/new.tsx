import { navigate } from "gatsby"
import { useAdminCreateProduct } from "medusa-react"
import React, { useEffect, useState } from "react"
import { FieldValues } from "react-hook-form"
import toast from "react-hot-toast"
import Toaster from "../../components/declarative-toaster"
import FormToasterContainer from "../../components/molecules/form-toaster"
import { FeatureFlagContext } from "../../context/feature-flag"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import { consolidateImages } from "../../utils/consolidate-images"
import { getErrorMessage } from "../../utils/error-messages"
import { checkForDirtyState } from "../../utils/form-helpers"
import { handleFormError } from "../../utils/handle-form-error"
import ProductForm from "./product-form"
import { formValuesToCreateProductMapper } from "./product-form/form/mappers"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"

const TOAST_ID = "new-product-dirty"

const NewProductPage = () => {
  const notification = useNotification()
  const createProduct = useAdminCreateProduct()
  const [isLoading, setIsLoading] = useState(false)

  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)

  const onSubmit = async (data, viewType) => {
    setIsLoading(true)

    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)

    let uploadedImgs = []
    if (images.length > 0) {
      uploadedImgs = await Medusa.uploads
        .create(images)
        .then(({ data }) => {
          const uploaded = data.uploads.map(({ url }) => url)
          return uploaded
        })
        .catch((err) => {
          setIsLoading(false)
          notification("Error uploading images", getErrorMessage(err), "error")
          return
        })
    }
    const newData = {
      ...data,
      images: consolidateImages(data.images, uploadedImgs),
    }

    createProduct.mutate(
      formValuesToCreateProductMapper(newData, viewType, isFeatureEnabled),
      {
        onSuccess: ({ product }) => {
          setIsLoading(false)
          notification("Success", "Product was succesfully created", "success")
          navigate(`/a/products/${product.id}`)
        },
        onError: (error) => {
          setIsLoading(false)
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  return (
    <ProductFormProvider onSubmit={onSubmit}>
      <ProductForm />
      <SaveNotification isLoading={isLoading} />
    </ProductFormProvider>
  )
}

const SaveNotification = ({ isLoading = false }) => {
  const {
    formState,
    onSubmit,
    handleSubmit,
    resetForm,
    additionalDirtyState,
  } = useProductForm()
  const [visible, setVisible] = useState(false)

  const onPublish = (values: FieldValues) => {
    onSubmit({ ...values, status: "published" })
    resetForm()
  }

  const onSaveDraft = (values: FieldValues) => {
    onSubmit({ ...values, status: "draft" })
    resetForm()
  }

  const isDirty = checkForDirtyState(
    formState.dirtyFields,
    additionalDirtyState
  )

  useEffect(() => {
    if (isDirty) {
      setVisible(true)
    } else {
      setVisible(false)
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
          <FormToasterContainer.MultiActionButton
            actions={[
              {
                label: "Save and publish",
                onClick: handleSubmit(onPublish, handleFormError),
              },
              {
                label: "Save as draft",
                onClick: handleSubmit(onSaveDraft, handleFormError),
              },
            ]}
          >
            Save
          </FormToasterContainer.MultiActionButton>
          <FormToasterContainer.DiscardButton onClick={resetForm}>
            Discard
          </FormToasterContainer.DiscardButton>
        </FormToasterContainer.Actions>
      </FormToasterContainer>
    </Toaster>
  )
}

export default NewProductPage
