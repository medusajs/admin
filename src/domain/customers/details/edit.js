import { useAdminUpdateCustomer } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import InputField from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"

const EditCustomerModal = ({ handleClose, customer }) => {
  const { register, reset, handleSubmit } = useForm()

  const toaster = useToaster()

  const updateCustomer = useAdminUpdateCustomer(customer.id)

  const submit = (data) => {
    updateCustomer.mutate(data, {
      onSuccess: () => {
        handleClose()
        toaster("Successfully updated customer", "success")
      },
      onError: (err) => {
        handleClose()
        toaster(getErrorMessage(err), "error")
      },
    })
  }

  useEffect(() => {
    reset({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email,
      phone: customer.phone || "",
    })
  }, [])

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Customer Details</span>
        </Modal.Header>
        <Modal.Content>
          <div className="inter-base-semibold text-grey-90 mb-4">General</div>
          <div className="w-full flex mb-4 space-x-2">
            <InputField
              label="First Name"
              name="first_name"
              placeholder="Lebron"
              ref={register}
            />
            <InputField
              label="Last Name"
              name="last_name"
              placeholder="James"
              ref={register}
            />
          </div>
          <div className="inter-base-semibold text-grey-90 mb-4">Contact</div>
          <div className="flex space-x-2">
            <InputField label="Email" name="email" disabled ref={register} />
            <InputField
              label="Phone number"
              name="phone"
              placeholder="+45 42 42 42 42"
              ref={register}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              loading={updateCustomer.isLoading}
              variant="primary"
              className="min-w-[100px]"
              size="small"
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

export default EditCustomerModal
