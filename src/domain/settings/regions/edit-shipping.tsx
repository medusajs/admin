import { Region, ShippingOption } from "@medusajs/medusa"
import {
  useAdminDeleteShippingOption,
  useAdminUpdateShippingOption,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../components/atoms/checkbox"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import CurrencyInput from "../../../components/organisms/currency-input"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

type EditShippingProps = {
  shippingOption: ShippingOption
  region: Region
  onSuccess: () => void
  onCancel: () => void
}

type EditShippingFormData = {
  requirements: {
    min_subtotal: {
      amount: number | null
      id: string | null
    }
    max_subtotal: {
      amount: number | null
      id: string | null
    }
  }
  name: string
  admin_only: boolean
  amount: number
}

const EditShipping = ({
  shippingOption,
  region,
  onSuccess,
  onCancel,
}: EditShippingProps) => {
  const { register, reset, handleSubmit, control } = useForm<
    EditShippingFormData
  >({
    defaultValues: mapShippingOption(shippingOption),
  })

  const [showDelete, setShowDelete] = useState(false)
  const deleteOption = useAdminDeleteShippingOption(shippingOption.id)
  const updateOption = useAdminUpdateShippingOption(shippingOption.id)
  const notification = useNotification()

  const handleDelete = async () => {
    deleteOption.mutate(undefined, {
      onSuccess: () => onSuccess(),
      onError: (error) => {
        setShowDelete(false)
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  useEffect(() => {
    reset(mapShippingOption(shippingOption))
  }, [shippingOption])

  const handleSave = (data: EditShippingFormData) => {
    const requirements = Object.entries(data.requirements).reduce(
      (acc, [type, { amount, id }]) => {
        if (amount) {
          acc[type].amount = amount
        }

        if (id) {
          acc[type].id = id
        }
        return acc
      },
      []
    )

    updateOption.mutate(
      {
        ...data,
        requirements,
        admin_only: !data.admin_only,
      },
      {
        onSuccess: () => {
          notification(
            "Success",
            "Successfully updated shipping option",
            "success"
          )
          onSuccess()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
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
        <Modal handleClose={onCancel}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Modal.Body>
              <Modal.Header handleClose={onCancel}>
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
                    {...register("name")}
                    placeholder="Shipping option name"
                    className="flex-grow"
                  />
                  <CurrencyInput
                    readOnly
                    currentCurrency={region.currency_code}
                    size="small"
                  >
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CurrencyInput.AmountInput
                            amount={value}
                            label="Price"
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                  </CurrencyInput>
                </div>
                <div className="mt-large mb-xlarge">
                  <Checkbox
                    {...register("admin_only")}
                    label="Show on website"
                  />
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
                        <Controller
                          name="requirements.min_subtotal.amount"
                          control={control}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <CurrencyInput.AmountInput
                                amount={value ?? undefined}
                                label="Min. subtotal"
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                      </CurrencyInput>
                      <CurrencyInput
                        readOnly
                        currentCurrency={region.currency_code}
                        size="small"
                      >
                        <Controller
                          name="requirements.max_subtotal.amount"
                          control={control}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <CurrencyInput.AmountInput
                                amount={value ?? undefined}
                                label="Price"
                                onChange={onChange}
                              />
                            )
                          }}
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
                    Delete
                  </button>
                </div>
              </Modal.Content>
              <Modal.Footer>
                <div className="flex items-center justify-end w-full gap-x-xsmall">
                  <Button
                    type="button"
                    onClick={onCancel}
                    variant="secondary"
                    size="small"
                    className="w-eventButton justify-center"
                  >
                    Cancel changes
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

const mapShippingOption = (
  shippingOption: ShippingOption
): EditShippingFormData => {
  const minSubtotal = shippingOption.requirements?.find(
    (r) => r.type === "min_subtotal"
  )
  const maxSubtotal = shippingOption.requirements?.find(
    (r) => r.type === "max_subtotal"
  )

  return {
    name: shippingOption.name,
    admin_only: !shippingOption.admin_only,
    amount: shippingOption.amount,
    requirements: {
      min_subtotal: {
        amount: minSubtotal?.amount || null,
        id: minSubtotal?.id || null,
      },
      max_subtotal: {
        amount: maxSubtotal?.amount || null,
        id: maxSubtotal?.id || null,
      },
    },
  }
}

export default EditShipping
