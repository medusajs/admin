import { User } from "@medusajs/medusa"
import { useAdminUpdateUser } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"

type Props = {
  user: Omit<User, "password_hash">
  open: boolean
  onClose: () => void
}

type EditInformationFormType = {
  first_name: string | null
  last_name: string | null
  email: string
}

const EditUserInformationModal = ({ user, open, onClose }: Props) => {
  const { mutate } = useAdminUpdateUser(user.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditInformationFormType>({
    defaultValues: getDefaultValues(user),
  })

  useEffect(() => {
    reset(getDefaultValues(user))
  }, [open, user])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {},
      {
        onSuccess: () => {},
        onError: () => {},
      }
    )
  })

  return (
    <Modal handleClose={onClose} open={open} isLargeModal={false}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Edit information</h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col gap-y-base">
            <div className="grid grid-cols-2 gap-x-base">
              <InputField
                {...register("first_name")}
                errors={errors}
                label="First name"
              />
              <InputField
                {...register("last_name")}
                errors={errors}
                label="Last name"
              />
            </div>
            <InputField {...register("email")} label="Email" />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end gap-x-xsmall w-full">
            <Button variant="secondary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Submit and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (user: Omit<User, "password_hash">) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  }
}

export default EditUserInformationModal
