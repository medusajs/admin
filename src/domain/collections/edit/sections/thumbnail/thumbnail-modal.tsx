import { ProductCollection } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { FormImage } from "../../../../../types/shared"
import { prepareImages } from "../../../../../utils/images"
import { nestedForm } from "../../../../../utils/nested-form"
import useEditProductCollectionActions from "../../hooks/use-edit-product-collection-actions"
import ThumbnailForm, {
  ThumbnailFormType,
} from "../../../../products/components/thumbnail-form"

type Props = {
  collection: ProductCollection
  open: boolean
  onClose: () => void
}

type ThumbnailFormWrapper = {
  thumbnail: ThumbnailFormType
}

const ThumbnailModal = ({ collection, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductCollectionActions(collection.id)
  const form = useForm<ThumbnailFormWrapper>({
    defaultValues: getDefaultValues(collection),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValues(collection))
  }, [collection])

  const onReset = () => {
    reset(getDefaultValues(collection))
    onClose()
  }

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = []

    try {
      preppedImages = await prepareImages(data.thumbnail.images)
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
    const url = preppedImages?.[0]?.url

    onUpdate(
      {
        // @ts-ignore
        thumbnail: url || null,
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Upload Thumbnail</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <h2 className="inter-large-semibold mb-2xsmall">Thumbnail</h2>
            <p className="inter-base-regular text-grey-50 mb-large">
              Used to represent your product during checkout, social sharing and
              more.
            </p>
            <ThumbnailForm form={nestedForm(form, "thumbnail")} />
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

const getDefaultValues = (
  collection: ProductCollection
): ThumbnailFormWrapper => {
  return {
    thumbnail: {
      images: collection.thumbnail
        ? [
            {
              url: collection.thumbnail,
            },
          ]
        : [],
    },
  }
}

export default ThumbnailModal
