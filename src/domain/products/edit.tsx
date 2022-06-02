import { useAdminProduct, useAdminUpdateProduct } from "medusa-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Spinner from "../../components/atoms/spinner"
import Toaster from "../../components/declarative-toaster"
import FormToasterContainer from "../../components/molecules/form-toaster"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import { checkForDirtyState } from "../../utils/form-helpers"
import ProductForm from "./product-form"
import {
  formValuesToUpdateProductMapper,
  productToFormValuesMapper,
} from "./product-form/form/mappers"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"
import { ProductFormValues } from "./product-form/utils/types"

const EditProductPage = ({ id }) => {
  const notification = useNotification()
  const { product, isLoading } = useAdminProduct(id, {
    keepPreviousData: true,
  })
  const { mutate, isLoading: submitting } = useAdminUpdateProduct(id)

  const onSubmit = async (data: ProductFormValues) => {
    const payload = await formValuesToUpdateProductMapper(data)

    mutate(payload, {
      onSuccess: () => {
        notification("Success", "Product updated successfully", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return isLoading || !product ? (
    <div className="w-full pt-2xlarge flex items-center justify-center">
      <Spinner size={"large"} variant={"secondary"} />
    </div>
  ) : (
    <ProductFormProvider
      productId={id}
      product={productToFormValuesMapper(product)}
      onSubmit={onSubmit}
    >
      <ProductForm product={product} isEdit />
      <UpdateNotification isLoading={submitting} />
    </ProductFormProvider>
  )
}

const TOAST_ID = "edit-product-dirty"

const UpdateNotification = ({ isLoading = false }) => {
  const {
    formState,
    handleSubmit,
    resetForm,
    additionalDirtyState,
    onUpdate,
  } = useProductForm()
  const [visible, setVisible] = useState(false)
  const [blocking, setBlocking] = useState(true)

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
          <FormToasterContainer.ActionButton onClick={onUpdate}>
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

export default EditProductPage
