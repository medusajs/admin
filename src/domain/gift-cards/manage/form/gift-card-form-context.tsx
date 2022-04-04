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

  const appendImage = (image) => setImages([...images, image])

  const removeImage = (image) => {
    const tmp = images.filter((img) => img.url !== image.url)
    setImages(tmp)
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
          handleSubmit,
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
  handleSubmit: (values: any) => void
} | null>(null)

export const useGiftCardForm = () => {
  const context = React.useContext(GiftCardFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useGiftCardForm must be a child of GiftCardFormContext")
  }
  return { ...form, ...context }
}
