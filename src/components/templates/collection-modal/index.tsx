import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../fundamentals/button"
import IconTooltip from "../../molecules/icon-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Metadata, { MetadataField } from "../../organisms/metadata"

type CollectionModalProps = {
  onClose: () => void
  onSubmit: (values: any, metadata: MetadataField[]) => void
  collection?: any
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm()
  const [metadata, setMetadata] = useState<MetadataField[]>([])

  useEffect(() => {
    register("title", { required: true })
    register("handle")
  }, [])

  const submit = (data: any) => {
    onSubmit(data, metadata)
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">Add Collection</h1>
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
                    <IconTooltip content="URL Slug for the product. Will be auto generated if left blank." />
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
                Publish collection
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CollectionModal
