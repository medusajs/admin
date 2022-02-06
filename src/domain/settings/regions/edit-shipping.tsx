import {
  useAdminDeleteShippingOption,
  useAdminUpdateShippingOption,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import CurrencyInput from "../../../components/organisms/currency-input"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"

const EditShipping = ({ shippingOption, region, onDone, onClick }) => {
  const { register, reset, handleSubmit, setValue } = useForm()
  const [adminOnly, setAdminOnly] = useState(shippingOption?.admin_only)
  const [showDelete, setShowDelete] = useState(false)
  const deleteOption = useAdminDeleteShippingOption(shippingOption.id)
  const updateOption = useAdminUpdateShippingOption(shippingOption.id)
  const toaster = useToaster()

  useEffect(() => {
    if (shippingOption.requirements) {
      const minSubtotal = shippingOption.requirements.find(
        (req) => req.type === "min_subtotal"
      )
      if (minSubtotal) {
        shippingOption.requirements.min_subtotal = {
          amount: minSubtotal.amount,
          id: minSubtotal.id,
        }
      }
      const maxSubtotal = shippingOption.requirements.find(
        (req) => req.type === "max_subtotal"
      )
      if (maxSubtotal) {
        shippingOption.requirements.max_subtotal = {
          amount: maxSubtotal.amount,
          id: maxSubtotal.id,
        }
      }
    }

    reset({ ...shippingOption })
    register("amount")
    setValue("amount", shippingOption?.amount)

    register("requirements.min_subtotal.amount")
    setValue(
      "requirements.min_subtotal.amount",
      shippingOption?.requirements?.min_subtotal?.amount
    )

    register("requirements.max_subtotal.amount")
    setValue(
      "requirements.max_subtotal.amount",
      shippingOption?.requirements?.max_subtotal?.amount
    )
  }, [shippingOption])

  const handleDelete = async () => {
    deleteOption.mutate(void {}, {
      onSuccess: () => {
        onClick()
        if (onDone) {
          onDone()
        }
      },
      onError: (error) => {
        setShowDelete(false)
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  const buildShippingRequirements = (
    requirements: { amount: number; type: string }[]
  ) => {
    if (!requirements) {
      return null
    }

    return Object.entries(requirements).reduce<
      (
        | { type: string; amount: number; id: string }
        | { type: string; amount: number }
      )[]
    >((acc, [key, value]) => {
      if (value.amount && value.amount > 0) {
        const reqType = shippingOption.requirements.find(
          (req) => req.type === key
        )
        if (reqType) {
          acc.push({
            type: key,
            amount: value.amount,
            id: reqType.id,
          })
        } else {
          acc.push({
            type: key,
            amount: value.amount,
          })
        }
        return acc
      } else {
        return acc
      }
    }, [])
  }

  const handleMinChange = (amount: number | undefined) => {
    if (amount) {
      setValue("requirements.min_subtotal.amount", amount)
    }
  }

  const handleMaxChange = (amount: number | undefined) => {
    if (amount) {
      setValue("requirements.max_subtotal.amount", amount)
    }
  }

  const handleAmountChange = (amount: number | undefined) => {
    if (amount) {
      setValue("amount", amount)
    }
  }

  const handleSave = (data: {
    requirements: { amount: number; type: string }[]
    name: any
    amount: number
  }) => {
    const reqs = buildShippingRequirements(data.requirements)

    const payload = {
      name: data.name,
      amount: data.amount,
      requirements: reqs ?? [],
      admin_only: adminOnly,
    }

    // TODO: fix AdminPostShippingOptionsOptionReq type
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
    <>
      {showDelete ? (
        <DeletePrompt
          text={"Are you sure you want to delete this shipping option?"}
          successText="Successfully deleted shipping option"
          handleClose={() => setShowDelete(false)}
          onDelete={async () => {
            handleDelete()
          }}
        />
      ) : (
        <Modal handleClose={onClick}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Modal.Body>
              <Modal.Header handleClose={onClick}>
                <div>
                  <h1 className="inter-xlarge-semibold">
                    {shippingOption.is_return
                      ? "Edit Return Shipping Option"
                      : "Edit Shipping Option"}
                  </h1>
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
                    placeholder="Shipping option name"
                    className="flex-grow"
                  />
                  <CurrencyInput
                    readOnly
                    currentCurrency={region.currency_code}
                    size="small"
                  >
                    <CurrencyInput.AmountInput
                      amount={shippingOption.amount}
                      label="Price"
                      onChange={handleAmountChange}
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
                {!shippingOption.is_return && (
                  <>
                    <p className="inter-base-semibold mb-base">Requirements</p>
                    <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
                      <CurrencyInput
                        readOnly
                        currentCurrency={region.currency_code}
                        size="small"
                      >
                        <CurrencyInput.AmountInput
                          amount={
                            shippingOption.requirements?.min_subtotal?.amount
                          }
                          label="Min. subtotal"
                          onChange={handleMinChange}
                        />
                      </CurrencyInput>
                      <CurrencyInput
                        readOnly
                        currentCurrency={region.currency_code}
                        size="small"
                      >
                        <CurrencyInput.AmountInput
                          amount={
                            shippingOption.requirements?.max_subtotal?.amount
                          }
                          label="Max. subtotal"
                          onChange={handleMaxChange}
                        />
                      </CurrencyInput>
                    </div>
                  </>
                )}
                <div className="mt-xlarge">
                  <p className="inter-base-semibold">Danger Zone</p>
                  <p className="inter-base-regular text-grey-50 mb-base">
                    This will permanently delete this option from your Medusa
                    Store
                  </p>
                  <button
                    onClick={() => setShowDelete(true)}
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
      )}
    </>
  )
}

export default EditShipping
