import {
  useAdminCreateShippingOption,
  useAdminShippingProfiles,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Box, Flex } from "rebass"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"
import Spinner from "../../../components/spinner"
import useToaster from "../../../hooks/use-toaster"
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
  const [profileOptions, setProfileOptions] = useState([])
  const createShippingOption = useAdminCreateShippingOption()
  const toaster = useToaster()

  const handleSave = (data: {
    name: string
    requirements: { amount: number; type: string }[]
    fulfillment_option: { value: string; label: string }
    profile_id: { value: string; label: string }
    amount: number
  }) => {
    const fOptions = fulfillmentOptions.map(provider => {
      const filtered = provider.options.filter(
        o => !!o.is_return === !!isReturn
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
          acc.push({ type: key, amount: Math.round(value.amount * 100) })
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
      profile_id: data.profile_id.value,
      requirements: reqs,
      price_type: "flat_rate",
      amount: Math.round(data.amount * 100),
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
      onError: error => {
        toaster(getErrorMessage(error), "error")
        console.error(error)
      },
    })
  }

  useEffect(() => {
    const opts = fulfillmentOptions.reduce((acc, provider, p) => {
      const filtered = provider.options.filter(
        o => !!o.is_return === !!isReturn
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
    setValue("fulfillment_option", opts[0])
  }, [fulfillmentOptions])

  useEffect(() => {
    const opts = isProfilesLoading
      ? []
      : shipping_profiles.map(p => ({
          label: p.name,
          value: p.id,
        }))

    setProfileOptions(opts)

    register({ name: "profile_id" }, { required: true })
    setValue("profile_id", opts[0])
  }, [isProfilesLoading, shipping_profiles])

  return (
    <Modal handleClose={onClick}>
      <form onSubmit={handleSubmit(handleSave)}>
        <Modal.Body>
          <Modal.Header handleClose={onClick}>
            <div>
              <h1 className="inter-xlarge-semibold">Add Shipping Option</h1>
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
              <div className="flex items-center gap-2xsmall">
                <Input
                  label="Currency"
                  value={region.currency_code.toUpperCase()}
                  readOnly
                  className="w-[120px] pointer-events-none"
                />
                <Input
                  label="Price"
                  type="number"
                  value={null}
                  ref={register({ required: true })}
                  name={"amount"}
                  placeholder="10"
                  required
                  min={0}
                  step={0.1}
                />
              </div>
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
              <Box mb={4}>
                {isProfilesLoading ? (
                  <Flex
                    fmlexDirection="column"
                    alignItems="center"
                    height="100vh"
                    mt="auto"
                  >
                    <Box height="75px" width="75px" mt="50%">
                      <Spinner dark />
                    </Box>
                  </Flex>
                ) : (
                  <Select
                    label="Shipping Profile"
                    value={profileOptions[0]}
                    onChange={e => {}}
                    required={true}
                    name="profile_id"
                    options={profileOptions}
                    ref={register({ required: true })}
                  />
                )}
              </Box>
            )}
            <Box mb={4}>
              <Select
                label="Fulfillment Method"
                value={options[0]}
                onChange={e => {}}
                required={true}
                name="fulfillment_option"
                options={options}
                ref={register({ required: true })}
              />
            </Box>
            {!isReturn && (
              <div>
                <p className="inter-base-semibold mb-base">Requirements</p>
                <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
                  <div className="flex items-center gap-2xsmall">
                    <Input
                      label="Currency"
                      value={region.currency_code.toUpperCase()}
                      readOnly
                      className="w-[120px] pointer-events-none"
                    />
                    <Input
                      label="Min. subtotal"
                      value={null}
                      type="number"
                      name={`requirements.min_subtotal.amount`}
                      min={0}
                      ref={register}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-2xsmall">
                    <Input
                      label="Currency"
                      value={region.currency_code.toUpperCase()}
                      readOnly
                      className="w-[120px] pointer-events-none"
                    />
                    <Input
                      label="Max. subtotal"
                      value={null}
                      type="number"
                      min={0}
                      name={`requirements.max_subtotal.amount`}
                      ref={register}
                      placeholder="100"
                    />
                  </div>
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
