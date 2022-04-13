import React, { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { trimValues } from "../../../../utils/trim-values"

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
  onSubmit,
  children,
}) => {
  const [images, setImages] = React.useState<any[]>([])
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
      ...giftCard,
    })
    setHasImagesChanged(false)
    setImages(giftCard.images)
  }

  useEffect(() => {
    resetForm()
  }, [giftCard])

  const handleSubmit = (values) => {
    onSubmit({
      ...trimValues(values),
      images,
    })
  }

  return (
    <FormProvider {...methods}>
      <GiftCardFormContext.Provider
        value={{
          images,
          setImages,
          appendImage,
          removeImage,
          onSubmit: handleSubmit,
          resetForm,
          additionalDirtyState: {
            images: hasImagesChanged,
          },
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
  onSubmit: (values: any) => void
  resetForm: () => void
  additionalDirtyState: Record<string, boolean>
} | null>(null)

export const useGiftCardForm = () => {
  const context = React.useContext(GiftCardFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useGiftCardForm must be a child of GiftCardFormContext")
  }
  return { ...form, ...context }
}
