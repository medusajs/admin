import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"

type CreateFulfillmentModalProps = {
  handleClose: () => void
  handleSave: () => Promise<void>
  address?: object
  email?: string
}

const CreateFulfillmentModal: React.FC<CreateFulfillmentModalProps> = ({
  handleClose,
  handleSave,
}) => {
  const { register, handleSubmit, reset } = useForm()

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Create Fulfillment</span>
        </Modal.Header>
        <Modal.Content>
          <div className="space-y-4">
            <span className="inter-base-semibold">General</span>
            <div className="flex space-x-4">
              <Input label="First name" name="first_name" ref={register} />
              <Input label="Last name" name="last_name" ref={register} />
            </div>
            <div className="flex mt-4 space-x-4">
              <Input label="Email" name="email" ref={register} />
              <Input label="Phone" name="phone" ref={register} />
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <span className="inter-base-semibold">Address</span>
            <div className="flex space-x-4">
              <Input label="Address" name="address_1" ref={register} />
              <Input label="Address 2" name="address_2" ref={register} />
            </div>
            <div className="flex space-x-4">
              <Input label="State" name="province" ref={register} />
              <Input label="Postal code" name="postal_code" ref={register} />
            </div>
            <div className="flex space-x-4">
              <Input label="City" name="city" ref={register} />
              <Input label="Country code" name="country_code" ref={register} />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center"
              size="large"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CreateFulfillmentModal
