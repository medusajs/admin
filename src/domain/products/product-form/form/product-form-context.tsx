import React from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { trimValues } from "../../../../utils/trim-values"

export const VARIANTS_VIEW = "variants"

export const SINGLE_PRODUCT_VIEW = "single"

type PRODUCT_VIEW = typeof VARIANTS_VIEW | typeof SINGLE_PRODUCT_VIEW

const defaultProduct = {
  variants: [],
  images: [],
  prices: [],
  tags: [],
  options: [],
  type: null,
  collection: null,
  id: "",
  thumbnail: 0,
  title: "",
  handle: "",
  description: "",
  sku: "",
  ean: "",
  inventory_quantity: null,
  manage_inventory: false,
  allow_backorder: false,
  weight: null,
  height: null,
  width: null,
  length: null,
  mid_code: null,
  hs_code: null,
  origin_country: null,
  material: "",
  discountable: false,
}

const ProductFormContext = React.createContext<{
  productOptions: any[]
  setProductOptions: (vars: any[]) => void
  variants: any[]
  setVariants: (vars: any[]) => void
  images: any[]
  setImages: (images: any[]) => void
  appendImage: (image: any) => void
  removeImage: (image: any) => void
  setViewType: (value: PRODUCT_VIEW) => void
  viewType: PRODUCT_VIEW
  isVariantsView: boolean
  onSubmit: (values: any) => void
  resetForm: () => void
  additionalDirtyState: Record<string, boolean>
} | null>(null)

export const ProductFormProvider = ({
  product = defaultProduct,
  onSubmit,
  children,
}) => {
  const [viewType, setViewType] = React.useState<PRODUCT_VIEW>(
    product.variants?.length > 0 ? VARIANTS_VIEW : SINGLE_PRODUCT_VIEW
  )
  const [images, setImages] = React.useState<any[]>([])
  const [variants, setVariants] = React.useState<any[]>([])
  const [productOptions, setProductOptions] = React.useState<any[]>([])
  const [hasImagesChanged, setHasImagesChanged] = React.useState(false)

  const appendImage = (image) => {
    setHasImagesChanged(true)
    setImages([...images, image])
  }

  const removeImage = (image) => {
    setHasImagesChanged(true)
    const tmp = images.filter((img) => img.url !== image.url)
    setImages(tmp)
  }
  const methods = useForm()

  const resetForm = () => {
    methods.reset({
      ...product,
    })
    setHasImagesChanged(false)
    setImages(product.images)
    setProductOptions(product.options)

    if (product?.variants) {
      const variants = product?.variants?.map((v) => ({
        ...v,
        options: v.options.map((o) => ({
          ...o,
          title: product.options.find((po) => po.id === o.option_id)?.title,
        })),
      }))

      setVariants(variants)
    }

    if (product?.options) {
      const options = product?.options?.map((po) => ({
        name: po.title,
        values: po.values ? po.values.map((v) => v.value) : [],
      }))

      setProductOptions(options)
    }
  }

  React.useEffect(() => {
    resetForm()
  }, [product])

  const handleSubmit = (values) => {
    onSubmit(
      { ...trimValues(values), images, variants, options: productOptions },
      viewType
    )
  }

  return (
    <FormProvider {...methods}>
      <ProductFormContext.Provider
        value={{
          productOptions,
          setProductOptions,
          variants,
          setVariants,
          images,
          setImages,
          appendImage,
          removeImage,
          setViewType,
          viewType,
          isVariantsView: viewType === VARIANTS_VIEW,
          onSubmit: handleSubmit,
          resetForm,
          additionalDirtyState: {
            images: hasImagesChanged,
          },
        }}
      >
        {children}
      </ProductFormContext.Provider>
    </FormProvider>
  )
}

export const useProductForm = () => {
  const context = React.useContext(ProductFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useProductForm must be a child of ProductFormContext")
  }
  return { ...form, ...context }
}
