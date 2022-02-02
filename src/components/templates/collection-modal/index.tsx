import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../fundamentals/button"
import InfoTooltip from "../../molecules/info-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Metadata, { MetadataField } from "../../organisms/metadata"

type CollectionModalProps = {
  onClose: () => void
  onSubmit: (values: any, metadata: MetadataField[]) => void
  isEdit?: boolean
  collection?: any
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  onClose,
  onSubmit,
  isEdit = false,
  collection,
}) => {
  const { register, setValue, handleSubmit } = useForm()
  const [metadata, setMetadata] = useState<MetadataField[]>([])

  if (isEdit && !collection) {
    throw new Error("Collection is required for edit")
  }

  useEffect(() => {
    register("title", { required: true })
    register("handle")
  }, [])

  useEffect(() => {
    if (isEdit && collection) {
      setValue("title", collection.title)
      setValue("handle", collection.handle)

      if (collection.metadata) {
        Object.entries(collection.metadata).map(([key, value]) => {
          const newMeta = metadata
          newMeta.push({ key, value })
          setMetadata(newMeta)
        })
      }
    }
  }, [collection, isEdit])

  const submit = (data: any) => {
    onSubmit(data, metadata)
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {isEdit ? "Edit Collection" : "Add Collection"}
            </h1>
            <p className="inter-small-regular text-grey-50">
              To create a collection, all you need is a title and a handle.
            </p>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content isLargeModal>
            <div>
              <h2 className="inter-base-semibold mb-base">Details</h2>
              <div className="flex items-center gap-x-base">
                <InputField
                  label="Title"
                  required
                  placeholder="Sunglasses"
                  name="title"
                  ref={register({ required: true })}
                />
                <InputField
                  label="Handle"
                  placeholder="sunglasses"
                  name="handle"
                  prefix="/"
                  tooltip={
                    <InfoTooltip content="URL Slug for the product. Will be auto generated if left blank." />
                  }
                  ref={register}
                />
              </div>
            </div>
            <div className="mt-xlarge w-full">
              <Metadata setMetadata={setMetadata} metadata={metadata} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button variant="primary" size="small">
                {`${isEdit ? "Save" : "Publish"} collection`}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CollectionModal
