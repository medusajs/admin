import React, { useEffect, useState } from "react"
import AddressForm from "../../../../components/templates/address-form"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"

const Billing = ({ form, region }) => {
  const [useShipping, setUseShipping] = useState(false)

  const { shipping } = form.watch(["shipping"])

  useEffect(() => {
    if (!useShipping) {
      form.setValue("billing", {})
    }
  }, [useShipping])

  const onUseShipping = () => {
    setUseShipping(!useShipping)
    form.setValue("billing", { ...shipping })
  }

  return (
    <div className="min-h-[705px]">
      <span className="inter-base-semibold">Billing Address</span>
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
      {!useShipping && (
        <AddressForm
          allowedCountries={region.countries?.map((c) => c.iso_2) || []}
          form={form}
          country={shipping.country_code}
          type="billing"
        />
      )}
    </div>
  )
}

export default Billing
