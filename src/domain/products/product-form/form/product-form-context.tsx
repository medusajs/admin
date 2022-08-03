import { navigate } from "gatsby"
import { useAdminCreateProduct, useAdminUpdateProduct } from "medusa-react"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useNotification from "../../../../hooks/use-notification"
import { ProductStatus } from "../../../../types/shared"
import { handleFormError } from "../../../../utils/handle-form-error"
import { trimValues } from "../../../../utils/trim-values"
import { PRODUCT_VIEW } from "../utils/constants"
import { ProductFormValues } from "../utils/types"
import {
  formValuesToCreateProductMapper,
  formValuesToUpdateProductMapper,
} from "./mappers"

const ProductFormContext = React.createContext<{
  setViewType: (value: PRODUCT_VIEW) => void
  viewType: PRODUCT_VIEW
  isVariantsView: boolean
  resetForm: () => void
  setImageDirtyState: (dirty: boolean) => void
  additionalDirtyState: Record<string, boolean>
  onCreate: () => Promise<void>
  onCreateDraft: () => Promise<void>
  onUpdate: () => Promise<void>
} | null>(null)

type ProductFormProviderProps = {
  productId?: string
  product?: ProductFormValues
  children: React.ReactNode
}

export const ProductFormProvider = ({
  productId,
  product,
  children,
}: ProductFormProviderProps) => {
  const [viewType, setViewType] = React.useState<PRODUCT_VIEW>(
    product?.variants?.length
      ? PRODUCT_VIEW.VARIANTS_VIEW
      : PRODUCT_VIEW.SINGLE_PRODUCT_VIEW
  )

  const [imageDirtyState, setImageDirtyState] = useState(false)

  const methods = useForm<ProductFormValues>({
    defaultValues: {
      ...product,
      images: product?.images || [],
    },
  })

  const resetForm = () => {
    methods.reset({ ...product })
    setImageDirtyState(false)
  }

  useEffect(() => {
    resetForm()
  }, [product])

  const { mutate: create } = useAdminCreateProduct()
  const { mutate: update } = useAdminUpdateProduct(productId!)
  const notification = useNotification()

  const onCreate = methods.handleSubmit(async (values) => {
    const cleanedValues = trimValues(values)

    const payload = await formValuesToCreateProductMapper(
      cleanedValues,
      viewType
    )

    create(payload, {
      onSuccess: ({ product }) => {
        notification("Success", "Product created successfully", "success")
        navigate(`/a/products/${product.id}`)
      },
    })
  }, handleFormError)

  const onCreateDraft = methods.handleSubmit(async (values) => {
    const cleanedValues = trimValues(values)

    const payload = await formValuesToCreateProductMapper(
      { ...cleanedValues, status: ProductStatus.DRAFT },
      viewType
    )

    create(payload, {
      onSuccess: ({ product }) => {
        notification("Success", "Product created successfully", "success")
        navigate(`/a/products/${product.id}`)
      },
    })
  }, handleFormError)

  const onUpdate = methods.handleSubmit(async (values) => {
    const cleanedValues = trimValues(values)

    const payload = await formValuesToUpdateProductMapper(cleanedValues)

    update(payload, {
      onSuccess: ({ product }) => {
        notification("Success", "Product updated successfully", "success")
        navigate(`/a/products/${product.id}`)
      },
    })
  }, handleFormError)

  return (
    <FormProvider {...methods}>
      <ProductFormContext.Provider
        value={{
          setViewType,
          viewType,
          isVariantsView: viewType === PRODUCT_VIEW.VARIANTS_VIEW,
          resetForm,
          onCreate,
          onCreateDraft,
          onUpdate,
          setImageDirtyState,
          additionalDirtyState: {
            images: imageDirtyState,
          },
        }}
      >
        <form>{children}</form>
      </ProductFormContext.Provider>
    </FormProvider>
  )
}

export const useProductForm = () => {
  const context = React.useContext(ProductFormContext)
  const form = useFormContext<ProductFormValues>()
  if (!context) {
    throw new Error("useProductForm must be a child of ProductFormContext")
  }
  return { form, ...context }
}
