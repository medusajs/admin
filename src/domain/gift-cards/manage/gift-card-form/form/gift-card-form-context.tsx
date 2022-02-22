import React, { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useDetectChange from "../../../../../hooks/use-detect-change"
import { useUpdateGiftCard } from "./use-form-actions"

export const VARIANTS_VIEW = "variants"

export const SINGLE_PRODUCT_VIEW = "single"

type PRODUCT_VIEW = typeof VARIANTS_VIEW | typeof SINGLE_PRODUCT_VIEW

const defaultProduct = {
  variants: [],
  images: [],
  prices: [],
  tags: [],
  type: null,
  id: "",
  thumbnail: "",
  title: "",
  handle: "",
  description: "",
}

export const GiftCardFormProvider = ({
  giftCard = defaultProduct,
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

  const methods = useForm()

  const handleReset = () => {
    methods.reset({
      ...giftCard,
    })
    setImages(giftCard.images)
  }

  useEffect(() => {
    handleReset()
  }, [])

  const { onUpdate } = useUpdateGiftCard(giftCard.id)

  const notificationAction = async () => {
    await onUpdate({ ...methods.getValues(), images })
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
      <GiftCardFormContext.Provider
        value={{
          images,
          setImages,
          appendImage,
          removeImage,
        }}
      >
        {children}
      </GiftCardFormContext.Provider>
    </FormProvider>
  )
}

const GiftCardFormContext = React.createContext<{
  images: any[]
  setImages: (images: any[]) => void
  appendImage: (image: any) => void
  removeImage: (image: any) => void
} | null>(null)

export const useGiftCardForm = () => {
  const context = React.useContext(GiftCardFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useGiftCardForm must be a child of GiftCardFormContext")
  }
  return { ...form, ...context }
}
