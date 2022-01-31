import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"

type AddressModalProps = {
  handleClose: () => void
  handleSave: ({ data, type }) => Promise<void>
  address?: object
  email?: string
  type: "shipping" | "billing"
}

const AddressModal: React.FC<AddressModalProps> = ({
  address,
  email,
  handleClose,
  handleSave,
  type,
}) => {
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    reset({
      ...address,
      email,
    })
  }, [])

  const submit = (data) => {
    // Note: Data will contain email as well, which is not a part of addresses
    // Therefore, you will need to handle this in parent handleSave method
    return handleSave({ data, type })
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {type === "billing" ? "Billing" : "Shipping"} Address
          </span>
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
              onClick={handleSubmit(submit)}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddressModal
