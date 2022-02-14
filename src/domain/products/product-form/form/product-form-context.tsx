import React from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useDetectChange from "../../../../hooks/use-detect-change"

export const VARIANTS_VIEW = "variants"

export const SINGLE_PRODUCT_VIEW = "single"

type PRODUCT_VIEW = typeof VARIANTS_VIEW | typeof SINGLE_PRODUCT_VIEW

const defaultProduct = {
  variants: [],
  images: [],
  prices: [],
  tags: [],
  type: null,
  collection: null,
  thumbnail: "",
  title: "",
  handle: "",
  description: "",
  sku: "",
  ean: "",
  inventory_quantity: "",
  manage_inventory: false,
  allow_backorder: false,
  weight: "",
  height: "",
  width: "",
  length: "",
  mid_code: "",
  hs_code: "",
  origin_country: "",
  material: "",
}

export const ProductFormProvider = ({
  product = defaultProduct,
  onSubmit,
  children,
}) => {
  const [images, setImages] = React.useState<any[]>([])

  const appendImage = (image) => setImages([...images, image])

  const removeImage = (image) => {
    const idx = images.findIndex((img) => img.image === image.image)
    if (idx !== -1) {
      images.splice(idx, 1)
    }
    setImages([...images])
  }

  const [viewType, setViewType] = React.useState<PRODUCT_VIEW>(
    product.variants?.length > 1 ? VARIANTS_VIEW : SINGLE_PRODUCT_VIEW
  )

  const methods = useForm()

  const handleReset = () => {
    methods.reset({
      ...product,
    })
    setImages(product.images)
  }

  React.useEffect(() => {
    handleReset()
  }, [product])

  const handleSubmit = (values) => {
    onSubmit({ ...values, images })
  }

  const handleSubmission = async () => {
    const { getValues } = methods
    const values = getValues()
    handleSubmit({ ...values })
  }

  useDetectChange({
    isDirty: methods.formState.isDirty,
    reset: handleReset,
    options: {
      fn: handleSubmission,
      title: "You have unsaved changes",
      message: "Do you want to save your changes?",
    },
  })

  return (
    <FormProvider {...methods}>
      <ProductFormContext.Provider
        value={{
          images,
          setImages,
          appendImage,
          removeImage,
          setViewType,
          viewType,
          isVariantsView: viewType === VARIANTS_VIEW,
          onSubmit: handleSubmit,
        }}
      >
        {children}
      </ProductFormContext.Provider>
    </FormProvider>
  )
}

const ProductFormContext = React.createContext<{
  images: any[]
  setImages: (images: any[]) => void
  appendImage: (image: any) => void
  removeImage: (image: any) => void
  setViewType: (value: PRODUCT_VIEW) => void
  viewType: PRODUCT_VIEW
  isVariantsView: boolean
  onSubmit: (values: any) => void
} | null>(null)

export const useProductForm = () => {
  const context = React.useContext(ProductFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useProductForm must be a child of ProductFormContext")
  }
  return { ...form, ...context }
}
