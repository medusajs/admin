import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useEffect, useMemo } from "react"
import {
  Control,
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import FileUploadField from "../../../../../components/atoms/file-upload-field"
import Button from "../../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../../components/fundamentals/icons/check-circle-fill-icon"
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

type ImageType = { selected: boolean } & FormImage

type MediaForm = {
  images: ImageType[]
}

const MediaModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const {
    control,
    formState: { isDirty },
    setValue,
    handleSubmit,
    reset,
  } = useForm<MediaForm>({
    defaultValues: getDefaultValues(product),
  })
  const { fields, append, remove } = useFieldArray({
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
      let errorMessage = "Something went wrong while trying to upload images."
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
    const urls = prepedImages.map((image) => image.url)

    onUpdate(
      {
        images: urls,
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

      append(toAppend)
    }
  }

  const images = useWatch({
    control,
    name: "images",
  })

  useEffect(() => {
    if (images.some((i) => i.selected)) {
      console.log("selected")
    }
  }, [images])

  const selected = useMemo(() => {
    const selected: number[] = []

    images.forEach((i, index) => {
      if (i.selected) {
        selected.push(index)
      }
    })

    return selected
  }, [images])

  const handleRemove = () => {
    remove(selected)
  }

  const handleDeselect = () => {
    selected.forEach((i) => {
      setValue(`images.${i}.selected`, false)
    })
  }

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Edit Media</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="mb-xlarge">
              <h2 className="inter-large-semibold mb-2xsmall">Media</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Add images to your product.
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
              <div className="mb-small flex items-center justify-between">
                <h2 className="inter-large-semibold">Uploads</h2>
                <ModalActions
                  number={selected.length}
                  onDeselect={handleDeselect}
                  onRemove={handleRemove}
                />
              </div>
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
  image: FieldArrayWithId<MediaForm, "images", "id">
  index: number
  remove: (index: number) => void
  control: Control<MediaForm, any>
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
    <Controller
      name={`images.${index}.selected`}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <button
            className={clsx(
              "px-base py-xsmall group hover:bg-grey-5 rounded-rounded flex items-center justify-between",
              {
                "bg-grey-5": value,
              }
            )}
            type="button"
            onClick={() => onChange(!value)}
          >
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
            <div className="flex items-center gap-x-base">
              <span
                className={clsx(
                  "hidden",
                  { "group-hover:block text-grey-30": !value },
                  {
                    "!block !text-violet-60": value,
                  }
                )}
              >
                <CheckCircleFillIcon size={24} />
              </span>
              <Actionables actions={actions} forceDropdown />
            </div>
          </button>
        )
      }}
    />
  )
}

type ModalActionsProps = {
  number: number
  onRemove: () => void
  onDeselect: () => void
}

const ModalActions = ({ number, onRemove, onDeselect }: ModalActionsProps) => {
  return (
    <div className="h-10 overflow-y-hidden flex items-center pr-1">
      <div
        className={clsx(
          "flex items-center gap-x-small transition-all duration-200",
          {
            "translate-y-[-42px]": !number,
            "translate-y-[0px]": number,
          }
        )}
      >
        <span>{number} selected</span>
        <div className="w-px h-5 bg-grey-20" />
        <div className="flex items-center gap-x-xsmall">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={onDeselect}
          >
            Deselect
          </Button>
          <Button
            variant="danger"
            size="small"
            type="button"
            onClick={onRemove}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

const getDefaultValues = (product: Product): MediaForm => {
  return {
    images:
      product.images?.map((image) => ({
        url: image.url,
        selected: false,
      })) || [],
  }
}

export default MediaModal
