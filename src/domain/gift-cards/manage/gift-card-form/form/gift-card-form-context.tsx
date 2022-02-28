import React, { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { SaveNotificationProvider } from "../../../../../components/organisms/save-notifications/notification-provider"
import { useUpdateGiftCard } from "./use-form-actions"

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
  }, [giftCard])

  const { onUpdate } = useUpdateGiftCard(giftCard.id, {
    images,
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
        <SaveNotificationProvider
          options={{
            onReset: handleReset,
            onSubmit: onUpdate,
          }}
        >
          {children}
        </SaveNotificationProvider>
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
