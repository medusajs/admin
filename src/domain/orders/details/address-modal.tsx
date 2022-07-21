import { Address, AdminPostOrdersOrderReq, Country } from "@medusajs/medusa"
import { useAdminUpdateOrder } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import AddressForm from "../../../components/templates/address-form"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type AddressModalFormData = {
  first_name: string
  last_name: string
  phone: string | null
  company: string | null
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
}

type AddressModalProps = {
  handleClose: () => void
  orderId: string
  allowedCountries?: Country[]
  address?: Address
  type: "shipping" | "billing"
}

const AddressModal = ({
  orderId,
  address,
  allowedCountries = [],
  handleClose,
  type,
}: AddressModalProps) => {
  const { mutate, isLoading } = useAdminUpdateOrder(orderId)
  const form = useForm({
    defaultValues: mapAddressToFormData(address),
  })
  const notification = useNotification()

  const countryOptions = allowedCountries
    .map((c) => ({ label: c.display_name, value: c.iso_2 }))
    .filter(Boolean)

  const handleUpdateAddress = (data: AddressModalFormData) => {
    const updateObj: AdminPostOrdersOrderReq = {}

    if (type === "shipping") {
      // @ts-ignore
      updateObj["shipping_address"] = {
        ...data,
        country_code: data.country_code.value,
      }
    } else {
      // @ts-ignore
      updateObj["billing_address"] = {
        ...data,
        country_code: data.country_code.value,
      }
    }

    return mutate(updateObj, {
      onSuccess: () => {
        notification("Success", "Successfully updated address", "success")
        handleClose()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form onSubmit={form.handleSubmit(handleUpdateAddress)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              {type === "billing" ? "Billing" : "Shipping"} Address
            </span>
          </Modal.Header>
          <Modal.Content>
            <AddressForm
              form={nestedForm(form)}
              countryOptions={countryOptions}
              type={type}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <Button
                variant="ghost"
                className="mr-2 w-32 text-small justify-center"
                size="large"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="w-32 text-small justify-center"
                variant="primary"
                type="submit"
                loading={isLoading}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

const mapAddressToFormData = (address?: Address): AddressModalFormData => {
  const countryDisplayName =
    isoAlpha2Countries[address?.country_code?.toUpperCase()]

  return {
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    phone: address?.phone || null,
    company: address?.company || null,
    address_1: address?.address_1 || "",
    address_2: address?.address_2 || null,
    city: address?.city || "",
    province: address?.province || null,
    country_code: address?.country_code
      ? { label: countryDisplayName, value: address.country_code }
      : { label: "", value: "" },
    postal_code: address?.postal_code || "",
  }
}

export default AddressModal
