import React, { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import AddressForm from "../../../../components/templates/address-form"
import { nestedForm } from "../../../../utils/nested-form"
import { useNewOrderForm } from "../form"

const Billing = () => {
  const {
    context: { validCountries },
    form,
  } = useNewOrderForm()

  const [useShipping, setUseShipping] = useState(false)

  const shippingAddress = useWatch({
    control: form.control,
    name: "shipping_address",
  })

  const shippingAddressId = useWatch({
    control: form.control,
    name: "shipping_address_id",
  })

  useEffect(() => {
    if (!useShipping) {
      form.setValue("billing_address", {
        address_1: "",
        address_2: "",
        city: "",
        country_code: { label: "", value: "" },
        first_name: "",
        company: "",
        last_name: "",
        phone: "",
        postal_code: "",
        province: "",
      })
    }
  }, [useShipping])

  const onUseShipping = () => {
    setUseShipping(!useShipping)

    if (shippingAddressId) {
      form.setValue("billing_address_id", shippingAddressId)
      return
    }

    if (shippingAddress) {
      form.setValue("billing_address", shippingAddress)
      return
    }
  }

  return (
    <div className="min-h-[705px]">
      <span className="inter-base-semibold">Billing Address</span>
      {shippingAddress || shippingAddressId ? (
        <div
          className="items-center flex mt-4 mb-6 cursor-pointer"
          onClick={() => onUseShipping()}
        >
          <div
            className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
              useShipping && "bg-violet-60"
            }`}
          >
            <span className="self-center">
              {useShipping && <CheckIcon size={16} />}
            </span>
          </div>
          <input
            className="hidden"
            type="checkbox"
            onChange={() => onUseShipping()}
            checked={useShipping}
            tabIndex={-1}
          />
          <span className="ml-3 text-grey-90">Use same as shipping</span>
        </div>
      ) : null}
      {!useShipping && (
        <AddressForm
          countryOptions={validCountries}
          form={nestedForm(form, "billing_address")}
          type="billing"
        />
      )}
    </div>
  )
}

export default Billing
