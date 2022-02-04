import React, { useContext } from "react"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import AddressForm from "../address-form"
import { useForm } from "react-hook-form"

type RMAEditAddressSubModalProps = {
  onSubmit: (address) => void
  address: any
  order: any
  countries: any[]
  isLargeModal?: boolean
}

const RMAEditAddressSubModal: React.FC<RMAEditAddressSubModalProps> = ({
  onSubmit,
  address,
  order,
  countries,
  isLargeModal = true,
}) => {
  const { pop } = useContext(LayeredModalContext)

  const addressForm = useForm()

  const handleSubmit = (data) => {
    onSubmit(data.address)
    pop()
  }

  return (
    <>
      <Modal.Content isLargeModal={isLargeModal}>
        <div className="h-full">
          <h2 className="inter-base-semibold mb-4">Search for additional </h2>
        </div>{" "}
        <AddressForm
          address={address}
          country={order.shipping_address.country_code}
          allowedCountries={countries}
          form={addressForm}
        />
      </Modal.Content>
      <Modal.Footer isLargeModal={isLargeModal}>
        <div className="flex w-full justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            onClick={addressForm.handleSubmit(handleSubmit)}
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default RMAEditAddressSubModal
