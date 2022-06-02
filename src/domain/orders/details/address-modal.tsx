import React, { useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"

type AddressModalProps = {
  handleClose: () => void
  handleSave: ({ data, type }) => Promise<void>
  allowedCountries: string[]
  address?: object
  type: "shipping" | "billing"
}

const AddressModal: React.FC<AddressModalProps> = ({
  address,
  allowedCountries = [],
  handleClose,
  handleSave,
  type,
}) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { ...address },
  })

  register("country_code")

  const countryOptions = allowedCountries
    .map((c) => ({ label: c.display_name, value: c.iso_2 }))
    .filter(Boolean)

  const [selectedCountry, setSelectedCountry] = useState(
    countryOptions.find((o) => o.value === address?.country_code)
  )

  const setCountry = (value) => {
    if (!value) {
      setSelectedCountry(undefined)
    } else {
      setSelectedCountry(value)
      setValue("country_code", value.value)
    }
  }

  const submit = (data) => {
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
              <Input label="First name" {...register('first_name')} placeholder="First name" />
              <Input label="Last name" {...register('last_name')} placeholder="Last name" />
            </div>
            <div className="flex mt-4 space-x-4">
              <Input label="Phone" {...register('phone')} placeholder="Phone" />
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <span className="inter-base-semibold">Address</span>
            <div className="flex space-x-4">
              <Input label="Address" {...register('address_1')} placeholder="Address 1" />
              <Input label="Address 2" {...register('address_2')} placeholder="Address 2" />
            </div>
            <div className="flex space-x-4">
              <Input label="State" {...register('province')} placeholder="State or province" />
              <Input
                label="Postal code"
                {...register('postal_code')}
                placeholder="Postal code" />
            </div>
            <div className="flex space-x-4">
              <Input label="City" {...register('city')} placeholder="City" />
              <Select
                {...register('country_code')}
                label="Country"
                options={countryOptions}
                onChange={setCountry}
                value={selectedCountry} />
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
  );
}

export default AddressModal
