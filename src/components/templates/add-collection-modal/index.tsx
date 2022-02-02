import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../fundamentals/button"
import InfoTooltip from "../../molecules/info-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import AddMetadata from "../../organisms/add-metadata"

type AddCollectionModalProps = {
  onClose: () => void
  onSubmit: (values: any) => void
}

const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { register, unregister, handleSubmit } = useForm()

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content isLargeModal>
            <div>
              <h2 className="inter-base-semibold mb-base">Details</h2>
              <div className="flex items-center gap-x-base">
                <InputField
                  label="Title"
                  required
                  placeholder="Sunglasses"
                  ref={register({ required: true })}
                  name="title"
                />
                <InputField
                  label="Handle"
                  placeholder="sunglasses"
                  ref={register}
                  name="handle"
                  prefix="/"
                  tooltip={
                    <InfoTooltip content="URL Slug for the product. Will be auto generated if left blank." />
                  }
                />
              </div>
            </div>
            <div className="mt-xlarge w-full">
              <AddMetadata register={register} unregister={unregister} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button variant="secondary" size="small">
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

export default AddCollectionModal
