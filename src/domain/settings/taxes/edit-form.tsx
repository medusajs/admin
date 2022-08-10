import { TaxRate } from "@medusajs/medusa"
import { useAdminUpdateRegion, useAdminUpdateTaxRate } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import { ILayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { TaxRuleItem } from "./tax-rule-item"
import TaxRuleSelector from "./tax-rule-selector"

type EditTaxRateProps = {
  taxRate: TaxRate
  regionId: string
  modalContext: ILayeredModalContext
  onDismiss: () => void
}

export interface EditTaxRateFormData extends SimpleEditFormData {
  products: string[]
  product_types: string[]
  shipping_options: string[]
}

const EditTaxRate = ({
  modalContext,
  regionId,
  taxRate,
  onDismiss,
}: EditTaxRateProps) => {
  const updateTaxRate = useAdminUpdateTaxRate(taxRate.id)

  const [updatedRules, setUpdatedRules] = useState({})
  const { register, setValue, handleSubmit, watch } = useForm<
    EditTaxRateFormData
  >({
    defaultValues: {
      ...taxRate,
      products: taxRate.products.map((p) => p.id),
      product_types: taxRate.product_types.map((p) => p.id),
      shipping_options: taxRate.shipping_options.map((p) => p.id),
    },
  })
  const notification = useNotification()

  const onSave = (data) => {
    const toSubmit = data
    const conditionalFields = ["products", "product_types", "shipping_options"]

    for (const [key, value] of Object.entries(updatedRules)) {
      if (!value && key in toSubmit && conditionalFields.includes(key)) {
        delete toSubmit[key]
      }
    }

    updateTaxRate.mutate(toSubmit, {
      onSuccess: () => {
        notification("Success", "Successfully updated Tax Rate.", "success")
        onDismiss()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  useEffect(() => {
    register("products")
    register("product_types")
    register("shipping_options")
  }, [])

  const [products, product_types, shipping_options] = watch([
    "products",
    "product_types",
    "shipping_options",
  ])

  const handleOverridesSelected = (rule) => {
    setUpdatedRules((prev) => {
      prev[rule.type] = true
      return prev
    })
    switch (rule.type) {
      case "products":
        setValue("products", rule.items)
        break
      case "product_types":
        setValue("product_types", rule.items)
        break
      case "shipping_options":
        setValue("shipping_options", rule.items)
        break
      default:
        break
    }
  }

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Modal.Content>
        <div>
          <p className="inter-base-semibold mb-base">Details</p>
          <Input
            label="Name"
            placeholder="Rate name"
            {...register("name", { required: true })}
            className="mb-base min-w-[335px] w-full"
          />
          <Input
            type="number"
            min={0}
            max={100}
            step={0.01}
            label="Rate"
            placeholder="12"
            {...register("rate", { min: 0, max: 100, required: true })}
            className="mb-base min-w-[335px] w-full"
          />
          <Input
            placeholder="1000"
            label="Code"
            {...register("code", { required: true })}
            className="mb-base min-w-[335px] w-full"
          />
        </div>
        <div>
          <p className="inter-base-semibold mb-base">Overrides</p>
          {(product_types.length > 0 ||
            products.length > 0 ||
            shipping_options.length > 0) && (
            <div className="flex flex-col gap-base">
              {products.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({ type: "products", items: [] })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: products,
                          type: "products",
                        }
                      )
                    )
                  }}
                  index={1}
                  name="Product Rules"
                  description={`Applies to ${products.length} product${
                    products.length > 1 ? "s" : ""
                  }`}
                />
              )}
              {product_types.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({
                      type: "product_types",
                      items: [],
                    })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: product_types,
                          type: "product_types",
                        }
                      )
                    )
                  }}
                  index={2}
                  name="Product Type Rules"
                  description={`Applies to ${
                    product_types.length
                  } product type${product_types.length > 1 ? "s" : ""}`}
                />
              )}
              {shipping_options.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({
                      type: "shipping_options",
                      items: [],
                    })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: shipping_options,
                          type: "shipping_options",
                        }
                      )
                    )
                  }}
                  index={3}
                  name="Shipping Option Rules"
                  description={`Applies to ${
                    shipping_options.length
                  } shipping option${shipping_options.length > 1 ? "s" : ""}`}
                />
              )}
            </div>
          )}
          {!(
            product_types.length &&
            products.length &&
            shipping_options.length
          ) && (
            <Button
              type="button"
              onClick={() => {
                modalContext.push(
                  SelectOverridesScreen(
                    modalContext.pop,
                    regionId,
                    handleOverridesSelected
                  )
                )
              }}
              className="w-full mt-base"
              size="medium"
              variant="secondary"
            >
              <PlusIcon /> Add Overrides
            </Button>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            onClick={onDismiss}
            variant="ghost"
            size="small"
            className="w-eventButton justify-center"
          >
            Cancel
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
    </form>
  )
}

const SelectOverridesScreen = (
  pop,
  regionId,
  onOverridesSelected,
  options = {}
) => {
  return {
    title: "Add override",
    onBack: () => pop(),
    view: (
      <TaxRuleSelector
        regionId={regionId}
        onSubmit={onOverridesSelected}
        {...options}
      />
    ),
  }
}

type SimpleEditFormProps = {
  onDismiss: () => void
  taxRate: TaxRate
}

export interface SimpleEditFormData {
  name: string
  rate: number
  code: string
}

export const SimpleEditForm = ({ onDismiss, taxRate }: SimpleEditFormProps) => {
  const updateRegion = useAdminUpdateRegion(taxRate.id)

  const { register, handleSubmit } = useForm<SimpleEditFormData>({
    defaultValues: {
      name: taxRate.name,
      rate: taxRate.rate,
      code: taxRate.code,
    },
  })
  const notification = useNotification()

  const onSave = (data: SimpleEditFormData) => {
    const toSubmit = {
      tax_rate: data.rate,
      tax_code: data.code,
    }
    updateRegion.mutate(toSubmit, {
      onSuccess: () => {
        notification("Success", "Successfully updated default rate.", "success")
        onDismiss()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Modal.Content>
        <div>
          <p className="inter-base-semibold mb-base">Details</p>
          <Input
            disabled
            readOnly
            prefix={<LockIcon size={16} />}
            tabIndex={-1}
            label="Name"
            placeholder="Default"
            value={taxRate.name}
            className="mb-base min-w-[335px] w-full opacity-50 pointer-events-none"
          />
          <Input
            type="number"
            min={0}
            max={100}
            step={1}
            label="Rate"
            placeholder="12"
            {...register("rate", {
              min: 0,
              max: 100,
              required: true,
              valueAsNumber: true,
            })}
            className="mb-base min-w-[335px] w-full"
            required
          />
          <Input
            required
            placeholder="1000"
            label="Code"
            {...register("code", { required: true })}
            className="mb-base min-w-[335px] w-full"
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            onClick={onDismiss}
            variant="ghost"
            size="small"
            className="w-eventButton justify-center"
          >
            Cancel
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
    </form>
  )
}

export default EditTaxRate
