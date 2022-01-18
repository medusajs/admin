import {
  useAdminDeleteShippingOption,
  useAdminUpdateShippingOption,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"

const EditShipping = ({ shippingOption, region, onDone, onClick }) => {
  const { register, reset, handleSubmit } = useForm()
  const [adminOnly, setAdminOnly] = useState(shippingOption?.admin_only)

  const deleteOption = useAdminDeleteShippingOption(shippingOption.id)
  const updateOption = useAdminUpdateShippingOption(shippingOption.id)
  const toaster = useToaster()

  useEffect(() => {
    const option = {
      ...shippingOption,
    }

    if (shippingOption.requirements) {
      const minSubtotal = shippingOption.requirements.find(
        (req) => req.type === "min_subtotal"
      )
      if (minSubtotal) {
        option.requirements.min_subtotal = {
          amount: minSubtotal.amount / 100,
          id: minSubtotal.id,
        }
      }
      const maxSubtotal = shippingOption.requirements.find(
        (req) => req.type === "max_subtotal"
      )
      if (maxSubtotal) {
        option.requirements.max_subtotal = {
          amount: maxSubtotal.amount / 100,
          id: maxSubtotal.id,
        }
      }
    }

    reset({ ...option, amount: option.amount / 100 })
  }, [shippingOption])

  const handleDelete = async () => {
    deleteOption.mutate(void {}, {
      onSuccess: () => {
        toaster("Successfully deleted shipping option", "success")
        if (onDone) {
          onDone()
        }
        onClick()
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  const buildShippingRequirements = (
    requirements: { amount: number; type: string }[]
  ) => {
    if (!requirements) return null

    return Object.entries(requirements).reduce((acc, [key, value]) => {
      if (value.amount && value.amount > 0) {
        const reqType = shippingOption.requirements.find(
          (req) => req.type === key
        )
        if (reqType) {
          acc.push({
            type: key,
            amount: Math.round(value.amount * 100),
            id: reqType.id,
          })
        } else {
          acc.push({
            type: key,
            amount: Math.round(value.amount * 100),
          })
        }
        return acc
      } else {
        return acc
      }
    }, [])
  }

  const handleSave = (data: {
    requirements: { amount: number; type: string }[]
    name: any
    amount: number
  }) => {
    const reqs = buildShippingRequirements(data.requirements)

    const payload = {
      name: data.name,
      amount: Math.round(data.amount * 100),
      requirements: reqs,
      admin_only: adminOnly,
    }

    updateOption.mutate(payload, {
      onSuccess: () => {
        toaster("Successfully updated shipping option", "success")
        if (onDone) {
          onDone()
        }
        onClick()
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  return (
    <Modal handleClose={onClick}>
      <form onSubmit={handleSubmit(handleSave)}>
        <Modal.Body>
          <Modal.Header handleClose={onClick}>
            <div>
              <h1 className="inter-xlarge-semibold">Edit Shipping Option</h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-large">
              <p className="inter-base-semibold">Fulfillment Method</p>
              <p className="inter-base-regular text-grey-50">
                {shippingOption.data.id} via {shippingOption.provider_id}
              </p>
            </div>
            <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
              <Input
                label="Name"
                name="name"
                ref={register}
                className="flex-grow"
              />
              <div className="flex items-center gap-2xsmall">
                <Input
                  label="Currency"
                  value={region.currency_code.toUpperCase()}
                  readOnly
                  className="w-[120px] pointer-events-none"
                  tabIndex={-1}
                />
                <Input
                  label="Price"
                  type="number"
                  ref={register}
                  name={"amount"}
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
            <p className="inter-base-semibold mb-base">Requirements</p>
            <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
              <div className="flex items-center gap-2xsmall">
                <Input
                  label="Currency"
                  value={region.currency_code.toUpperCase()}
                  readOnly
                  className="w-[120px] pointer-events-none"
                  tabIndex={-1}
                />
                <Input
                  label="Min. subtotal"
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
                  tabIndex={-1}
                />
                <Input
                  label="Max. subtotal"
                  type="number"
                  min={0}
                  name={`requirements.max_subtotal.amount`}
                  ref={register}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="mt-xlarge">
              <p className="inter-base-semibold">Danger Zone</p>
              <p className="inter-base-regular text-grey-50 mb-base">
                This will permanently delete this option from your Medusa Store
              </p>
              <button
                onClick={handleDelete}
                className="text-rose-50 inter-base-semibold"
              >
                Delete Option
              </button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full">
              <Button
                type="button"
                onClick={onClick}
                variant="ghost"
                size="small"
                className="w-eventButton justify-center"
              >
                Cancel Changes
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton justify-center"
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

export default EditShipping
