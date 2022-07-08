import React, { useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { trimValues } from "../../../../utils/trim-values"
import { MetadataField } from "../../../../components/organisms/metadata"

const defaultProductCollection = {
  id: "",
  thumbnail: 0,
  title: "",
  handle: "",
}

const ProductCollectionFormContext = React.createContext<{
  images: any[]
  setImages: (images: any[]) => void
  appendImage: (image: any) => void
  removeImage: (image: any) => void
  onSubmit: (values: any) => void
  resetForm: () => void
  additionalDirtyState: Record<string, boolean>
  onDelete: () => Promise<unknown>
  addProducts: (addedIds: string[], removedIds: string[]) => Promise<unknown>
  setShowAddProducts: (showAddProducts: boolean) => void
  showAddProducts: boolean
  ensuredPath: string
  setEnsuredPath: (value) => void
  setHasMetadataChanged: (metadataChanged: boolean) => void
  metadata: MetadataField[]
  setMetadata: (metadata: MetadataField[]) => void
} | null>(null)

export const ProductCollectionFormProvider = ({
  collection = defaultProductCollection,
  onSubmit,
  children,
  onDelete,
  addProducts,
  path = "",
}) => {
  const [images, setImages] = React.useState<any[]>([])
  const [hasImagesChanged, setHasImagesChanged] = React.useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [ensuredPath, setEnsuredPath] = useState(path)
  const [hasMetadataChanged, setHasMetadataChanged] = React.useState(false)
  const [metadata, setMetadata] = useState<MetadataField[]>([])

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
      ...collection,
    })
    setHasImagesChanged(false)
    setImages(collection.images)
  }

  React.useEffect(() => {
    resetForm()
  }, [collection])

  const handleSubmit = (values) => {
    onSubmit({ ...trimValues(values), images, metadata })
  }

  return (
    <FormProvider {...methods}>
      <ProductCollectionFormContext.Provider
        value={{
          images,
          setImages,
          appendImage,
          removeImage,
          onSubmit: handleSubmit,
          resetForm,
          additionalDirtyState: {
            images: hasImagesChanged,
            metadata: hasMetadataChanged,
          },
          onDelete,
          addProducts,
          setShowAddProducts,
          showAddProducts,
          ensuredPath,
          setEnsuredPath,
          setHasMetadataChanged,
          metadata,
          setMetadata,
        }}
      >
        {children}
      </ProductCollectionFormContext.Provider>
    </FormProvider>
  )
}

export const useProductCollectionForm = () => {
  const context = React.useContext(ProductCollectionFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error(
      "useProductCollectionForm must be a child of ProductCollectionFormContext"
    )
  }
  return { ...form, ...context }
}
