import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import {
  Control,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from "react-hook-form"
import FileUploadField from "../../../../../components/atoms/file-upload-field"
import Button from "../../../../../components/fundamentals/button"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables, {
  ActionType,
} from "../../../../../components/molecules/actionables"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { FormImage } from "../../../../../types/shared"
import { prepareImages } from "../../../product-form/utils/helpers"
import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type ThumbnailForm = {
  images: FormImage[]
}

const ThumbnailModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useForm<ThumbnailForm>({
    defaultValues: getDefaultValues(product),
  })
  const { fields, remove, replace } = useFieldArray({
    control: control,
    name: "images",
  })

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit(async (data) => {
    let prepedImages: FormImage[] = []

    try {
      prepedImages = await prepareImages(data.images)
    } catch (error) {
      let errorMessage =
        "Something went wrong while trying to upload the thumbnail."
      const response = (error as any).response as Response

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          "You might not have a file service configured. Please contact your administrator"
      }

      notification("Error", errorMessage, "error")
      return
    }
    const url = prepedImages[0].url

    onUpdate(
      {
        thumbnail: url,
      },
      onReset
    )
  })

  const handleFilesChosen = (files: File[]) => {
    if (files.length) {
      const toAppend = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        nativeFile: file,
        selected: false,
      }))

      replace(toAppend)
    }
  }

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Upload Thumbnail</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="mb-xlarge">
              <h2 className="inter-large-semibold mb-2xsmall">Thumbnail</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Used to represent your product during checkout, social sharing
                and more.
              </p>
              <div className="mt-large">
                <FileUploadField
                  onFileChosen={handleFilesChosen}
                  placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
                  filetypes={[
                    "image/gif",
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                  ]}
                  className="py-large"
                />
              </div>
            </div>
            <div>
              <h2 className="inter-large-semibold mb-small">Upload</h2>

              <div className="flex flex-col gap-y-2xsmall">
                {fields.map((field, index) => {
                  return (
                    <Image
                      key={field.id}
                      image={field}
                      index={index}
                      remove={remove}
                      control={control}
                    />
                  )
                })}
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-x-2 justify-end w-full">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

type ImageProps = {
  image: FieldArrayWithId<ThumbnailForm, "images", "id">
  index: number
  remove: (index: number) => void
  control: Control<ThumbnailForm, any>
}

const Image = ({ image, index, control, remove }: ImageProps) => {
  const actions: ActionType[] = [
    {
      label: "Delete",
      onClick: () => remove(index),
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return (
    <div className="px-base py-xsmall group hover:bg-grey-5 rounded-rounded flex items-center justify-between">
      <div className="flex items-center gap-x-large">
        <div className="w-16 h-16 flex items-center justify-center">
          <img
            src={image.url}
            alt={image.name || "Uploaded image"}
            className="max-w-[64px] max-h-[64px] rounded-rounded"
          />
        </div>
        <div className="flex flex-col inter-small-regular text-left">
          <p>{image.name}</p>
          <p className="text-grey-50">
            {image.size ? `${(image.size / 1024).toFixed(2)} KB` : ""}
          </p>
        </div>
      </div>

      <Actionables actions={actions} forceDropdown />
    </div>
  )
}

const getDefaultValues = (product: Product): ThumbnailForm => {
  return {
    images: product.thumbnail
      ? [
          {
            url: product.thumbnail,
          },
        ]
      : [],
  }
}

export default ThumbnailModal
