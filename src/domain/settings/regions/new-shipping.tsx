import {
  useAdminCreateShippingOption,
  useAdminShippingProfiles,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Spinner from "../../../components/atoms/spinner"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"
import CurrencyInput from "../../../components/organisms/currency-input"
import useToaster from "../../../hooks/use-toaster"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"

const NewShipping = ({
  isReturn,
  fulfillmentOptions,
  region,
  onCreated,
  onClick,
}) => {
  const { register, setValue, handleSubmit } = useForm()
  const {
    shipping_profiles,
    isLoading: isProfilesLoading,
  } = useAdminShippingProfiles()
  const [adminOnly, setAdminOnly] = useState(false)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [profileOptions, setProfileOptions] = useState<Option[]>([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const createShippingOption = useAdminCreateShippingOption()
  const toaster = useToaster()

  useEffect(() => {
    register("amount", { required: true })
    register("requirements.max_subtotal.amount")
    register("requirements.min_subtotal.amount")
  }, [])

  const handleAmountChange = (fieldName: string, amount?: number) => {
    setValue(fieldName, amount)
  }

  const handleSave = (data: {
    name: string
    requirements: { amount: number; type: string }[]
    fulfillment_option: { value: string; label: string }
    profile_id: { value: string; label: string }
    amount: number
  }) => {
    const fOptions = fulfillmentOptions.map((provider) => {
      const filtered = provider.options.filter(
        (o) => !!o.is_return === !!isReturn
      )

      return {
        ...provider,
        options: filtered,
      }
    })

    const [providerIndex, optionIndex] = data.fulfillment_option.value.split(
      "."
    )
    const { provider_id, options } = fOptions[providerIndex]

    let reqs = []
    if (data.requirements) {
      reqs = Object.entries(data.requirements).reduce((acc, [key, value]) => {
        if (value.amount && value.amount > 0) {
          acc.push({ type: key, amount: value.amount })
          return acc
        } else {
          return acc
        }
      }, [])
    }

    const payload = {
      name: data.name,
      data: options[optionIndex],
      region_id: region.id,
      profile_id: data.profile_id?.value,
      requirements: reqs,
      price_type: "flat_rate",
      amount: data.amount,
      is_return: isReturn,
      provider_id,
      admin_only: adminOnly,
    }

    createShippingOption.mutate(payload, {
      onSuccess: () => {
        toaster("Successfully created shipping option", "success")
        if (onCreated) {
          onCreated()
        }
        onClick()
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  useEffect(() => {
    const opts = fulfillmentOptions.reduce((acc, provider, p) => {
      const filtered = provider.options.filter(
        (o) => !!o.is_return === !!isReturn
      )

      return acc.concat(
        filtered.map((option, o) => ({
          label: `${option.id} via ${
            fulfillmentProvidersMapper(provider.provider_id).label
          }`,
          value: `${p}.${o}`,
        }))
      )
    }, [])

    setOptions(opts)

    register({ name: "fulfillment_option" }, { required: true })
  }, [fulfillmentOptions])

  useEffect(() => {
    const opts = !shipping_profiles
      ? []
      : shipping_profiles.map((p) => ({
          label: p.name,
          value: p.id,
        }))

    setProfileOptions(opts)

    if (!isReturn) {
      register({ name: "profile_id" }, { required: true })
    }
  }, [isProfilesLoading, shipping_profiles])

  const handleProfileChange = (value) => {
    setValue("profile_id", value)
    setSelectedProfile(value)
  }

  const handleFulfillmentChange = (value) => {
    setValue("fulfillment_option", value)
    setSelectedOption(value)
  }

  return (
    <Modal handleClose={onClick}>
      <form onSubmit={handleSubmit(handleSave)}>
        <Modal.Body>
          <Modal.Header handleClose={onClick}>
            <div>
              <h1 className="inter-xlarge-semibold">
                {isReturn
                  ? "Add Return Shipping Option"
                  : "Add Shipping Option"}
              </h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
              <Input
                label="Name"
                name="name"
                ref={register({ required: true })}
                required
                placeholder="New Shipping Option"
                className="flex-grow"
              />
              <CurrencyInput currentCurrency={region.currency_code} readOnly>
                <CurrencyInput.AmountInput
                  label="Price"
                  onChange={(v) => handleAmountChange("amount", v)}
                  amount={undefined}
                />
              </CurrencyInput>
            </div>
            <div className="mt-large mb-xlarge">
              <label className="inline-flex items-center inter-base-semibold">
                <input
                  type="checkbox"
                  id="true"
                  name="requires_shipping"
                  value="true"
                  checked={!adminOnly}
                  onChange={() => setAdminOnly(!adminOnly)}
                  className="mr-small w-5 h-5 accent-violet-60 rounded-base"
                />
                Show on website
              </label>
            </div>
            {!isReturn && (
              <div className="mb-base">
                {isProfilesLoading ? (
                  <div className="flex flex-col items-center justify-center h-screen mt-auto">
                    <div className="h-[75px] w-[75px] mt-[50%]">
                      <Spinner />
                    </div>
                  </div>
                ) : (
                  <Select
                    label="Shipping Profile"
                    value={selectedProfile}
                    onChange={handleProfileChange}
                    required
                    name="profile_id"
                    options={profileOptions}
                  />
                )}
              </div>
            )}
            <div className="mb-base">
              <Select
                label="Fulfillment Method"
                value={selectedOption}
                onChange={handleFulfillmentChange}
                required
                name="fulfillment_option"
                options={options}
              />
            </div>
            {!isReturn && (
              <div>
                <p className="inter-base-semibold mb-base">Requirements</p>
                <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
                  <CurrencyInput
                    currentCurrency={region.currency_code}
                    readOnly
                  >
                    <CurrencyInput.AmountInput
                      label="Price"
                      onChange={(v) =>
                        handleAmountChange(
                          "requirements.min_subtotal.amount",
                          v
                        )
                      }
                      amount={undefined}
                    />
                  </CurrencyInput>
                  <CurrencyInput
                    currentCurrency={region.currency_code}
                    readOnly
                  >
                    <CurrencyInput.AmountInput
                      label="Price"
                      onChange={(v) =>
                        handleAmountChange(
                          "requirements.max_subtotal.amount",
                          v
                        )
                      }
                      amount={undefined}
                    />
                  </CurrencyInput>
                </div>
              </div>
            )}
          </Modal.Content>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button
                variant="ghost"
                size="small"
                className="justify-center w-[130px]"
                onClick={onClick}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="justify-center w-[130px]"
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

export default NewShipping
