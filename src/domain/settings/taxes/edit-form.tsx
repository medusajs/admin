import { useAdminUpdateTaxRate, useAdminUpdateRegion } from "medusa-react"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TaxRuleSelector from "./tax-rule-selector"
import { EditTaxRateDetails } from "./edit-tax-rate-details"
import { TaxRuleItem } from "./tax-rule-item"

const EditTaxRate = ({ modalContext, regionId, taxRate, onDismiss }) => {
  const updateTaxRate = useAdminUpdateTaxRate(taxRate.id)

  const [updatedRules, setUpdatedRules] = useState({})
  const { register, setValue, handleSubmit, watch } = useForm({
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

  const rules = watch(["products", "product_types", "shipping_options"])

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
        <EditTaxRateDetails lockName={false} register={register} />
        <div>
          <p className="inter-base-semibold mb-base">Overrides</p>
          {(rules.product_types.length > 0 ||
            rules.products.length > 0 ||
            rules.shipping_options.length > 0) && (
            <div className="flex flex-col gap-base">
              {rules.products.length > 0 && (
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
                          items: rules.products,
                          type: "products",
                        }
                      )
                    )
                  }}
                  index={1}
                  name="Product Rules"
                  description={`Applies to ${rules.products.length} product${
                    rules.products.length > 1 ? "s" : ""
                  }`}
                />
              )}
              {rules.product_types.length > 0 && (
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
                          items: rules.product_types,
                          type: "product_types",
                        }
                      )
                    )
                  }}
                  index={2}
                  name="Product Type Rules"
                  description={`Applies to ${
                    rules.product_types.length
                  } product type${rules.product_types.length > 1 ? "s" : ""}`}
                />
              )}
              {rules.shipping_options.length > 0 && (
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
                          items: rules.shipping_options,
                          type: "shipping_options",
                        }
                      )
                    )
                  }}
                  index={3}
                  name="Shipping Option Rules"
                  description={`Applies to ${
                    rules.shipping_options.length
                  } shipping option${
                    rules.shipping_options.length > 1 ? "s" : ""
                  }`}
                />
              )}
            </div>
          )}
          {!(
            rules.product_types.length &&
            rules.products.length &&
            rules.shipping_options.length
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

export const SimpleEditForm = ({ onDismiss, taxRate }) => {
  const updateRegion = useAdminUpdateRegion(taxRate.id)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      rate: taxRate.rate,
      code: taxRate.code,
    },
  })
  const notification = useNotification()

  const onSave = (data) => {
    const toSubmit = {
      tax_rate: parseFloat(data.rate),
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
        <EditTaxRateDetails lockName register={register} />
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
