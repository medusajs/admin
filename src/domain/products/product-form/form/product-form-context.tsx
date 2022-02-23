import React, { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import FileTextIcon from "../../../../components/fundamentals/icons/file-text-icon"
import PublishIcon from "../../../../components/fundamentals/icons/publish-icon"
import useDetectChange, {
  NotificationAction,
} from "../../../../hooks/use-detect-change"
import { useFormActions } from "./use-form-actions"

export const VARIANTS_VIEW = "variants"

export const SINGLE_PRODUCT_VIEW = "single"

type PRODUCT_VIEW = typeof VARIANTS_VIEW | typeof SINGLE_PRODUCT_VIEW

const defaultProduct = {
  variants: [] as any[],
  images: [],
  prices: [],
  tags: [],
  options: [],
  type: null,
  collection: null,
  id: "",
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
} | null>(null)

export const ProductFormProvider = ({
  product = defaultProduct,
  isEdit = false,
  children,
}) => {
  const [viewType, setViewType] = React.useState<PRODUCT_VIEW>(
    product.variants?.length > 0 ? VARIANTS_VIEW : SINGLE_PRODUCT_VIEW
  )
  const [images, setImages] = React.useState<any[]>([])
  const [variants, setVariants] = React.useState<any[]>([])
  const [productOptions, setProductOptions] = React.useState<any[]>([])

  const appendImage = (image) => setImages([...images, image])

  const removeImage = (image) => {
    const idx = images.findIndex((img) => img.image === image.image)
    if (idx !== -1) {
      images.splice(idx, 1)
    }
    setImages([...images])
  }

  const methods = useForm()

  const handleReset = () => {
    methods.reset({
      ...product,
    })
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

  useEffect(() => {
    handleReset()
  }, [])

  const { onCreateAndPublish, onCreateDraft, onUpdate } = useFormActions(
    product.id,
    viewType
  )

  let notificationAction: NotificationAction[] | (() => Promise<void>)

  if (isEdit) {
    notificationAction = async () => {
      await onUpdate({
        ...methods.getValues(),
        images,
        variants,
        options: productOptions,
      })
    }
  } else {
    notificationAction = [
      {
        icon: <PublishIcon />,
        label: "Save and publish",
        onClick: async () => {
          await onCreateAndPublish({
            ...methods.getValues(),
            images,
            variants,
            options: productOptions,
          })
        },
      } as NotificationAction,
      {
        label: "Save as draft",
        onClick: async () => {
          await onCreateDraft({
            ...methods.getValues(),
            images,
            variants,
            options: productOptions,
          })
        },
        icon: <FileTextIcon />,
      } as NotificationAction,
    ]
  }

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length // isDirty from useForm is behaving more like touched and is therfore not working as expected

  useDetectChange({
    isDirty: isDirty,
    reset: handleReset,
    options: {
      fn: notificationAction,
      title: "You have unsaved changes",
      message: "Do you want to save your changes?",
    },
  })

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
